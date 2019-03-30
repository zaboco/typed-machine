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
  return views[machine.current]((...message) => {
    const handler = machine.graph[machine.current][message[0]];

    // Condition needed only when coming from JS. In TS this code is unreachable.
    // If the transition is invalid, silently ignore it, returning the current machine.
    if (handler === undefined) {
      onChange(machine, message);
      return;
    }

    const [newState, newModel] = handler(machine.models[machine.current], message[1]!);
    const newMachine: Machine<S, GT> = {
      current: newState as S,
      models: Object.assign({}, machine.models, {
        [newState]: newModel,
      }),
      graph: machine.graph,
    };

    onChange(newMachine, message);
  }, machine.models[machine.current]);
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

export type Transitions<M extends MachineShape, S extends M['current']> = M['graph'][S];

export type Model<M extends MachineShape, S extends M['current']> = M['graph'][S]['model'];

type MachineShape = {
  current: string;
  models: Record<string, ModelShape>;
  graph: Record<string, Record<string, (model: any, payload: any) => [string, any]>>;
};
