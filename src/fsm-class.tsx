import * as React from 'react';

type Action<T extends string = string, P = never> = { type: T; payload?: P };
type Dispatch<T extends string, P = never> = (action: Action<T, P>) => void;

function action<T extends string, P>(type: T, payload?: P): Action<T, P> {
  return { type, payload };
}

export interface FsmNode<F, A> {
  transition: (a: A, f: F) => F;
  render: () => JSX.Element;
}

export interface ToggleContainerProps {
  machine: ToggleMachine;
}

export class ToggleContainer extends React.Component<ToggleContainerProps> {
  render() {
    return this.props.machine.render();
  }
}

//--------------------------------------

export interface ToggleFsm {
  current: ToggleState;
  graph: ToggleGraph;
}

export class ToggleMachine {
  private current: ToggleState;
  private graph: ToggleGraph;

  constructor(current: ToggleState, graph: ToggleGraph) {
    this.current = current;
    this.graph = graph;
  }

  render() {
    const node = this.graph[this.current];
    return node.render();
  }
}

type ToggleActionMap = {
  Enabled: EnabledAction;
  Disabled: DisabledAction;
};

type ToggleGraph = { [s in ToggleState]: FsmNode<ToggleFsm, ToggleActionMap[s]> };

type ToggleState = 'Enabled' | 'Disabled';

type EnabledAction = Action<'DISABLE'> | Action<'CLOSE'>;
type DisabledAction = Action<'ENABLE'>;

export const toggleMachine = new ToggleMachine('Disabled', {
  Enabled: {
    render: () => <div>Enabled</div>,
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
    render: () => <div>Disabled</div>,
    transition: (action, fsm) => {
      switch (action.type) {
        case 'ENABLE':
          return { ...fsm, current: 'Enabled' };
      }
    },
  },
});
