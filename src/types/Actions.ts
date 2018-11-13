export type EAction<T extends string = string> = [T];
export type PAction<T extends string = string, P = {}> = [T, P];
export type Action<T extends string = string, P = {}> = EAction<T> | PAction<T, P>;

export type Dispatch<A extends Action> = (action: A) => void;

// export function matchAction<A extends Action<T>, R, T extends string = string>(
//   action: A,
//   mapping: { [t in A[0]]: A[1] extends undefined ? () => R : (p: A[1]) => R },
// ): R {
//   const handler = mapping[action[0]] as Function;
//   return handler(action[1]);
// }
