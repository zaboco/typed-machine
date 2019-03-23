import { Assert, First, Second } from '../types/helpers';
import {
  DeriveMessage,
  Dispatch,
  FullDeriveMessage,
  FullMessageShape,
  MessageHandlers,
  MessagePayloads,
  ModelShape,
} from '../types/Messages';

let currentState: string = '';

export function currentView<R, S extends string, GT extends GraphTemplate<S>>(
  machine: Machine<S, GT>,
  views: Views<R, S, GT>,
  onChange: (updatedMachine: Machine<S, GT>) => void,
): R {
  const handleMessage = (machine: Machine<S, GT>, message: any) => {
    const node = machine.graph[machine.current];

    if (node.asyncTransitions) {
      const asyncHandler = node.asyncTransitions[message[0]];
      const { state: newState, model: newModel, next } = asyncHandler(node.model, message[1]!);

      const newMachine = {
        current: newState as S,
        graph: Object.assign({}, machine.graph, {
          [newState]: Object.assign({}, machine.graph[newState as S], {
            model: newModel,
          }),
        }),
      };

      if (next) {
        next.thunk().then(p => {
          if (currentState === newMachine.current) {
            handleMessage(newMachine, [next.onSucces, p]);
          } else {
            console.log('state has changed, doing nothing');
          }
        });
      }

      currentState = newState;
      onChange(newMachine);
      return;
    }

    const handler = node.transitions[message[0]];

    // Condition needed only when coming from JS. In TS this code is unreachable.
    // If the transition is invalid, silently ignore it, returning the current machine.
    if (handler === undefined) {
      onChange(machine);
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

    currentState = newState;
    onChange(newMachine);
  };

  return views[machine.current](
    (...message) => handleMessage(machine, message),
    machine.graph[machine.current].model,
  );
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
  asyncTransitions?: AsyncMessageHandlers<
    NT['stateModelNext'],
    GetModel<CNT>,
    CNT['transitionPayloads']
  >;
};

type AsyncMessageHandlers<R, M, MP extends MessagePayloads = MessagePayloads> = {
  [t in keyof MP]: (m: M, p: MP[t]) => R
};

// DelayedTransition<Third3<R>>

export type DelayedTransition<M extends FullMessageShape> = {
  thunk: () => Promise<Second<M>>;
  onSucces: First<M>;
};

type GetModel<NT extends NodeTemplate> = Assert<ModelShape, Second<NT['stateModel']>>;

// === Templates ===
export type DefineTemplate<S extends string, TD extends TemplateDefinition<S>> = Assert<
  GraphTemplate<S>,
  {
    [s in S]: {
      transitionPayloads: TD[s]['transitionPayloads'];
      stateModel: [s, TD[s]['model']];
      stateModelNext: {
        state: s;
        model: TD[s]['model'];
        next?: DelayedTransition<FullDeriveMessage<TD[s]['transitionPayloads']>>;
      };
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
  stateModelNext: { state: S; model: ModelShape; next?: DelayedTransition<FullMessageShape> };
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
