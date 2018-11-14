import { ValueOf, Assert } from './helpers';

export type Dispatch<A> = (action: A) => void;
export type Model = Object | string | number | boolean | null;

export type ActionPayloads<P = Model, T extends string = string> = { [t in T]: P };
export type ActionHandlers<R, M, AP extends ActionPayloads = ActionPayloads> = {
  [t in keyof AP]: ActionHandler<R, M, AP[t]>
};

export type ActionHandler<R, M, P> = (m: M, p: P) => R;

export type DeriveAction<AP extends ActionPayloads> = Assert<
  ActionShape,
  ValueOf<{ [t in keyof AP]: AP[t] extends null ? [t] : [t, AP[t]] }>
>;
type ActionShape = [string, unknown] | [string];
