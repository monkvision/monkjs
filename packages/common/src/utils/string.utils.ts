const WORD_PATTERN = /[A-Z][a-z]+|[A-Z]+(?=[A-Z][a-z])|[A-Z]+|[a-z]+|\d+/g;

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
 */
export function words(str: string): string[] {
  return str.match(WORD_PATTERN) ?? [];
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
