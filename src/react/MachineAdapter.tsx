import * as React from 'react';
import { GraphTemplate, Machine, Unsubscribe, View, Views } from '../core/Machine';

export type ReactViews<S extends string, GT extends GraphTemplate<S>> = Views<
  React.ReactNode,
  S,
  GT
>;
export type ReactView<S extends string, GT extends GraphTemplate<S>> = View<React.ReactNode, S, GT>;

export type MachineAdapterProps<S extends string, GT extends GraphTemplate<S>> = {
  machine: Machine<S, GT>;
  views: ReactViews<S, GT>;
};

export class MachineAdapter<S extends string, GT extends GraphTemplate<S>> extends React.Component<
  MachineAdapterProps<S, GT>
> {
  private unsubscribeMachine: Unsubscribe | undefined;

  componentDidMount(): void {
    this.unsubscribeMachine = this.props.machine.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount(): void {
    this.unsubscribeMachine!();
  }

  render() {
    return this.props.machine.currentView(this.props.views);
  }
}
