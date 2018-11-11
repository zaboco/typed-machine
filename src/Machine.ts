import * as React from 'react';
import { Action, Dispatch } from './Actions';

export class Machine<
  S extends string,
  AM extends ActionMap<S>,
  MM extends ModelMap<S> = ModelMap<S>
> extends React.Component<Fsm<S, AM, MM>, Fsm<S, AM, MM>> {
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

function renderCurrent<S extends string, AM extends ActionMap<S>, MM extends ModelMap<S>>(
  fsm: Fsm<S, AM, MM>,
  onStateChange: ([s, m]: [S, MM[S]]) => void,
) {
  const node = fsm.graph[fsm.current] as FsmNode<
    S,
    AM[typeof fsm.current],
    MM[typeof fsm.current],
    MM[S]
  >;

  return node.render(action => {
    onStateChange(node.transition(action, node.model));
  }, node.model);
}

interface Fsm<S extends string, AM extends ActionMap<S>, MM extends ModelMap<S> = ModelMap<S>> {
  current: S;
  graph: Graph<S, AM, MM>;
}

export type Graph<
  S extends string,
  AM extends ActionMap<S>,
  MM extends ModelMap<S> = ModelMap<S>
> = { [s in S]: FsmNode<S, AM[s], MM[s], MM[S]> };

type ActionMap<S extends string> = Record<S, Action>;
type ModelMap<S extends string> = Record<S, Object | string | number | boolean | null>;

// type DefaultModelMap<S extends string> = Record<S, null>

interface FsmNode<S extends string, A extends Action, M, OM> {
  model: M;
  transition: (a: A, m: M) => [S, OM];
  render: (d: Dispatch<A>, m: M) => JSX.Element;
}
