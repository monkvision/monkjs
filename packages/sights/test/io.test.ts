jest.mock('fs');

import fs, { PathLike, Stats } from 'fs';
import { join } from 'path';
import { createDirIfNotExist, loadJSON, readDir, saveLibJSON } from '../src/io';

describe('I/O module', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('loadJSON function', () => {
    it('should load and parse a JSON file', () => {
      const jsonObject = { test: 'value' };
      const path = 'path';
      fs.readFileSync = jest.fn().mockReturnValue(JSON.stringify(jsonObject));

      expect(loadJSON(path)).toEqual(jsonObject);
    });

    it('should parse the file in UTF-8 encoding', () => {
      const path = 'path';
      const readFileSpy = jest.spyOn(fs, 'readFileSync');

      loadJSON('path');

      expect(readFileSpy).toHaveBeenCalledTimes(1);
      expect(readFileSpy).toHaveBeenCalledWith(path, { encoding: 'utf-8' });
    });
  });

  describe('saveLibJSON function', () => {
    it('should write the file with the proper JSON formatting and utf-8', () => {
      const jsObject = { test: 'value' };
      const path = 'path';
      const writeFileSpy = jest.spyOn(fs, 'writeFileSync');

      saveLibJSON(jsObject, path);

      expect(writeFileSpy).toHaveBeenCalledTimes(1);
      expect(writeFileSpy).toHaveBeenCalledWith(path, JSON.stringify(jsObject, null, 2), {
        encoding: 'utf-8',
      });
    });
  });

  describe('readDir function', () => {
    it('should separate files from directories', () => {
      const directories = ['uno', 'dos', 'tres'];
      const files = ['un', 'deux', 'trois'];
      const path = 'path';
      fs.readdirSync = jest
        .fn()
        .mockImplementation((p: PathLike) => (p === path ? directories.concat(files) : null));
      jest.spyOn(fs, 'lstatSync').mockImplementation((p: PathLike) => {
        if (directories.some((dir) => p === join(path, dir))) {
          return { isDirectory: () => true } as Stats;
        }
        if (files.some((file) => p === join(path, file))) {
          return { isDirectory: () => false } as Stats;
        }
        return {} as Stats;
      });

      const directoryRead = readDir(path);

      expect(directoryRead.directories).toEqual(directories);
      expect(directoryRead.files).toEqual(files);
    });
  });

  describe('createDirIfNotExist function', () => {
    it('should create the directory and return true if it does not exist', () => {
      const path = 'path';
      fs.existsSync = jest.fn().mockImplementation((p: PathLike) => p !== path);
      const mkdirSpy = jest.spyOn(fs, 'mkdirSync');

      const result = createDirIfNotExist(path);

      expect(mkdirSpy).toHaveBeenCalledTimes(1);
      expect(mkdirSpy).toHaveBeenCalledWith(path, { recursive: true });
      expect(result).toBe(true);
    });

    it('should create the directory and return false if it does not exist', () => {
      const path = 'path';
      fs.existsSync = jest.fn().mockImplementation((p: PathLike) => p === path);
      const mkdirSpy = jest.spyOn(fs, 'mkdirSync');

      const result = createDirIfNotExist(path);

      expect(mkdirSpy).toHaveBeenCalledTimes(0);
      expect(result).toBe(false);
    });
  });
});
