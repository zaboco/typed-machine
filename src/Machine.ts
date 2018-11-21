import { Assert, Second } from './types/helpers';
import {
  MessagePayloads,
  MessageHandlers,
  Model,
  DeriveMessage,
  Dispatch,
  MessageShape,
} from './types/Messages';

export function currentView<R, S extends string, GT extends GraphTemplate<S>>(
  machine: Machine<R, S, GT>,
  onChange: (updatedMachine: Machine<R, S, GT>) => void,
): R {
  const node = machine.graph[machine.current];

  return node.view((...message) => {
    const handler = node.transitions[message[0]];

    // Condition needed only when coming from JS. In TS this code is unreachable.
    // If the transition is invalid, silently ignore it, returning the current machine.
    if (handler === undefined) {
      onChange(machine);
      return;
    }

    const [newState, newModel] = handler(node.model, message[1]);
    const newMachine = {
      current: newState,
      graph: Object.assign({}, machine.graph, {
        [newState]: Object.assign({}, machine.graph[newState], {
          model: newModel,
        }),
      }),
    };

    onChange(newMachine);
  }, node.model);
}

// === Machine ===
export type Machine<R, S extends string, GT extends GraphTemplate<S> = GraphTemplate<S>> = Assert<
  MachineShape,
  {
    current: S;
    graph: Graph<R, S, GT>;
  }
>;

type Graph<R, S extends string, GT extends GraphTemplate<S>> = {
  [s in S]: MachineNode<R, GT[s], GT[S]>
};

type MachineNode<R, CNT extends NodeTemplate, NT extends NodeTemplate> = {
  model: GetModel<CNT>;
  transitions: MessageHandlers<NT['stateModel'], GetModel<CNT>, CNT['transitionPayloads']>;
  view: (d: Dispatch<DeriveMessage<CNT['transitionPayloads']>>, m: GetModel<CNT>) => R;
};

type GetModel<NT extends NodeTemplate> = Assert<Model, Second<NT['stateModel']>>;

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
    model: Model;
  }
};

export type GraphTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string = string> = {
  transitionPayloads: MessagePayloads;
  stateModel: [S, Model];
};

// === Type Helpers ===

export type View<M extends MachineShape, S extends M['current']> = M['graph'][S]['view'];

export type Transitions<
  M extends MachineShape,
  S extends M['current']
> = M['graph'][S]['transitions'];

type MachineShape = {
  current: string;
  graph: {
    [s: string]: {
      model: Model;
      view: (dispatch: Dispatch<MessageShape>, model: any) => any;
      transitions: {
        [mt: string]: (model: any, payload: any) => [string, any];
      };
    };
  };
};
