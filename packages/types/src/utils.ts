/**
 * Utility type that concats two union types (extending string) and placing a dash character in between.
 *
 * @example
 * type A = 'a' | 'A';
 * type B = 'b' | 'B';
 * type AB = DashConcat<A, B>;
 * // AB is an alias for 'a-b' | 'A-b' | 'a-B' | 'A-B'
 */
export type DashConcat<T extends string, K extends string> = `${T}-${K}`;

/**
 * Deep partial type that applies the TypeScript `Partial` to all children and children of children.
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * Deep partial type that applies the TypeScript `Partial` to all children and children of children.
 */
export type RequiredProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;
