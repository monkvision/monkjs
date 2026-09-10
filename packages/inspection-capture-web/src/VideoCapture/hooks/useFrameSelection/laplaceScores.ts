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
 * The scores are computed over the centered square covering 80% of the smallest dimension of the picture, using the
 * green channel only.
 */
export function calculateLaplaceScores(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): LaplaceScores {
  const squareSize = Math.round((0.8 * Math.min(height, width)) / 2) * 2;
  const yMin = (height - squareSize) / 2;
  const xMin = (width - squareSize) / 2;
  const rowStride = width * 4;
  const count = (squareSize - 2) * (squareSize - 2);
  let sum = 0;
  let sumOfSquares = 0;
  for (let y = yMin + 1; y < yMin + squareSize - 1; y++) {
    const rowOffset = y * rowStride;
    for (let x = xMin + 1; x < xMin + squareSize - 1; x++) {
      const i = rowOffset + x * 4 + 1;
      const laplacian =
        pixels[i - 4] +
        pixels[i + 4] +
        pixels[i - rowStride] +
        pixels[i + rowStride] -
        4 * pixels[i];
      const value = Math.min(255, Math.max(0, 127 + laplacian)) - 127;
      sum += value;
      sumOfSquares += value * value;
    }
  }
  const mean = sum / count;
  const variance = sumOfSquares / count - mean * mean;
  return { mean: 127 + mean, std: Math.sqrt(Math.max(0, variance)) };
}
