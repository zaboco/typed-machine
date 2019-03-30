import * as React from 'react';
import { GraphTemplate, MachineContainer, Unsubscribe, View, Views } from '../core/Machine';

export type ReactViews<S extends string, GT extends GraphTemplate<S>> = Views<
  React.ReactNode,
  S,
  GT
>;
export type ReactView<S extends string, GT extends GraphTemplate<S>> = View<React.ReactNode, S, GT>;

export type MachineContainerProps<S extends string, GT extends GraphTemplate<S>> = {
  machineContainer: MachineContainer<S, GT>;
  views: ReactViews<S, GT>;
};

export class MachineAdapter<S extends string, GT extends GraphTemplate<S>> extends React.Component<
  MachineContainerProps<S, GT>
> {
  private unsubscribeMachine: Unsubscribe = () => {};

  componentDidMount(): void {
    this.unsubscribeMachine = this.props.machineContainer.subscribe(() => {
      this.forceUpdate();
    });
  }

  componentWillUnmount(): void {
    this.unsubscribeMachine();
  }

  render() {
    return this.props.machineContainer.view(this.props.views);
  }
}
