import * as React from 'react';
import { currentView, GraphTemplate, Machine, View, Views } from '../core/Machine';

export type ReactViews<S extends string, GT extends GraphTemplate<S>> = Views<JSX.Element, S, GT>;
export type ReactView<S extends string, GT extends GraphTemplate<S>> = View<JSX.Element, S, GT>;

export type MachineContainerProps<S extends string, GT extends GraphTemplate<S>> = {
  machine: Machine<S, GT>;
  views: ReactViews<S, GT>;
};

export class MachineContainer<
  S extends string,
  GT extends GraphTemplate<S>
> extends React.Component<MachineContainerProps<S, GT>, { machine: Machine<S, GT> }> {
  state = { machine: this.props.machine };

  render() {
    return currentView(this.state.machine, this.props.views, newMachine => {
      this.setState({ machine: newMachine });
    });
  }
}
