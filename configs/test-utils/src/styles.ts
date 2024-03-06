export function getNumberFromCSSProperty(prop: string | undefined | null): number {
  expect(typeof prop).toBe('string');
  const reg = /^(\d+)\D*$/;
  expect(prop).toMatch(reg);
  const result = (prop as string).match(reg);
  return Number((result as string[])[1]);
}
