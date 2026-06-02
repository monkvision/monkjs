import { RefObject, useEffect, useRef, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';

const SAMPLE_SIZE = 200;
const DEFAULT_SHARPNESS_THRESHOLD = 30;
const SAMPLE_INTERVAL_MS = 100;
const SAFETY_TIMEOUT_MS = 5000;

export interface UseSharpnessDetectorParams {
  videoRef: RefObject<HTMLVideoElement | null>;
  enabled: boolean;
  threshold?: number;
  /**
   * Change this value to reset the detector (e.g. on sight change).
   * When this key changes the detector resets its state and begins sampling again.
   */
  resetKey?: string | number;
}

export interface SharpnessDetectorResult {
  isSharp: boolean;
  sharpnessScore: number;
  timedOut: boolean;
}

function computeLaplacianVariance(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
): number {
  const w = SAMPLE_SIZE;
  const h = SAMPLE_SIZE;
  const sx = Math.max(0, (video.videoWidth - w) / 2);
  const sy = Math.max(0, (video.videoHeight - h) / 2);
  ctx.drawImage(video, sx, sy, w, h, 0, 0, w, h);
  const { data } = ctx.getImageData(0, 0, w, h);

  const grey = new Float32Array(w * h);
  for (let i = 0; i < grey.length; i++) {
    const p = i * 4;
    grey[i] = 0.299 * data[p] + 0.587 * data[p + 1] + 0.114 * data[p + 2];
  }

  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const lap =
        grey[(y - 1) * w + x] +
        grey[(y + 1) * w + x] +
        grey[y * w + (x - 1)] +
        grey[y * w + (x + 1)] -
        4 * grey[y * w + x];
      sum += lap;
      sumSq += lap * lap;
      count++;
    }
  }

  const mean = sum / count;
  return sumSq / count - mean * mean;
}

export function useSharpnessDetector({
  videoRef,
  enabled,
  threshold = DEFAULT_SHARPNESS_THRESHOLD,
  resetKey,
}: UseSharpnessDetectorParams): SharpnessDetectorResult {
  const [isSharp, setIsSharp] = useState(true);
  const [sharpnessScore, setSharpnessScore] = useState(0);
  const [timedOut, setTimedOut] = useState(false);

  const scratchCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const scratchCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!enabled) {
      setIsSharp(true);
      setSharpnessScore(0);
      setTimedOut(false);
      return;
    }

    if (!scratchCanvasRef.current) {
      scratchCanvasRef.current = document.createElement('canvas');
      scratchCanvasRef.current.width = SAMPLE_SIZE;
      scratchCanvasRef.current.height = SAMPLE_SIZE;
      scratchCtxRef.current = scratchCanvasRef.current.getContext('2d', {
        willReadFrequently: true,
      });
    }

    setTimedOut(false);
    setIsSharp(false);

    // Safety timeout — unconditionally unlock the shutter after SAFETY_TIMEOUT_MS
    const safetyTimeout = setTimeout(() => {
      setTimedOut(true);
      setIsSharp(true);
    }, SAFETY_TIMEOUT_MS);

    const interval = setInterval(() => {
      const video = videoRef.current;
      const ctx = scratchCtxRef.current;
      if (!video || !ctx || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
        return;
      }

      const score = computeLaplacianVariance(ctx, video);
      setSharpnessScore(score);

      if (score >= threshold) {
        setIsSharp(true);
        clearTimeout(safetyTimeout);
        clearInterval(interval);
      }
    }, SAMPLE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(safetyTimeout);
    };
    // resetKey is intentionally in the dep array so a sight change forces a full reset
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, threshold, videoRef, resetKey]);

  return useObjectMemo({ isSharp, sharpnessScore, timedOut });
}
