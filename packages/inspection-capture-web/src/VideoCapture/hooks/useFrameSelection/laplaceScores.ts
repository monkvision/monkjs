/* eslint-disable no-param-reassign */

export interface LaplaceScores {
  mean: number;
  std: number;
}

/**
 * This function calculates the Laplace Scores for a given pixel array. This score can be used to get a rough estimate
 * of the blurriness of the picture.
 *
 * Picture A is less blurry than picture B if :
 *   calculateLaplaceScores(A).std > calculateLaplaceScores(B).std
 *
 * ***WARNING : To save up memory space, the pixels of the array are modified in place!! Before using this function, be
 * sure to make a copy of the array using the `array.slice()` method (you might have performance issues if you use any
 * other method for the duplication of the array).***
 */
export function calculateLaplaceScores(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): LaplaceScores {
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
