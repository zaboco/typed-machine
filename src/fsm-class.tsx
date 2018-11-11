import * as React from 'react';

type Action<T extends string = string, P = never> = { type: T; payload?: P };
type Dispatch<A extends Action> = (action: A) => void;

function action<T extends string, P>(type: T, payload?: P): Action<T, P> {
  return { type, payload };
}

export interface FsmNode<S extends string, A extends Action> {
  transition: (a: A) => S;
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
    return renderCurrent(this.state, current => {
      this.setState({ current });
    });
  }
}

function renderCurrent(fsm: ToggleFsm, onStateChange: (s: ToggleState) => void) {
  const node = fsm.graph[fsm.current] as FsmNode<ToggleState, ToggleActionMap[typeof fsm.current]>;
  return node.render(action => {
    onStateChange(node.transition(action));
  });
}

type ToggleState = 'Enabled' | 'Disabled';

type ToggleActionMap = {
  Enabled: Action<'DISABLE'> | Action<'CLOSE'>;
  Disabled: Action<'ENABLE'>;
};

type ToggleGraph = { [s in ToggleState]: FsmNode<ToggleState, ToggleActionMap[s]> };

export const toggleGraph: ToggleGraph = {
  Enabled: {
    render: dispatch => (
      <div>
        Enabled
        <button onClick={() => dispatch(action('DISABLE'))}>Disable</button>
      </div>
    ),
    transition: action => {
      switch (action.type) {
        case 'DISABLE':
          return 'Disabled';
        case 'CLOSE':
          return 'Disabled';
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
    transition: action => {
      switch (action.type) {
        case 'ENABLE':
          return 'Enabled';
      }
    },
  },
};
