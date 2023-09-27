import { permutations, suffix } from '../../src';

describe('String utils', () => {
  describe('suffix function', () => {
    it('should suffix the given string with the given suffixes and separator', () => {
      const str = 'my-str';
      const suffixes = { test1: true, test2: true, test3: true };
      const separator = '/sep/';

      const result = suffix(str, suffixes, separator);

      const suffixValues = Object.keys(suffixes);
      const possibleOutputs = permutations(suffixValues).map((perm) => {
        let suffixed = str;
        perm.forEach((s) => {
          suffixed = suffixed + separator + s;
        });
        return suffixed;
      });
      expect(possibleOutputs).toContain(result);
    });

    it('should not add suffixes if their value is false or null or undefined', () => {
      const str = 'my-str';
      const addedSuffix = 'test-suffix';
      const suffixes = { [addedSuffix]: true, test2: false, test3: undefined, test4: null };
      const separator = '/sep/';

      const result = suffix(str, suffixes, separator);

      expect(result).toEqual(`${str}${separator}${addedSuffix}`);
    });

    it('should not add any suffix if the suffixes object is not provided', () => {
      const str = 'my-str';

      const result = suffix(str);

      expect(result).toEqual(str);
    });

    it('should use the space character as the default separator', () => {
      const str = 'my-str';
      const addedSuffix = 'test-suffix';
      const suffixes = { [addedSuffix]: true };

      const result = suffix(str, suffixes);

      expect(result).toEqual(`${str} ${addedSuffix}`);
    });
  });
});
