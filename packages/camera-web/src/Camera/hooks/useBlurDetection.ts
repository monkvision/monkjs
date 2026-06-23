import { useCallback, useRef, useState } from 'react';

export interface UseBlurDetectionParams {
  /**
   * Laplacian variance threshold below which a frame is considered blurry.
   * Higher = stricter. Defaults to 80, which works well for most mobile cameras.
   * Tune down if the gate is too aggressive on low-res streams.
   */
  threshold?: number;
  /**
   * Width of the internal canvas used for blur analysis.
   * Smaller = faster computation. Defaults to 200px.
   */
  sampleWidth?: number;
}

export interface UseBlurDetectionResult {
  /** Whether the last checked frame was detected as blurry. */
  isBlurry: boolean;
  /**
   * Analyses the current frame of a video element and returns true if sharp.
   * Returns true (allow capture) on any error so it never silently blocks.
   */
  checkFrame: (videoEl: HTMLVideoElement) => boolean;
  /** Reset blurry state (e.g. after a successful capture). */
  reset: () => void;
}

/**
 * Computes the Laplacian variance of a grayscale image buffer.
 * High variance = many strong edges = sharp image.
 * Low variance = soft/uniform = blurry image.
 *
 * The Laplacian kernel used is:
 *   0  1  0
 *   1 -4  1
 *   0  1  0
 */
function laplacianVariance(data: Uint8ClampedArray, width: number, height: number): number {
  let sum = 0;
  let sumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      // Each pixel is 4 bytes (R,G,B,A) — use only R channel (grayscale)
      const idx = (y * width + x) * 4;
      const top = data[((y - 1) * width + x) * 4];
      const bottom = data[((y + 1) * width + x) * 4];
      const left = data[(y * width + (x - 1)) * 4];
      const right = data[(y * width + (x + 1)) * 4];
      const center = data[idx];

      const lap = top + bottom + left + right - 4 * center;
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  if (count === 0) return 0;
  const mean = sum / count;
  return sumSq / count - mean * mean; // variance
}

/**
 * Hook that provides real-time blur detection for a camera video element.
 * Uses the Laplacian variance method on a small canvas sample.
 * Fully implemented via Canvas 2D API — no external dependencies.
 * Compatible with iOS Safari 12+, Android Chrome, and desktop browsers.
 */
export function useBlurDetection({
  threshold = 80,
  sampleWidth = 200,
}: UseBlurDetectionParams = {}): UseBlurDetectionResult {
  const [isBlurry, setIsBlurry] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getCanvas = useCallback(
    (videoEl: HTMLVideoElement): HTMLCanvasElement => {
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }
      const aspectRatio = videoEl.videoHeight > 0 ? videoEl.videoWidth / videoEl.videoHeight : 16 / 9;
      canvasRef.current.width = sampleWidth;
      canvasRef.current.height = Math.round(sampleWidth / aspectRatio);
      return canvasRef.current;
    },
    [sampleWidth],
  );

  const checkFrame = useCallback(
    (videoEl: HTMLVideoElement): boolean => {
      try {
        if (!videoEl || videoEl.readyState < 2 || videoEl.videoWidth === 0) {
          // Video not ready yet — allow capture so we don't block the user
          setIsBlurry(false);
          return true;
        }

        const canvas = getCanvas(videoEl);
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          setIsBlurry(false);
          return true;
        }

        // Draw the current video frame scaled down to the sample canvas
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const variance = laplacianVariance(imageData.data, canvas.width, canvas.height);
        const blurry = variance < threshold;

        setIsBlurry(blurry);
        return !blurry;
      } catch {
        // On any error (e.g. SecurityError on tainted canvas), allow capture
        setIsBlurry(false);
        return true;
      }
    },
    [getCanvas, threshold],
  );

  const reset = useCallback(() => setIsBlurry(false), []);

  return { isBlurry, checkFrame, reset };
}
