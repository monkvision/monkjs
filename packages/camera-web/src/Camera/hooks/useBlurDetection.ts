import { useCallback, useState } from 'react';

/**
 * Default Laplacian variance threshold below which a frame is considered blurry.
 * Higher = stricter. Tune this value based on empirical testing per use-case.
 * Set to 0 to disable blur detection entirely.
 */
export const DEFAULT_BLUR_THRESHOLD = 80;

/**
 * Computes the Laplacian variance of a video frame to detect blur.
 * Samples a small canvas (200×112) for performance — runs in <5ms on mid-range devices.
 * Uses only the Canvas 2D API: universally supported on iOS Safari and Android Chrome.
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

  // Apply discrete Laplacian kernel [0,1,0,1,-4,1,0,1,0] and collect values
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

  // Variance of the squared Laplacian values
  const mean = laplacianValues.reduce((a, b) => a + b, 0) / laplacianValues.length;
  const variance =
    laplacianValues.reduce((a, b) => a + (b - mean) ** 2, 0) / laplacianValues.length;

  return variance;
}

/**
 * Parameters for the useBlurDetection hook.
 */
export interface UseBlurDetectionParams {
  /**
   * Laplacian variance threshold below which a frame is considered blurry.
   * Default: DEFAULT_BLUR_THRESHOLD (80). Set to 0 to disable blur detection.
   */
  threshold?: number;
}

/**
 * Result returned by the useBlurDetection hook.
 */
export interface UseBlurDetectionResult {
  /**
   * True when the last checked frame scored below the blur threshold.
   * Use this to show a "Hold still" indicator in the HUD.
   */
  isBlurry: boolean;
  /**
   * Analyses the current video frame for blur.
   * Returns true if the frame is sharp enough to capture, false if it is blurry.
   * Always returns true if the check cannot be performed (video not ready, canvas unavailable)
   * so it never blocks the user on unsupported platforms.
   */
  checkFrame: (video: HTMLVideoElement | null) => boolean;
}

/**
 * Hook providing real-time blur detection for a camera video feed.
 *
 * Uses Laplacian variance computed via Canvas 2D API — no external dependencies.
 * Compatible with iOS Safari 15+ and Android Chrome.
 *
 * @example
 * const { isBlurry, checkFrame } = useBlurDetection();
 * // In takePicture:
 * if (!checkFrame(videoRef.current)) return; // frame too blurry
 */
export function useBlurDetection({
  threshold = DEFAULT_BLUR_THRESHOLD,
}: UseBlurDetectionParams = {}): UseBlurDetectionResult {
  const [isBlurry, setIsBlurry] = useState(false);

  const checkFrame = useCallback(
    (video: HTMLVideoElement | null): boolean => {
      // If the video is not ready, allow capture to avoid blocking the user
      if (!video || video.readyState < 2 || video.videoWidth === 0 || threshold === 0) {
        setIsBlurry(false);
        return true;
      }
      try {
        const score = computeLaplacianVariance(video);
        const blurry = score < threshold;
        setIsBlurry(blurry);
        return !blurry;
      } catch {
        // If anything goes wrong, allow capture — never block on error
        setIsBlurry(false);
        return true;
      }
    },
    [threshold],
  );

  return { isBlurry, checkFrame };
}
