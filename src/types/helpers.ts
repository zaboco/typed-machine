export type Second<T extends [unknown, unknown]> = T[1];
export type Assert<T, O extends T> = O;
export type ValueOf<R extends Record<string | number, unknown>> = R[keyof R];
