import { resolve } from 'path';

export function pathsEqual(p1: string, p2: string): boolean {
  const path1 = resolve(p1);
  const path2 = resolve(p2);
  return process.platform === 'win32'
    ? path1.toLowerCase() === path2.toLowerCase()
    : path1 === path2;
}
