import { ValueOf, Assert } from './helpers';

export type MessagePayloads<P = Model, T extends string = string> = { [t in T]: P };
export type Model = Object | string | number | boolean | null;

export type MessageHandlers<R, M, AP extends MessagePayloads = MessagePayloads> = {
  [t in keyof AP]: (m: M, p: AP[t]) => R
};

export type Dispatch<A extends MessageShape> = (...args: A) => void;
export type DeriveMessage<AP extends MessagePayloads> = Assert<
  MessageShape,
  ValueOf<{ [t in keyof AP]: AP[t] extends null ? [t] : [t, AP[t]] }>
>;
type MessageShape = [string, unknown] | [string];
