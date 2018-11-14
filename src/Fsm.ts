import { Assert, Second } from './types/helpers';
import { ActionShape, Dispatch, ActionPayloads, ActionHandlers, Model } from './types/Actions';

export function renderCurrent<S extends string, GT extends GraphTemplate<S>>(
  fsm: Fsm<S, GT>,
  onStateChange: ([s, m]: [S, Model]) => void,
) {
  const node = fsm.graph[fsm.current];

  return node.render(action => {
    onStateChange(node.transition(action, node.model));
  }, node.model);
}

// === Fsm ===
export type Fsm<S extends string, GT extends GraphTemplate<S> = GraphTemplate<S>> = {
  current: S;
  graph: Graph<S, GT>;
};

type Graph<S extends string, GT extends GraphTemplate<S>> = { [s in S]: FsmNode<GT[s], GT[S]> };

type FsmNode<CNT extends NodeTemplate, NT extends NodeTemplate> = {
  model: GetModel<CNT>;
  transition: (a: GetAction<CNT>, m: GetModel<CNT>) => NT['stateModel'];
  actionHandlers?: CNT['actionHandlers'];
  render: (d: Dispatch<GetAction<CNT>>, m: GetModel<CNT>) => JSX.Element;
};

// === Templates ===
export type DefineTemplate<S extends string, TD extends TemplateDefinition<S>> = Assert<
  GraphTemplate<S>,
  {
    [s in S]: {
      action: TD[s]['action'];
      actionHandlers: ActionHandlers<[s, TD[s]['model']], TD[s]['actionPayloads']>;
      stateModel: [s, TD[s]['model']];
    }
  }
>;

type TemplateDefinition<S extends string> = {
  [s in S]: {
    action: ActionShape;
    actionPayloads: ActionPayloads;
    model: Model;
  }
};

export type GraphTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string = string> = {
  action: ActionShape;
  actionHandlers: ActionHandlers<[S, Model]>;
  stateModel: [S, Model];
};

type GetModel<NT extends NodeTemplate> = Assert<Model, Second<NT['stateModel']>>;
type GetAction<NT extends NodeTemplate> = Assert<ActionShape, NT['action']>;
