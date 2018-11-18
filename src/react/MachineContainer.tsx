import * as React from 'react';
import { Machine, currentView, GraphTemplate } from '../Machine';

export type ReactMachine<S extends string, GT extends GraphTemplate<S>> = Machine<
  JSX.Element,
  S,
  GT
>;

export class MachineContainer<
  S extends string,
  GT extends GraphTemplate<S>
> extends React.Component<ReactMachine<S, GT>, ReactMachine<S, GT>> {
  state = {
    current: this.props.current,
    graph: this.props.graph,
  };

  render() {
    return currentView(this.state, newMachine => {
      this.setState(newMachine);
    });
  }
}
