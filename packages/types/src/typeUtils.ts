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
 * Utility type that applies the `Required` type only to certain properties.
 */
export type RequiredProperties<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Utility type that applies the `Partial` type only to certain properties.
 */
export type PartialProperties<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>;

/**
 * Utility type that returns a union type of every required key in T. If T does not have any required key, this type
 * resolves to `never`.
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: NonNullable<unknown> extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Utility type that either allow T or no property of T.
 */
export type AllOrNone<T> = T | { [K in keyof T]?: never };

/**
 * Standard enum type that can be used to enforce enum-like types in generic parameters.
 */
export type StandardEnum<T> = {
  [id: string]: T | string;
  [nu: number]: string;
};

/**
 * Primitive JavaScript type used in analytics tags.
 */
export type Primitive = number | string | boolean | bigint | symbol | null | undefined;
