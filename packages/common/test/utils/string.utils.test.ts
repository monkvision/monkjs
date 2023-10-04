import { capitalize, permutations, suffix, toCamelCase, uncapitalize, words } from '../../src';

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

  describe('words function', () => {
    it('should properly split the given string into words', () => {
      const str = 'testWord_word test SUPER_TEST SUPERwordTesting 99 $%@ Test#ing98WordsTEST';
      const expectedWords = [
        'test',
        'Word',
        'word',
        'test',
        'SUPER',
        'TEST',
        'SUPE',
        'Rword',
        'Testing',
        '99',
        'Test',
        'ing',
        '98',
        'Words',
        'TEST',
      ];

      const result = words(str);

      expect(result).toEqual(expectedWords);
    });
  });

  describe('capitalize function', () => {
    it('should capitalize the given string', () => {
      expect(capitalize('test string')).toEqual('Test string');
    });

    it('should not change anything if the first letter is already in upper case', () => {
      expect(capitalize('Test value')).toEqual('Test value');
    });

    it('should not change anything if the first letter is a special character', () => {
      expect(capitalize('#test String')).toEqual('#test String');
    });
  });

  describe('uncapitalize function', () => {
    it('should uncapitalize the given string', () => {
      expect(uncapitalize('Test string')).toEqual('test string');
    });

    it('should not change anything if the first letter is already in lower case', () => {
      expect(uncapitalize('test Value')).toEqual('test Value');
    });

    it('should not change anything if the first letter is a special character', () => {
      expect(uncapitalize('#Test string')).toEqual('#Test string');
    });
  });

  describe('toCamelCase function', () => {
    [
      { str: 'test string strtest', expectedResult: 'testStringStrtest' },
      { str: 'tESt vAlue', expectedResult: 'tEStVAlue' },
      { str: 'tESSSSSt vAAAAAAlue', expectedResult: 'tEssssStVAaaaaAlue' },
      { str: 'test-ok-testo', expectedResult: 'testOkTesto' },
      { str: 'Pascal_Case_Test', expectedResult: 'pascalCaseTest' },
      { str: 'test-with98 numbers23test', expectedResult: 'testWith98Numbers23Test' },
      { str: 'SCREAMING_CASE_98_TEST', expectedResult: 'screamingCase98Test' },
      { str: 'kebab-case-test-case', expectedResult: 'kebabCaseTestCase' },
      { str: 'alreadyCamelCase', expectedResult: 'alreadyCamelCase' },
      {
        str: 'Test_with#special*&characters_)test',
        expectedResult: 'testWithSpecialCharactersTest',
      },
    ].forEach(({ str, expectedResult }) => {
      it(`should convert "${str}" to "${expectedResult}"`, () => {
        expect(toCamelCase(str)).toEqual(expectedResult);
      });
    });
  });
});
