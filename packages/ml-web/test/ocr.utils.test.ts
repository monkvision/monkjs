import { createCanvas, get2dContext, isSimilarText } from '../src/ocr.utils';

describe('createCanvas', () => {
  it('returns an HTMLCanvasElement with the correct dimensions in jsdom (no OffscreenCanvas)', () => {
    const canvas = createCanvas(320, 48);
    expect(canvas).toBeInstanceOf(HTMLCanvasElement);
    expect((canvas as HTMLCanvasElement).width).toBe(320);
    expect((canvas as HTMLCanvasElement).height).toBe(48);
  });

  it('returns an OffscreenCanvas when the global is available', () => {
    const MockOffscreen = jest.fn(function MockOffscreenCanvas(w: number, h: number) {
      (this as any).width = w;
      (this as any).height = h;
      (this as any).getContext = jest.fn(() => ({}));
    });
    const prev = (global as any).OffscreenCanvas;
    (global as any).OffscreenCanvas = MockOffscreen;

    expect(createCanvas(100, 50)).toBeDefined();
    expect(MockOffscreen).toHaveBeenCalledWith(100, 50);

    (global as any).OffscreenCanvas = prev;
  });
});

describe('get2dContext', () => {
  it('returns the 2D rendering context when getContext succeeds', () => {
    const canvas = document.createElement('canvas');
    const mockCtx = {} as CanvasRenderingContext2D;
    jest.spyOn(canvas, 'getContext').mockReturnValue(mockCtx as any);
    expect(get2dContext(canvas)).toBe(mockCtx);
  });

  it('throws when getContext returns null', () => {
    const canvas = document.createElement('canvas');
    jest.spyOn(canvas, 'getContext').mockReturnValue(null);
    expect(() => get2dContext(canvas)).toThrow('Failed to get 2d context');
  });
});

describe('isSimilarText', () => {
  it('returns true for identical strings', () => {
    expect(isSimilarText('hello', 'hello', 0)).toBe(true);
  });

  it('returns true when edit distance equals the tolerance', () => {
    expect(isSimilarText('ABC', 'ABD', 1)).toBe(true);
  });

  it('returns false when edit distance exceeds the tolerance', () => {
    expect(isSimilarText('ABC', 'XYZ', 1)).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(isSimilarText('Hello', 'hello', 0)).toBe(true);
  });

  it('normalizes leading and trailing whitespace', () => {
    expect(isSimilarText('  hello  ', 'hello', 0)).toBe(true);
  });

  it('collapses internal whitespace', () => {
    expect(isSimilarText('hello   world', 'hello world', 0)).toBe(true);
  });

  it('returns false when the length difference already exceeds the tolerance (early exit)', () => {
    expect(isSimilarText('A', 'ABCDE', 1)).toBe(false);
  });

  it('returns false for completely different strings with tolerance 0', () => {
    expect(isSimilarText('abc', 'xyz', 0)).toBe(false);
  });

  it('handles empty strings', () => {
    expect(isSimilarText('', '', 0)).toBe(true);
    expect(isSimilarText('a', '', 0)).toBe(false);
    expect(isSimilarText('a', '', 1)).toBe(true);
  });
});
