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
  let machine = initialMachine;
  let listeners: Listener<S, GT>[] = [];

  const view = <R>(views: Views<R, S, GT>): R => {
    return currentView(machine, views, (newMachine, msg) => {
      machine = newMachine;
      listeners.forEach(listener => {
        listener(msg);
      });
    });
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

export function currentView<R, S extends string, GT extends GraphTemplate<S>>(
  machine: Machine<S, GT>,
  views: Views<R, S, GT>,
  onChange: (
    updatedMachine: Machine<S, GT>,
    msg: DeriveMessage<GT[S]['transitionPayloads']>,
  ) => void,
): R {
  const node = machine.graph[machine.current];

  return views[machine.current]((...message) => {
    const handler = node.transitions[message[0]];

    // Condition needed only when coming from JS. In TS this code is unreachable.
    // If the transition is invalid, silently ignore it, returning the current machine.
    if (handler === undefined) {
      onChange(machine, message);
      return;
    }

    const [newState, newModel] = handler(node.model, message[1]!);
    const newMachine = {
      current: newState as S,
      graph: Object.assign({}, machine.graph, {
        [newState]: Object.assign({}, machine.graph[newState as S], {
          model: newModel,
        }),
      }),
    };

    onChange(newMachine, message);
  }, node.model);
}

// === Machine ===
export type Machine<S extends string, GT extends GraphTemplate<S> = GraphTemplate<S>> = Assert<
  MachineShape,
  {
    current: S;
    graph: Graph<S, GT>;
  }
>;

type Graph<S extends string, GT extends GraphTemplate<S>> = { [s in S]: MachineNode<GT[s], GT[S]> };

type MachineNode<CNT extends NodeTemplate, NT extends NodeTemplate> = {
  model: GetModel<CNT>;
  transitions: MessageHandlers<NT['stateModel'], GetModel<CNT>, CNT['transitionPayloads']>;
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
  d: Dispatch<DeriveMessage<GT[S]['transitionPayloads']>>,
  m: GetModel<GT[S]>,
) => R;

export type Transitions<
  M extends MachineShape,
  S extends M['current']
> = M['graph'][S]['transitions'];

export type Model<M extends MachineShape, S extends M['current']> = M['graph'][S]['model'];

type MachineShape = {
  current: string;
  graph: {
    [s: string]: {
      model: ModelShape;
      transitions: {
        [mt: string]: (model: any, payload: any) => [string, any];
      };
    };
  };
};
