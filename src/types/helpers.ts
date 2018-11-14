export type Second<T extends [unknown, unknown]> = T[1];
export type Assert<T, O extends T> = O;
export type ValueOf<R extends Record<string, unknown>> = R[keyof R];
export type KeyValues<R extends Record<string, unknown>> = ValueOf<{ [k in keyof R]: [k, R[k]] }>;
