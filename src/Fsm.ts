import { Action, Dispatch } from './types/Actions';
import { Assert, Second } from './types/helpers';

export { Assert };

export function renderCurrent<S extends string, MT extends MachineTemplate<S>>(
  fsm: Fsm<S, MT>,
  onStateChange: ([s, m]: [S, Model]) => void,
) {
  const node = fsm.graph[fsm.current];

  return node.render(action => {
    onStateChange(node.transition(action, node.model));
  }, node.model);
}

export interface Fsm<S extends string, MT extends MachineTemplate<S>> {
  current: S;
  graph: Graph<S, MT>;
}

export type MachineTemplate<S extends string> = {
  [s in S]: {
    action: Action;
    model: Model;
  }
};

type Graph<S extends string, MT extends MachineTemplate<S>> = {
  [s in S]: FsmNode<Derive<S, MT>[s], Derive<S, MT>[S]>
};

type DerivedMachineTemplate<S extends string> = { [s in S]: DerivedNodeTemplate<s> };

type DerivedNodeTemplate<S extends string = string> = {
  action: Action;
  stateModel: [S, Model];
};

type Derive<S extends string, MT extends MachineTemplate<S> = MachineTemplate<S>> = Assert<
  DerivedMachineTemplate<S>,
  {
    [s in S]: {
      action: MT[s]['action'];
      stateModel: [s, MT[s]['model']];
    }
  }
>;

interface FsmNode<CNT extends DerivedNodeTemplate, NT extends DerivedNodeTemplate> {
  model: GetModel<CNT>;
  transition: (a: GetAction<CNT>, m: GetModel<CNT>) => NT['stateModel'];
  render: (d: Dispatch<GetAction<CNT>>, m: GetModel<CNT>) => JSX.Element;
}

type GetModel<NT extends DerivedNodeTemplate> = Assert<Model, Second<NT['stateModel']>>;
type GetAction<NT extends DerivedNodeTemplate> = Assert<Action, NT['action']>;

type Model = Object | string | number | boolean | null; // | undefined
