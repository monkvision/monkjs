import { getFileExtensions, getMimetype, MIMETYPE_FILE_EXTENSIONS } from '../../src';

describe('Mimetype utils', () => {
  describe('Mimetype file extension map', () => {
    it('should be an object mapping mimetypes to arrays of file extensions', () => {
      Object.keys(MIMETYPE_FILE_EXTENSIONS).forEach((mimetype) => {
        expect(Array.isArray(MIMETYPE_FILE_EXTENSIONS[mimetype])).toBe(true);
        expect(MIMETYPE_FILE_EXTENSIONS[mimetype].length).toBeGreaterThanOrEqual(1);
        MIMETYPE_FILE_EXTENSIONS[mimetype].forEach((extension) => {
          expect(typeof extension).toBe('string');
        });
      });
    });
  });

  describe('getFileExtensions util function', () => {
    it('should return the file extensions from the file extension map', () => {
      Object.keys(MIMETYPE_FILE_EXTENSIONS).forEach((mimetype) => {
        expect(getFileExtensions(mimetype)).toEqual(MIMETYPE_FILE_EXTENSIONS[mimetype]);
      });
    });

    it('should throw if the file extension is unknown', () => {
      expect(() => getFileExtensions('test')).toThrowError();
    });
  });

  describe('getMimetype util function', () => {
    it('should return the mimetype from the file extension map', () => {
      Object.keys(MIMETYPE_FILE_EXTENSIONS).forEach((mimetype) => {
        MIMETYPE_FILE_EXTENSIONS[mimetype].forEach((extension) => {
          expect(getMimetype(extension)).toEqual(mimetype);
        });
      });
    });

    it('should throw if the mimetype is unknown', () => {
      expect(() => getMimetype('test')).toThrowError();
    });
  });
});
