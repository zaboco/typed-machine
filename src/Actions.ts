export type Action<T extends string = string, P = {}> = { type: T; payload?: P };
export type Dispatch<A extends Action> = (action: A) => void;

export function action<T extends string, P>(type: T, payload?: P): Action<T, P> {
  return { type, payload };
}
