/* eslint-disable no-param-reassign */

import { calculateLaplaceScores } from '../../../src/VideoCapture/hooks/useFrameSelection/laplaceScores';

/**
 * Reference implementation of the Laplace scoring algorithm, exactly as it was before it was rewritten into a
 * single, allocation-free pass. Used as a regression oracle : the new implementation must keep producing the same
 * scores as this one, since only the *computation* changed, not the definition of the score itself.
 *
 * Unlike the real implementation, this one still mutates (and requires a copy of) the given pixel array.
 */
function calculateLaplaceScoresReference(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): { mean: number; std: number } {
  for (let i = 0; i < pixels.length; i += 4) {
    pixels[i] = 127;
    pixels[i + 2] = 0;
  }
  const kernel = [
    [0, 1, 0],
    [1, -4, 1],
    [0, 1, 0],
  ];
  const squareSize = Math.round((0.8 * Math.min(height, width)) / 2) * 2;
  const yMin = (height - squareSize) / 2;
  const xMin = (width - squareSize) / 2;
  for (let y = yMin + 1; y < yMin + squareSize - 1; y++) {
    for (let x = xMin + 1; x < xMin + squareSize - 1; x++) {
      let sum = 127;
      const i = (y * width + x) * 4;
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const neighborIndex = ((y + ky) * width + (x + kx)) * 4;
          const neighborGreen = pixels[neighborIndex + 1];
          sum += kernel[ky + 1][kx + 1] * neighborGreen;
        }
      }
      pixels[i] = sum;
    }
  }
  let laplaceSum = 0;
  for (let y = yMin + 1; y < yMin + squareSize - 1; y++) {
    for (let x = xMin + 1; x < xMin + squareSize - 1; x++) {
      const i = (y * width + x) * 4;
      laplaceSum += pixels[i];
    }
  }
  const laplaceMean = laplaceSum / ((squareSize - 2) * (squareSize - 2));
  let se = 0;
  for (let y = yMin + 1; y < yMin + squareSize - 1; y++) {
    for (let x = xMin + 1; x < xMin + squareSize - 1; x++) {
      const i = (y * width + x) * 4;
      const diff = pixels[i] - laplaceMean;
      se += diff * diff;
    }
  }
  const laplaceStd = Math.sqrt(se / ((squareSize - 2) * (squareSize - 2)));
  return { mean: laplaceMean, std: laplaceStd };
}

function createPicture(width: number, height: number): Uint8ClampedArray {
  return new Uint8ClampedArray(width * height * 4);
}

// Deterministic (seeded) pseudo-random picture, so the fixture never changes between runs.
function createNoisyPicture(width: number, height: number): Uint8ClampedArray {
  const pixels = createPicture(width, height);
  let seed = 42;
  for (let i = 0; i < width * height; i += 1) {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    pixels[i * 4] = seed % 256;
    pixels[i * 4 + 1] = Math.floor(seed / 7) % 256;
    pixels[i * 4 + 2] = seed % 128;
    pixels[i * 4 + 3] = 255;
  }
  return pixels;
}

function createUniformPicture(width: number, height: number, green: number): Uint8ClampedArray {
  const pixels = createPicture(width, height);
  for (let i = 0; i < width * height; i += 1) {
    pixels[i * 4 + 1] = green;
    pixels[i * 4 + 3] = 255;
  }
  return pixels;
}

function createCheckerboardPicture(width: number, height: number): Uint8ClampedArray {
  const pixels = createPicture(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      pixels[i + 1] = (x + y) % 2 === 0 ? 0 : 255;
      pixels[i + 3] = 255;
    }
  }
  return pixels;
}

function createGradientPicture(width: number, height: number): Uint8ClampedArray {
  const pixels = createPicture(width, height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      pixels[i + 1] = Math.floor((255 * x) / (width - 1));
      pixels[i + 3] = 255;
    }
  }
  return pixels;
}

describe('calculateLaplaceScores', () => {
  it('should not modify the pixel array', () => {
    const pixels = createNoisyPicture(32, 32);
    const copy = pixels.slice();

    calculateLaplaceScores(pixels, 32, 32);

    expect(Array.from(pixels)).toEqual(Array.from(copy));
  });

  it('should return a std of 0 and a mean of 127 for a uniform picture', () => {
    const scores = calculateLaplaceScores(createUniformPicture(16, 16, 128), 16, 16);

    expect(scores.std).toBe(0);
    expect(scores.mean).toBe(127);
  });

  it('should score a sharp picture higher than a blurry one', () => {
    const sharp = calculateLaplaceScores(createCheckerboardPicture(16, 16), 16, 16);
    const blurry = calculateLaplaceScores(createGradientPicture(16, 16), 16, 16);

    expect(sharp.std).toBeGreaterThan(blurry.std);
  });

  it('should ignore the red and blue channels', () => {
    const withNoisyRedAndBlue = createNoisyPicture(16, 16);
    const withZeroedRedAndBlue = withNoisyRedAndBlue.slice();
    for (let i = 0; i < withZeroedRedAndBlue.length; i += 4) {
      withZeroedRedAndBlue[i] = 0;
      withZeroedRedAndBlue[i + 2] = 0;
    }

    const scoresA = calculateLaplaceScores(withNoisyRedAndBlue, 16, 16);
    const scoresB = calculateLaplaceScores(withZeroedRedAndBlue, 16, 16);

    expect(scoresA).toEqual(scoresB);
  });

  it('should clamp the laplacian result to the [0, 255] range, as the reference implementation did via its Uint8ClampedArray', () => {
    // A single green=0 pixel surrounded by green=255 neighbors produces a raw laplacian of 127 + 4*255 - 4*0 = 1147,
    // far beyond 255, so the clamp is actually exercised.
    const pixels = createUniformPicture(5, 5, 255);
    pixels[(2 * 5 + 2) * 4 + 1] = 0;
    const referencePixels = pixels.slice();

    const scores = calculateLaplaceScores(pixels, 5, 5);
    const reference = calculateLaplaceScoresReference(referencePixels, 5, 5);

    expect(scores.mean).toBeCloseTo(reference.mean, 10);
    expect(scores.std).toBeCloseTo(reference.std, 10);
  });

  describe.each([
    ['noisy, even dimensions', createNoisyPicture(16, 16), 16, 16],
    ['noisy, non-square even dimensions', createNoisyPicture(32, 24), 32, 24],
    ['noisy, odd dimensions', createNoisyPicture(33, 31), 33, 31],
    ['noisy, mixed odd/even dimensions', createNoisyPicture(32, 31), 32, 31],
    ['checkerboard', createCheckerboardPicture(16, 16), 16, 16],
    ['gradient', createGradientPicture(16, 16), 16, 16],
  ])('for a %s picture', (_name, pixels, width, height) => {
    it('should match the reference (pre-refactor) implementation', () => {
      const referencePixels = pixels.slice();
      const reference = calculateLaplaceScoresReference(referencePixels, width, height);
      const result = calculateLaplaceScores(pixels, width, height);

      expect(result.mean).toBeCloseTo(reference.mean, 8);
      expect(result.std).toBeCloseTo(reference.std, 8);
    });
  });
});
