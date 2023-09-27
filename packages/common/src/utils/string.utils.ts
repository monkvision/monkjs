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
