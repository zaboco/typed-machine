export type First3<T extends [unknown, unknown, unknown]> = T[0];
export type Second3<T extends [unknown, unknown, unknown]> = T[1];
export type Third3<T extends [unknown, unknown, unknown]> = T[2];

export type First<T extends [unknown, unknown]> = T[0];
export type Second<T extends [unknown, unknown]> = T[1];
export type Assert<T, O extends T> = O;
export type ValueOf<R extends Record<string, unknown>> = R[keyof R];
export type KeyValues<R extends Record<string, unknown>> = ValueOf<{ [k in keyof R]: [k, R[k]] }>;
