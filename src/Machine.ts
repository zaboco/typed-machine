import * as React from 'react';
import { Action, Dispatch } from './Actions';

export class Machine<S extends string, AM extends ActionMap<S>> extends React.Component<
  Fsm<S, AM>,
  Fsm<S, AM>
> {
  state = {
    current: this.props.current,
    graph: this.props.graph,
  };

  render() {
    return renderCurrent(this.state, current => {
      this.setState({ current });
    });
  }
}

function renderCurrent<S extends string, AM extends ActionMap<S>>(
  fsm: Fsm<S, AM>,
  onStateChange: (s: S) => void,
) {
  const node = fsm.graph[fsm.current] as FsmNode<S, AM[typeof fsm.current]>;
  return node.render(action => {
    onStateChange(node.transition(action));
  });
}

interface Fsm<S extends string, AM extends ActionMap<S>> {
  current: S;
  graph: Graph<S, AM>;
}

export type Graph<S extends string, AM extends ActionMap<S>> = { [s in S]: FsmNode<S, AM[s]> };

type ActionMap<S extends string> = Record<S, Action>;

interface FsmNode<S extends string, A extends Action> {
  transition: (a: A) => S;
  render: (d: Dispatch<A>) => JSX.Element;
}
