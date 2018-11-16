import { ValueOf, Assert } from './helpers';

export type ActionPayloads<P = Model, T extends string = string> = { [t in T]: P };
export type Model = Object | string | number | boolean | null;

export type ActionHandlers<R, M, AP extends ActionPayloads = ActionPayloads> = {
  [t in keyof AP]: (m: M, p: AP[t]) => R
};

export type Dispatch<A extends ActionShape = ActionShape> = (...args: A) => void;
export type DeriveAction<AP extends ActionPayloads> = Assert<
  ActionShape,
  ValueOf<{ [t in keyof AP]: AP[t] extends null ? [t] : [t, AP[t]] }>
>;
export type ActionShape = [string, unknown] | [string];
