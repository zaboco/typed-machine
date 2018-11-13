// New actions

// type SimpleAction<T extends string = string> = T
// type PayloadAction<T extends string = string, P = unknown> = [T, P]
export type Action<T extends string = string, P = null> = P extends null ? [T] : [T, P];
type ActionShape = [string, unknown] | [string];

type EnableAction = Action<'enable'>;
type ChangeAction = Action<'change', string>;
type IncreaseAction = Action<'increase', number>;
type MyAction = EnableAction | ChangeAction | IncreaseAction;

const enable: EnableAction = ['enable'];
const change: ChangeAction = ['change', 'a'];
const increase: IncreaseAction = ['increase', 10];

type ActionHandler<A, R> = A extends [string, unknown] ? (p: A[1]) => R : () => R;

type ActionMapping<A extends ActionShape> = { [t in A[0]]: A };

type ActionWithHandlerMapping<AM extends ActionMapping<A>, R, A extends ActionShape> = {
  [t in keyof AM]: [AM[t], ActionHandler<AM[t], R>]
};

type ActionHandlers<
  AHM extends ActionWithHandlerMapping<AM, R, A>,
  R,
  AM extends ActionMapping<A>,
  A extends ActionShape
> = { [t in keyof AHM]: AHM[t][1] };

type Extends<T, E extends T> = E;

type MyActionMapping = Extends<
  ActionMapping<MyAction>,
  {
    enable: Action<'enable'>;
    change: Action<'change', string>;
    increase: Action<'increase', number>;
  }
>;

type MyActionWithHandlerMapping = Extends<
  ActionWithHandlerMapping<MyActionMapping, number, MyAction>,
  {
    enable: [Action<'enable'>, () => number];
    change: [Action<'change', string>, (a: string) => number];
    increase: [Action<'increase', number>, (a: number) => number];
  }
>;

type MyActionHandlers = Extends<
  ActionHandlers<MyActionWithHandlerMapping, number, MyActionMapping, MyAction>,
  {
    enable: () => number;
    change: (a: string) => number;
    increase: (a: number) => number;
  }
>;

const handlers: MyActionHandlers = {
  change: s => Number(s) + 1,
  increase: a => a + 2,
  enable: () => 3,
};

export function matchAction<A extends ActionShape, R, AH extends ActionHandlers<any, R, any, A>>(
  action: A,
  handlers: AH,
): R {
  return handlers[action[0]](action[1]);
}

export const foo = matchAction(change, handlers);
