/**
 * Returns an array containing all the possible permutations of the given array.
 */
export function permutations<T>(array: T[]): T[][] {
  const result: T[][] = [];

  array.forEach((_, index) => {
    const rest = permutations(array.slice(0, index).concat(array.slice(index + 1)));

    if (rest.length === 0) {
      result.push([array[index]]);
    } else {
      for (let j = 0; j < rest.length; j++) {
        result.push([array[index]].concat(rest[j]));
      }
    }
  });

  return result;
}

/**
 * Return a copy of the given array in which all duplicates have been removed.
 */
export function uniq<T>(array: T[]): T[] {
  const indexablePrimitives: Record<'number' | 'string', Record<number | string, boolean>> = {
    number: {},
    string: {},
  };
  const objects: T[] = [];

  return array.filter((item) => {
    const type = typeof item;
    if (type in indexablePrimitives) {
      const primitiveType = type as 'number' | 'string';
      const primitiveItem = item as number | string;
      if (Object.hasOwn(indexablePrimitives[primitiveType], primitiveItem)) {
        return false;
      }
      indexablePrimitives[primitiveType][primitiveItem] = true;
      return true;
    }
    return objects.indexOf(item) >= 0 ? false : objects.push(item);
  });
}

/**
 * Type definition for an array of either elements of type T, or another recursive array of type T.
 */
export type RecursiveArray<T> = (T | RecursiveArray<T>)[];

/**
 * Flatten the given array.
 *
 * @example
 * console.log(flatten([ 1, [2, 3], [[4], [5, 6]]]));
 * // Output : 1,2,3,4,5,6
 */
export function flatten<T>(array: RecursiveArray<T>): T[] {
  return array.reduce<T[]>((acc, val) => {
    if (Array.isArray(val)) {
      acc.push(...flatten(val));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}

/**
 * JS implementation of the
 * [Array.prototype.flatMap](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
 * method, available on all versions of JavaScript.
 */
export function flatMap<T, K>(array: T[], map: (item: T) => RecursiveArray<K>): K[] {
  return flatten(array.map(map));
}
