import { Assert, Second } from '../types/helpers';
import {
  DeriveMessage,
  Dispatch,
  MessageHandlers,
  MessagePayloads,
  ModelShape,
} from '../types/Messages';

export interface MachineContainer<S extends string, GT extends GraphTemplate<S>> {
  view: <R>(views: Views<R, S, GT>) => R;
  subscribe: Subscribe<S, GT>;
}

export type Unsubscribe = () => void;
type Listener<S extends string, GT extends GraphTemplate<S>> = (
  msg: DeriveMessage<GT[S]['transitionPayloads']>,
) => void;
type Subscribe<S extends string, GT extends GraphTemplate<S>> = (
  listener: Listener<S, GT>,
) => Unsubscribe;

export function createMachineContainer<S extends string, GT extends GraphTemplate<S>>(
  initialMachine: Machine<S, GT>,
): MachineContainer<S, GT> {
  let listeners: Listener<S, GT>[] = [];
  let currentState = initialMachine.current;
  let models = initialMachine.models;
  const graph = initialMachine.graph;

  const view = <R>(views: Views<R, S, GT>): R => {
    return views[currentState]((...message) => {
      const transitionHandler = graph[currentState][message[0]];

      // Condition needed only when coming from JS. In TS this code is unreachable.
      // If the transition is invalid, silently ignore it, returning the current machine.
      if (transitionHandler === undefined) {
        return;
      }

      const [newState, newModel] = transitionHandler(models[currentState], message[1]!);

      currentState = newState as S;
      models = { ...models, [newState]: newModel };

      listeners.forEach(listener => {
        listener(message);
      });
    }, models[currentState]);
  };

  const subscribe: Subscribe<S, GT> = newListener => {
    listeners.push(newListener);

    return () => {
      listeners = listeners.filter(listener => listener !== newListener);
    };
  };

  return {
    view,
    subscribe,
  };
}

// === Machine ===
export type Machine<S extends string, GT extends GraphTemplate<S> = GraphTemplate<S>> = Assert<
  MachineShape,
  {
    current: S;
    models: { [s in S]: GetModel<GT[s]> };
    graph: {
      [s in S]: MessageHandlers<GT[S]['stateModel'], GetModel<GT[s]>, GT[s]['transitionPayloads']>
    };
  }
>;

export type MachineModels<S extends string, GT extends GraphTemplate<S>> = {
  [s in S]: GetModel<GT[s]>
};

export type MachineGraph<S extends string, GT extends GraphTemplate<S>> = {
  [s in S]: MessageHandlers<GT[S]['stateModel'], GetModel<GT[s]>, GT[s]['transitionPayloads']>
};

type GetModel<NT extends NodeTemplate> = Assert<ModelShape, Second<NT['stateModel']>>;

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

type NodeTemplate<S extends string = string> = {
  transitionPayloads: MessagePayloads;
  stateModel: [S, ModelShape];
};

// === Type Helpers ===

export type Views<R, S extends string, GT extends GraphTemplate<S>> = { [s in S]: View<R, s, GT> };

export type View<R, S extends string, GT extends GraphTemplate<S>> = (
  d: Dispatch<Message<S, GT>>,
  m: GetModel<GT[S]>,
) => R;

export type Message<S extends string, GT extends GraphTemplate<S>> = DeriveMessage<
  GT[S]['transitionPayloads']
>;
export type Transitions<M extends MachineShape, S extends M['current']> = M['graph'][S];
export type Model<M extends MachineShape, S extends M['current']> = M['models'][S];

type MachineShape = {
  current: string;
  models: Record<string, ModelShape>;
  graph: Record<string, Record<string, (model: any, payload: any) => [string, any]>>;
};
