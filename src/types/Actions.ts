export type Action<T extends string = string, P = {}> = { type: T; payload?: P };
export type ActionP<T extends string, P> = { type: T; payload: P };
export type Dispatch<A extends Action> = (action: A) => void;

export function action<T extends string>(type: T): Action<T> {
  return { type };
}

export function actionP<T extends string, P>(type: T, payload: P): ActionP<T, P> {
  return { type, payload };
}
