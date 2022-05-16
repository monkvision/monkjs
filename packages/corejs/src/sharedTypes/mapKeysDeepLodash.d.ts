/**
 * Custom type definitions for the map-keys-deep-lodash module. Next time, we should try to avoid libraries that don't
 * have type defs.
 */
declare module 'map-keys-deep-lodash' {
  import { Dictionary, ObjectIteratee } from 'lodash';

  export default function mapKeysDeep<T extends object>(
    object: T | null | undefined,
    iteratee?: ObjectIteratee<T>,
  ): Dictionary<T[keyof T]>;
}
