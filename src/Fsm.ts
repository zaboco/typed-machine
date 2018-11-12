import { Action, Dispatch } from './types/Actions';
import { Assert, Second } from './types/helpers';

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
  render: (d: Dispatch<GetAction<CNT>>, m: GetModel<CNT>) => JSX.Element;
};

// === Templates ===
export type DefineTemplate<S extends string, GT extends TemplateDefinition<S>> = Assert<
  GraphTemplate<S>,
  {
    [s in S]: {
      action: GT[s]['action'];
      stateModel: [s, GT[s]['model']];
    }
  }
>;

type TemplateDefinition<S extends string> = {
  [s in S]: {
    action: Action;
    model: Model;
  }
};

export type GraphTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string = string> = {
  action: Action;
  stateModel: [S, Model];
};

type GetModel<NT extends NodeTemplate> = Assert<Model, Second<NT['stateModel']>>;
type GetAction<NT extends NodeTemplate> = Assert<Action, NT['action']>;

type Model = Object | string | number | boolean | null; // | undefined
