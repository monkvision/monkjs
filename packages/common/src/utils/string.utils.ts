/**
 * Suffixes a string with the given suffixes, only if their value is `true` in the suffixes object param.
 *
 * Note : The order of the suffixes is not guaranteed.
 */
export function suffix(
  str: string,
  suffixes?: Record<string, boolean | undefined | null>,
  separator = ' ',
): string {
  return suffixes
    ? Object.keys(suffixes).reduce(
        (prev, curr) => `${prev}${suffixes[curr] ? separator + curr : ''}`,
        str,
      )
    : str;
}

/**
 * Split the given string into its composing words.
 *
 * Implemented as a single linear (O(n)) scan rather than a regular expression so that no input can
 * trigger super-linear backtracking. Word boundaries are determined left-to-right using these rules :
 * - a run of lowercase letters, optionally preceded by a single uppercase letter (`Foo`, `foo`) ;
 * - a run of uppercase letters not immediately followed by a lowercase letter, the trailing uppercase
 *   letter being left for the next word when it is (acronyms : `HTMLParser` -> `HTML`, `Parser`) ;
 * - a run of digits ;
 * - any other character is treated as a separator and skipped.
 */
export function words(str: string): string[] {
  const isUpper = (char: string): boolean => char >= 'A' && char <= 'Z';
  const isLower = (char: string): boolean => char >= 'a' && char <= 'z';
  const isDigit = (char: string): boolean => char >= '0' && char <= '9';

  const result: string[] = [];
  let i = 0;
  while (i < str.length) {
    const char = str[i];
    if (isUpper(char) && isLower(str[i + 1])) {
      // Single uppercase letter starting a capitalized word (e.g. the `W` in `someWord`).
      let end = i + 1;
      while (end < str.length && isLower(str[end])) {
        end += 1;
      }
      result.push(str.slice(i, end));
      i = end;
    } else if (isUpper(char)) {
      // Run of uppercase letters (acronym). When the run is followed by a lowercase letter, that
      // last uppercase letter actually starts the next word and is excluded from this one.
      let end = i + 1;
      while (end < str.length && isUpper(str[end])) {
        end += 1;
      }
      if (end < str.length && isLower(str[end])) {
        end -= 1;
      }
      result.push(str.slice(i, end));
      i = end;
    } else if (isLower(char)) {
      let end = i + 1;
      while (end < str.length && isLower(str[end])) {
        end += 1;
      }
      result.push(str.slice(i, end));
      i = end;
    } else if (isDigit(char)) {
      let end = i + 1;
      while (end < str.length && isDigit(str[end])) {
        end += 1;
      }
      result.push(str.slice(i, end));
      i = end;
    } else {
      i += 1;
    }
  }
  return result;
}

/**
 * Capitalizes (transforms the first character to upper case) the given string.
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Uncapitalizes (transforms the first character to lower case) the given string.
 */
export function uncapitalize(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

/**
 * Converts a string to camel case.
 */
export function toCamelCase(str: string): string {
  return words(str)
    .map((word, index) => (index === 0 ? word.toLowerCase() : capitalize(word.toLowerCase())))
    .join('');
}
