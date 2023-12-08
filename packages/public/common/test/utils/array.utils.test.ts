import { permutations } from '../../src';

describe('Array utils', () => {
  describe('permutations function', () => {
    it('should compute the possible permutations of the given array', () => {
      const a = 'a-test';
      const b = 'b-test';
      const c = 'c-test';
      const array = [a, b, c];

      const result = permutations(array);

      const expectedResult = [
        [a, b, c],
        [a, c, b],
        [b, a, c],
        [b, c, a],
        [c, a, b],
        [c, b, a],
      ];
      expect(result.length).toEqual(expectedResult.length);
      expectedResult.forEach((permutation) => {
        expect(result).toContainEqual(permutation);
      });
    });

    it('should return a single permutation when an array of length 1 is provided', () => {
      const array = ['test-value'];

      const result = permutations(array);

      expect(result).toEqual([array]);
    });

    it('should return an empty array if an empty array is provided', () => {
      const result = permutations([]);

      expect(result.length).toEqual(0);
    });
  });
});
