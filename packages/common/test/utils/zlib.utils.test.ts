import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

import { zlibCompress, zlibDecompress } from '../../src';

const zlibTestExamples: { decompressed: string; compressed: string }[] = [
  {
    decompressed: 'asdfghjkf98324ye1qd&TR%#@wfd9123r-23f@#',
    compressed: 'eJxLLE5JS8/Iyk6ztDA2MqlMNSxMUQsJUlV2KE9LsTQ0Mi7SNTJOc1AGAAAhC8g=',
  },
  {
    decompressed: 'abcdefghijklmnopqrstuvwxyz1234567890',
    compressed: 'eJxLTEpOSU1Lz8jMys7JzcsvKCwqLiktK6+orDI0MjYxNTO3sDQAAAr3DS0=',
  },
  {
    decompressed: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    compressed: 'eJxLTCQMAPx+DaU=',
  },
];

describe('ZLib utils', () => {
  describe('zlibCompress function', () => {
    it('should properly compress the given string', () => {
      zlibTestExamples.forEach((example) => {
        expect(zlibCompress(example.decompressed)).toEqual(example.compressed);
      });
    });
  });

  describe('zlibDecompress function', () => {
    it('should properly decompress the given string', () => {
      zlibTestExamples.forEach((example) => {
        expect(zlibDecompress(example.compressed)).toEqual(example.decompressed);
      });
    });
  });
});
