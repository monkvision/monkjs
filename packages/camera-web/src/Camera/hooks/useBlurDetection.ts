import { useCallback, useRef, useState } from 'react';

/** Default Laplacian variance threshold below which a frame is considered blurry. */
export const DEFAULT_BLUR_THRESHOLD = 80;

/** Width of the canvas sample used for blur scoring (keeps computation fast). */
const SAMPLE_WIDTH = 200;

/**
 * Compute the Laplacian variance of a video frame.
 * High variance = sharp image. Low variance = blurry image.
 *
 * The Laplacian kernel used is the discrete 3×3 approximation:
 *   [ 0,  1, 0 ]
 *   [ 1, -4, 1 ]
 *   [ 0,  1, 0 ]
 *
 * Runs entirely on the CPU via Canvas 2D — no external dependencies.
 * Works on all modern browsers including iOS Safari.
 */
function computeLaplacianVariance(video: HTMLVideoElement): number {
  const aspect = video.videoHeight > 0 ? video.videoWidth / video.videoHeight : 16 / 9;
  const w = SAMPLE_WIDTH;
  const h = Math.round(w / aspect);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;

  const ctx = canvas.getContext('2d');
  if (!ctx) return Infinity; // Cannot measure — assume sharp

  ctx.drawImage(video, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  // Convert to greyscale luminance
  const grey = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = data[i * 4];
    const g = data[i * 4 + 1];
    const b = data[i * 4 + 2];
    grey[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // Apply discrete Laplacian and collect squared responses
  const laplacian: number[] = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const val =
        grey[idx - w] +
        grey[idx + w] +
        grey[idx - 1] +
        grey[idx + 1] -
        4 * grey[idx];
      laplacian.push(val);
    }
  }

  // Compute variance of the Laplacian response
  const n = laplacian.length;
  if (n === 0) return Infinity;
  const mean = laplacian.reduce((s, v) => s + v, 0) / n;
  const variance = laplacian.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  return variance;
}

export interface UseBlurDetectionResult {
  /** Whether the last checked frame was considered blurry. */
  isBlurry: boolean;
  /**
   * Check the current video frame for blurriness.
   * Returns true if the frame is sharp enough to capture.
   * Returns false (and sets isBlurry = true) if the frame is too blurry.
   */
  checkFrame: (video: HTMLVideoElement | null, threshold?: number) => boolean;
  /** Reset the blurry state (e.g. when navigating to a new sight). */
  reset: () => void;
}

/**
 * Hook that provides real-time blur detection for a video element.
 * Uses Laplacian variance computed via Canvas 2D API.
 * Safe to call on every capture attempt — computation is fast (<5 ms on mobile).
 */
export function useBlurDetection(): UseBlurDetectionResult {
  const [isBlurry, setIsBlurry] = useState(false);
  const thresholdRef = useRef(DEFAULT_BLUR_THRESHOLD);

  const checkFrame = useCallback(
    (video: HTMLVideoElement | null, threshold: number = thresholdRef.current): boolean => {
      if (!video || video.readyState < 2) {
        // Video not ready — let the capture proceed (fail-open)
        setIsBlurry(false);
        return true;
      }

      try {
        const score = computeLaplacianVariance(video);
        const sharp = score >= threshold;
        setIsBlurry(!sharp);
        return sharp;
      } catch (_) {
        // Canvas API unavailable — fail-open, never block capture
        setIsBlurry(false);
        return true;
      }
    },
    [],
  );

  const reset = useCallback(() => setIsBlurry(false), []);

  return { isBlurry, checkFrame, reset };
}
