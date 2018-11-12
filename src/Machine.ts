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
  const node = fsm.graph[fsm.current];

  return node.render(action => {
    onStateChange(node.transition(action, node.model));
  }, node.model);
}

interface Fsm<S extends string, MT extends MachineTemplate<S>> {
  current: S;
  graph: Graph<S, MT>;
}

export type MachineTemplate<S extends string> = { [s in S]: NodeTemplate<s> };

type NodeTemplate<S extends string = string> = {
  action: Action;
  stateModel: [S, Model];
};

export type Graph<S extends string, MT extends MachineTemplate<S>> = {
  [s in S]: FsmNode<S, MT[s], MT[S]>
};

interface FsmNode<S extends string, CNT extends NodeTemplate<S>, NT extends NodeTemplate<S>> {
  model: GetModel<CNT>;
  transition: (a: GetAction<CNT>, m: GetModel<CNT>) => NT['stateModel'];
  render: (d: Dispatch<GetAction<CNT>>, m: GetModel<CNT>) => JSX.Element;
}

type GetModel<NT extends NodeTemplate> = Assert<Model, Second<NT['stateModel']>>;
type GetAction<NT extends NodeTemplate> = Assert<Action, NT['action']>;

// type First<T extends [unknown, unknown]> = T[0];
type Second<T extends [unknown, unknown]> = T[1];

type Model = Object | string | number | boolean; // | undefined

export type Assert<T, O extends T> = O;
