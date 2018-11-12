import * as React from 'react';
import { Fsm, MachineTemplate, renderCurrent } from '../Fsm';

export class Machine<S extends string, MT extends MachineTemplate<S>> extends React.Component<
  Fsm<S, MT>,
  Fsm<S, MT>
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
