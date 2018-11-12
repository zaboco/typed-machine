import * as React from 'react';
import { Fsm, renderCurrent, GraphTemplate } from '../Fsm';

export class Machine<S extends string, GT extends GraphTemplate<S>> extends React.Component<
  Fsm<S, GT>,
  Fsm<S, GT>
> {
  state = {
    current: this.props.current,
    graph: this.props.graph,
  };

  render() {
    return renderCurrent(this.state, ([current, model]) => {
      this.setState(({ graph }) => {
        return {
          current,
          graph: Object.assign({}, graph, {
            [current]: Object.assign({}, graph[current], {
              model,
            }),
          }),
        };
      });
    });
  }
}
