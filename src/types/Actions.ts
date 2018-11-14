export type ActionShape = [string, unknown] | [string];
export type Dispatch<A> = (action: A) => void;
export type Model = Object | string | number | boolean | null;

export type Action<T extends string = string, P = null> = P extends null ? [T] : [T, P];
export type ActionPayloads<T extends string = string, P = Model> = { [t in T]: P | null };
export type ActionHandlers<R, AP extends ActionPayloads = ActionPayloads> = {
  [t in keyof AP]: ActionHandler<AP[t], R>
};

type ActionHandler<P, R> = P extends null ? () => R : (p: P) => R;
