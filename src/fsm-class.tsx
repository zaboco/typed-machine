import * as React from 'react';

type Action<T extends string = string, P = never> = { type: T; payload?: P };
type Dispatch<A extends Action> = (action: A) => void;

function action<T extends string, P>(type: T, payload?: P): Action<T, P> {
  return { type, payload };
}

export interface FsmNode<F, A extends Action> {
  transition: (a: A, f: F) => F;
  render: (d: Dispatch<A>) => JSX.Element;
}

//--------------------------------------

export interface ToggleFsm {
  current: ToggleState;
  graph: ToggleGraph;
}

export class ToggleMachine extends React.Component<ToggleFsm, ToggleFsm> {
  state: ToggleFsm = {
    current: this.props.current,
    graph: this.props.graph,
  };

  render() {
    if (this.state.current === 'Enabled') {
      const node = this.state.graph[this.state.current];
      return node.render(action => this.dispatchEnabled(node, action));
    }
    const node = this.state.graph[this.state.current];
    return node.render(action => this.dispatchDisabled(node, action));
  }

  private dispatchEnabled = (node: ToggleGraph['Enabled'], action: EnabledAction) => {
    const { current, graph } = node.transition(action, {
      current: this.state.current,
      graph: this.state.graph,
    });
    this.setState({ current, graph });
  };

  private dispatchDisabled = (node: ToggleGraph['Disabled'], action: DisabledAction) => {
    const { current, graph } = node.transition(action, {
      current: this.state.current,
      graph: this.state.graph,
    });
    this.setState({ current, graph });
  };
}

type ToggleActionMap = {
  Enabled: EnabledAction;
  Disabled: DisabledAction;
};

type ToggleGraph = { [s in ToggleState]: FsmNode<ToggleFsm, ToggleActionMap[s]> };

type ToggleState = 'Enabled' | 'Disabled';

type ToggleActionWrapper =
  | { tag: 'Enabled'; action: EnabledAction }
  | { tag: 'Disabled'; action: DisabledAction };
type EnabledAction = Action<'DISABLE'> | Action<'CLOSE'>;
type DisabledAction = Action<'ENABLE'>;

export const toggleGraph: ToggleGraph = {
  Enabled: {
    render: dispatch => (
      <div>
        Enabled
        <button onClick={() => dispatch(action('DISABLE'))}>Disable</button>
      </div>
    ),
    transition: (action, fsm) => {
      switch (action.type) {
        case 'DISABLE':
          return { ...fsm, current: 'Disabled' };
        case 'CLOSE':
          return { ...fsm, current: 'Disabled' };
      }
    },
  },
  Disabled: {
    render: dispatch => (
      <div>
        Disabled
        <button onClick={() => dispatch(action('ENABLE'))}>Enable</button>
      </div>
    ),
    transition: (action, fsm) => {
      switch (action.type) {
        case 'ENABLE':
          return { ...fsm, current: 'Enabled' };
      }
    },
  },
};
