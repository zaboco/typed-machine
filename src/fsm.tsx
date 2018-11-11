import * as React from 'react';

type Action<T extends string = string, P = never> = { type: T; payload?: P };
type Dispatch<A extends Action> = (action: A) => void;

function action<T extends string, P>(type: T, payload?: P): Action<T, P> {
  return { type, payload };
}

export interface Fsm<S extends string, NW extends FsmNodeWrapper<S, any, any>> {
  current: S;
  graph: Record<S, NW>;
}

export interface FsmNode<F, A extends Action> {
  transition: (a: A, f: F) => F;
  render: (dispatch: Dispatch<A>) => JSX.Element;
}
type FsmNodeWrapper<T extends string, F, A extends Action> = { tag: T; node: FsmNode<F, A> };

export interface FsmContainerProps<S extends string, NW extends FsmNodeWrapper<S, any, any>> {
  fsm: Fsm<S, NW>;
}

function getCurrentNode<S extends string, F, A extends Action, NW extends FsmNodeWrapper<S, F, A>>(
  fsm: Fsm<S, NW>,
): FsmNode<F, A> {
  return fsm.graph[fsm.current].node;
}

export class FsmContainer<
  S extends string,
  NW extends FsmNodeWrapper<S, any, any>
> extends React.Component<FsmContainerProps<S, NW>> {
  render() {
    const { fsm } = this.props;
    const currentNode = getCurrentNode(fsm);
    return currentNode.render();
  }
}

//--------------------------------------

type ToggleNodeWrapper =
  | { tag: 'Enabled'; node: FsmNode<ToggleFsm, EnabledAction> }
  | { tag: 'Disabled'; node: FsmNode<ToggleFsm, DisabledAction> };

function enabledNode(node: FsmNode<ToggleFsm, EnabledAction>): ToggleNodeWrapper {
  return { tag: 'Enabled', node };
}

function disabledNode(node: FsmNode<ToggleFsm, DisabledAction>): ToggleNodeWrapper {
  return { tag: 'Disabled', node };
}

type ToggleState = 'Enabled' | 'Disabled';

type EnabledAction = Action<'DISABLE'> | Action<'CLOSE'>;
type DisabledAction = Action<'ENABLE'>;
type ToggleActionWrapper =
  | { tag: 'Enabled'; action: EnabledAction }
  | { tag: 'Disabled'; action: DisabledAction };

type ToggleFsm = Fsm<ToggleState, ToggleNodeWrapper>;

const toggleFsm: ToggleFsm = {
  current: 'Enabled',
  graph: {
    Enabled: enabledNode({
      render: () => <div>Enabled</div>,
      transition: (action, fsm) => {
        switch (action.type) {
          case 'DISABLE':
            return { ...fsm, current: 'Disabled' };
          case 'CLOSE':
            return { ...fsm, current: 'Disabled' };
        }
      },
    }),
    Disabled: disabledNode({
      render: () => <div>Disabled</div>,
      transition: (action, fsm) => {
        switch (action.type) {
          case 'ENABLE':
            return { ...fsm, current: 'Enabled' };
        }
      },
    }),
  },
};

export const Demo = () => {
  return <FsmContainer fsm={toggleFsm} />;
};
