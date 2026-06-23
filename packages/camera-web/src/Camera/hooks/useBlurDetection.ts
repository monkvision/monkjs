import { useCallback, useRef, useState } from 'react';

/**
 * Default Laplacian variance threshold below which a frame is considered blurry.
 * Tune this value based on empirical testing — higher = stricter.
 */
export const DEFAULT_BLUR_THRESHOLD = 80;

/**
 * Computes the Laplacian variance of a video frame to detect blur.
 * Uses a small canvas sample (200x112) for performance — works on all modern browsers
 * via Canvas 2D API. No external dependencies.
 *
 * Returns a score: higher = sharper. Below threshold = blurry.
 */
function computeLaplacianVariance(video: HTMLVideoElement, sampleWidth = 200): number {
  const aspectRatio = video.videoHeight > 0 ? video.videoWidth / video.videoHeight : 16 / 9;
  const sampleHeight = Math.round(sampleWidth / aspectRatio);

  const canvas = document.createElement('canvas');
  canvas.width = sampleWidth;
  canvas.height = sampleHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Infinity; // Cannot measure — allow capture

  ctx.drawImage(video, 0, 0, sampleWidth, sampleHeight);
  const { data } = ctx.getImageData(0, 0, sampleWidth, sampleHeight);

  // Convert to greyscale luminance
  const grey: number[] = [];
  for (let i = 0; i < data.length; i += 4) {
    grey.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }

  // Apply Laplacian kernel [0,1,0,1,-4,1,0,1,0] and collect squared values
  const w = sampleWidth;
  const h = sampleHeight;
  const laplacianValues: number[] = [];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const idx = y * w + x;
      const lap =
        grey[idx - w] +
        grey[idx + w] +
        grey[idx - 1] +
        grey[idx + 1] -
        4 * grey[idx];
      laplacianValues.push(lap * lap);
    }
  }

  if (laplacianValues.length === 0) return Infinity;

  // Variance of the Laplacian squared values
  const mean = laplacianValues.reduce((a, b) => a + b, 0) / laplacianValues.length;
  const variance =
    laplacianValues.reduce((a, b) => a + (b - mean) ** 2, 0) / laplacianValues.length;

  return variance;
}

export interface UseBlurDetectionParams {
  /** Variance threshold below which a frame is considered blurry. Default: 80 */
  threshold?: number;
}

export interface UseBlurDetectionResult {
  /** True if the last checked frame was below the blur threshold */
  isBlurry: boolean;
  /**
   * Check whether the current video frame is blurry.
   * Returns true if sharp (capture allowed), false if blurry (capture should be blocked).
   * Always returns true if the check cannot be performed (e.g. video not ready).
   */
  checkFrame: (video: HTMLVideoElement | null) => boolean;
}

/**
 * Hook that provides real-time blur detection for a camera video feed.
 * Uses Laplacian variance computed on a canvas sample — no external deps,
 * compatible with iOS Safari and Android Chrome.
 */
export function useBlurDetection({
  threshold = DEFAULT_BLUR_THRESHOLD,
}: UseBlurDetectionParams = {}): UseBlurDetectionResult {
  const [isBlurry, setIsBlurry] = useState(false);
  const lastScoreRef = useRef<number>(Infinity);

  const checkFrame = useCallback(
    (video: HTMLVideoElement | null): boolean => {
      if (!video || video.readyState < 2 || video.videoWidth === 0) {
        // Video not ready — allow capture to avoid blocking the user
        setIsBlurry(false);
        return true;
      }
      try {
        const score = computeLaplacianVariance(video);
        lastScoreRef.current = score;
        const blurry = score < threshold;
        setIsBlurry(blurry);
        return !blurry;
      } catch {
        // If anything goes wrong, allow capture
        setIsBlurry(false);
        return true;
      }
    },
    [threshold],
  );

  return { isBlurry, checkFrame };
}
