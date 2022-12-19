import {
  existsSync,
  lstatSync,
  mkdirSync,
  PathOrFileDescriptor,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { join } from 'path';

export const MONK_SCHEMAS_PATH = join(__dirname, '../research/schemas');
export const MONK_DATA_PATH = join(__dirname, '../research/data');

export interface DirectoryRead {
  files: string[];
  directories: string[];
}

export function loadJSON(path: PathOrFileDescriptor): unknown {
  return JSON.parse(readFileSync(path, { encoding: 'utf-8' }).toString());
}

export function saveLibJSON(obj: unknown, path: PathOrFileDescriptor): void {
  writeFileSync(path, JSON.stringify(obj, null, 2), { encoding: 'utf-8' });
}

export function readDir(path: string): DirectoryRead {
  return readdirSync(path)
    .map((name) => ({ name, isDirectory: lstatSync(join(path, name)).isDirectory() }))
    .reduce(
      (prev: DirectoryRead, curr: { name: string; isDirectory: boolean }) => ({
        files: !curr.isDirectory ? [...prev.files, curr.name] : prev.files,
        directories: curr.isDirectory ? [...prev.directories, curr.name] : prev.directories,
      }),
      { files: [], directories: [] },
    );
}

export function createDirIfNotExist(path: string): boolean {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
    return true;
  }
  return false;
}
