import { ValueOf, Assert } from './helpers';

export type MessagePayloads<P = Model, T extends string = string> = { [t in T]: P };
export type Model = Object | string | number | boolean | null;

export type MessageHandlers<R, M, MP extends MessagePayloads = MessagePayloads> = {
  [t in keyof MP]: (m: M, p: MP[t]) => R
};

export type Dispatch<A extends MessageShape> = (...args: A) => void;
export type DeriveMessage<MP extends MessagePayloads> = Assert<
  MessageShape,
  ValueOf<{ [t in keyof MP]: MP[t] extends null ? [t] : [t, MP[t]] }>
>;
export type MessageShape = [string, unknown] | [string];
