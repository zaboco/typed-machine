import { Assert, Second, KeyValues } from './types/helpers';
import {
  ActionShape,
  Dispatch,
  ActionPayloads,
  ActionHandlers,
  Model,
  DeriveAction,
} from './types/Actions';

export function renderCurrent<S extends string, GT extends GraphTemplate<S>>(
  fsm: Fsm<S, GT>,
  onStateChange: ([s, m]: [S, Model]) => void,
) {
  const node = fsm.graph[fsm.current];

  return node.render(action => {
    const handler = node.actionHandlers[action[0]] as Function;
    if (action[1] === undefined) {
      onStateChange(handler(node.model));
    } else {
      onStateChange(handler(node.model, action[1]));
    }
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
  actionHandlers: ActionHandlers<NT['stateModel'], GetModel<CNT>, CNT['actionPayloads']>;
  render: (d: Dispatch<GetAction<CNT>>, m: GetModel<CNT>) => JSX.Element;
};

// === Templates ===
export type DefineTemplate<S extends string, TD extends TemplateDefinition<S>> = Assert<
  GraphTemplate<S>,
  {
    [s in S]: {
      action: DeriveAction<TD[s]['actionPayloads']>;
      actionPayloads: TD[s]['actionPayloads'];
      stateModel: [s, TD[s]['model']];
    }
  }
>;

type TemplateDefinition<S extends string> = {
  [s in S]: {
    actionPayloads: ActionPayloads;
    model: Model;
  }
};

export type GraphTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string = string> = {
  action: ActionShape;
  actionPayloads: ActionPayloads;
  stateModel: [S, Model];
};

type GetModel<NT extends NodeTemplate> = Assert<Model, Second<NT['stateModel']>>;
type GetAction<NT extends NodeTemplate> = Assert<ActionShape, NT['action']>;
