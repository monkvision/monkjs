/**
 * Returns an array containing all the possible permutations of the given array.
 */
export function permutations<T>(array: T[]): T[][] {
  const result: T[][] = [];

  array.forEach((value, index) => {
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
