import { Assert, Second } from './types/helpers';
import { ActionPayloads, ActionHandlers, Model, DeriveAction, Dispatch } from './types/Actions';

export function renderCurrent<R, S extends string, GT extends GraphTemplate<S>>(
  fsm: Fsm<R, S, GT>,
  onStateChange: ([s, m]: [S, Model]) => void,
): R {
  const node = fsm.graph[fsm.current];

  return node.render((...action) => {
    const handler = node.transitions[action[0]];
    onStateChange(handler(node.model, action[1]));
  }, node.model);
}

// === Fsm ===
export type Fsm<R, S extends string, GT extends GraphTemplate<S> = GraphTemplate<S>> = {
  current: S;
  graph: Graph<R, S, GT>;
};

type Graph<R, S extends string, GT extends GraphTemplate<S>> = {
  [s in S]: FsmNode<R, GT[s], GT[S]>
};

type FsmNode<R, CNT extends NodeTemplate, NT extends NodeTemplate> = {
  model: GetModel<CNT>;
  transitions: ActionHandlers<NT['stateModel'], GetModel<CNT>, CNT['transitionPayloads']>;
  render: (d: Dispatch<DeriveAction<CNT['transitionPayloads']>>, m: GetModel<CNT>) => R;
};

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
    transitionPayloads: ActionPayloads;
    model: Model;
  }
};

export type GraphTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string = string> = {
  transitionPayloads: ActionPayloads;
  stateModel: [S, Model];
};

type GetModel<NT extends NodeTemplate> = Assert<Model, Second<NT['stateModel']>>;
