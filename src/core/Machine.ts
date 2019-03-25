import { Assert, Second } from '../types/helpers';
import {
  DeriveMessage,
  Dispatch,
  MessageHandlers,
  MessagePayloads,
  ModelShape,
} from '../types/Messages';

export interface Machine<S extends string, GT extends GraphTemplate<S>> {
  currentView: <R>(views: Views<R, S, GT>) => R;
  subscribe: Subscribe<S, GT>;
}

export type Unsubscribe = () => void;

type Listener<S extends string, GT extends GraphTemplate<S>> = (msg: Message<S, GT>) => void;

type Subscribe<S extends string, GT extends GraphTemplate<S>> = (
  listener: Listener<S, GT>,
) => Unsubscribe;

export function machineFactory<S extends string, GT extends GraphTemplate<S>>(
  graph: MachineGraph<S, GT>,
): (...initialStateModel: GT[S]['stateModel']) => Machine<S, GT> {
  return (initialState, initialModel) => {
    let listeners: Listener<S, GT>[] = [];
    let currentState: S = initialState as S;
    let model: ModelShape = initialModel;

    const view = <R>(views: Views<R, S, GT>): R => {
      return views[currentState]((...message) => {
        const transitionHandler = graph[currentState][message[0]];

        // Condition needed only when coming from JS. In TS this code is unreachable.
        // If the transition is invalid, silently ignore it, returning the current machine.
        if (transitionHandler === undefined) {
          return;
        }

        const [newState, newModel] = transitionHandler(model, message[1]!);

        currentState = newState as S;
        model = newModel;

        listeners.forEach(listener => {
          listener(message);
        });
      }, model);
    };

    const subscribe: Subscribe<S, GT> = newListener => {
      listeners.push(newListener);

      return () => {
        listeners = listeners.filter(listener => listener !== newListener);
      };
    };

    return {
      currentView: view,
      subscribe,
    };
  };
}

// === Machine Graph ===
export type MachineGraph<S extends string, GT extends GraphTemplate<S>> = Assert<
  MachineGraphShape,
  {
    [s in S]: MessageHandlers<GT[S]['stateModel'], GetModel<s, GT[s]>, GT[s]['transitionPayloads']>
  }
>;

type GetModel<S extends string, NT extends NodeTemplate<S>> = Assert<
  ModelShape,
  Second<NT['stateModel']>
>;

// === Templates ===
export type DefineTemplate<S extends string, TD extends TemplateDefinition<S>> = Assert<
  GraphTemplate<S>,
  {
    [s in S]: {
      transitionPayloads: TD[s]['transitionPayloads'];
      stateModel: [s, TD[s]['model']];
    }
  }
>;

type TemplateDefinition<S extends string> = {
  [s in S]: {
    transitionPayloads: MessagePayloads;
    model: ModelShape;
  }
};

export type GraphTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string> = {
  transitionPayloads: MessagePayloads;
  stateModel: [S, ModelShape];
};

// === Type Helpers ===

export type Views<R, S extends string, GT extends GraphTemplate<S>> = { [s in S]: View<R, s, GT> };

export type View<R, S extends string, GT extends GraphTemplate<S>> = (
  dispatch: Dispatch<Message<S, GT>>,
  model: GetModel<S, GT[S]>,
) => R;

export type Message<S extends string, GT extends GraphTemplate<S>> = DeriveMessage<
  GT[S]['transitionPayloads']
>;

export type Transitions<MG extends MachineGraphShape, S extends keyof MG> = MG[S];

type MachineGraphShape = Record<
  string,
  Record<string, (model: any, payload: any) => [string, any]>
>;
