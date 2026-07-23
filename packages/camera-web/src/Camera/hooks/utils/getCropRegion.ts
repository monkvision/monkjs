import { CameraRatio, PixelDimensions } from '@monkvision/types';

/**
 * Describes a crop region applied to the video stream before encoding the output picture.
 * All values are in pixels.
 */
export interface CropRegion {
  /** Width of the output (canvas) image. */
  outputWidth: number;
  /** Height of the output (canvas) image. */
  outputHeight: number;
  /** X offset into the video frame where the crop starts. */
  sx: number;
  /** Y offset into the video frame where the crop starts. */
  sy: number;
  /** Width of the crop window inside the video frame. */
  sourceWidth: number;
  /** Height of the crop window inside the video frame. */
  sourceHeight: number;
}

/**
 * Given the actual video stream dimensions, the base canvas output dimensions (already scaled to the
 * requested resolution), and a desired aspect ratio, computes the centred crop region that:
 * - Has exactly the requested aspect ratio.
 * - Is the largest such rectangle that fits within both the stream and the output canvas.
 *
 * Returns a CropRegion that can be passed directly to context.drawImage() and used to size the
 * canvas element.
 */
export function getCropRegion(
  streamDimensions: PixelDimensions,
  outputDimensions: PixelDimensions,
  ratio: CameraRatio,
): CropRegion {
  const targetRatio = ratio.width / ratio.height;

  // Compute the largest centred crop window in the video stream with the target ratio.
  const streamRatio = streamDimensions.width / streamDimensions.height;
  let sourceWidth: number;
  let sourceHeight: number;
  if (streamRatio > targetRatio) {
    // Stream is wider than target: constrain by height.
    sourceHeight = streamDimensions.height;
    sourceWidth = sourceHeight * targetRatio;
  } else {
    // Stream is taller than target: constrain by width.
    sourceWidth = streamDimensions.width;
    sourceHeight = sourceWidth / targetRatio;
  }
  const sx = (streamDimensions.width - sourceWidth) / 2;
  const sy = (streamDimensions.height - sourceHeight) / 2;

  // Compute the output (canvas) dimensions with the target ratio, fitting within outputDimensions.
  const outputRatio = outputDimensions.width / outputDimensions.height;
  let outputWidth: number;
  let outputHeight: number;
  if (outputRatio > targetRatio) {
    // Output canvas is wider than target: constrain by height.
    outputHeight = outputDimensions.height;
    outputWidth = outputHeight * targetRatio;
  } else {
    // Output canvas is taller than target: constrain by width.
    outputWidth = outputDimensions.width;
    outputHeight = outputWidth / targetRatio;
  }

  return {
    outputWidth: Math.round(outputWidth),
    outputHeight: Math.round(outputHeight),
    sx: Math.round(sx),
    sy: Math.round(sy),
    sourceWidth: Math.round(sourceWidth),
    sourceHeight: Math.round(sourceHeight),
  };
}
