export type Second<T extends [unknown, unknown]> = T[1];
export type Assert<T, O extends T> = O;
