import * as React from 'react';
import { Action, Dispatch } from './Actions';

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

function renderCurrent<S extends string, MT extends MachineTemplate<S>>(
  fsm: Fsm<S, MT>,
  onStateChange: ([s, m]: MT[S]['stateModel']) => void,
) {
  const node = fsm.graph[fsm.current] as FsmNode<S, typeof fsm.current, MT>;

  return node.render(action => {
    onStateChange(node.transition(action, node.model));
  }, node.model);
}

interface Fsm<S extends string, MT extends MachineTemplate<S>> {
  current: S;
  graph: Graph<S, MT>;
}

export type Graph<S extends string, MT extends MachineTemplate<S>> = {
  [s in S]: FsmNode<S, s, MT>
};

export type MachineTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string> = {
  action: Action;
  stateModel: [S, Model];
};

type Model = Object | string | number | boolean; // | undefined

export type Assert<T, O extends T> = O;

interface FsmNode<S extends string, CS extends S, MT extends MachineTemplate<S>> {
  model: Second<MT[CS]['stateModel']>;
  transition: (a: MT[CS]['action'], m: Second<MT[CS]['stateModel']>) => MT[S]['stateModel'];
  render: (d: Dispatch<MT[CS]['action']>, m: Second<MT[CS]['stateModel']>) => JSX.Element;
}

type First<T extends [unknown, unknown]> = T[0];
type Second<T extends [unknown, unknown]> = T[1];

type Tagged = [string, number];
const first: First<Tagged> = '1';
const second: Second<Tagged> = 1;
