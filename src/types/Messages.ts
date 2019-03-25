import { Assert, ValueOf } from './helpers';

export type MessagePayloads = Record<string, ModelShape>;
export type ModelShape = Object | string | number | boolean | null;

export type MessageHandlers<R, M, MP extends MessagePayloads> = {
  [t in keyof MP]: (model: M, payload: MP[t]) => R
};

export type Dispatch<A extends MessageShape> = (...args: A) => void;
export type DeriveMessage<MP extends MessagePayloads> = Assert<
  MessageShape,
  ValueOf<{ [t in keyof MP]: MP[t] extends null ? [t] : [t, MP[t]] }>
>;
export type MessageShape = [string, unknown] | [string];
