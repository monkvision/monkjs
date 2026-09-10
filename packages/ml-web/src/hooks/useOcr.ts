import { useCallback, useEffect, useRef, useState } from 'react';
import type { OcrCharResult, OcrWorkerResponse } from '../ocr.types';
import { OCR_STABILIZER_CONFIG } from '../ocr.config';
import { isSimilarText } from '../ocr.utils';

export interface UseOcrConfig {
  /**
   * URL of the compiled Web Worker script. Use `OCR_WORKER_URL` exported from this package for
   * the default (bundler-resolved) URL.
   */
  workerUrl: string;
  /**
   * URL for the recognition ONNX model.
   */
  recModelUrl: string;
  /**
   * URL for the character dictionary text file.
   */
  dictUrl: string;
  /**
   * Base URL for the ONNX Runtime WASM files.
   * Defaults to the jsDelivr CDN for onnxruntime-web@1.27.0.
   */
  wasmBaseUrl?: string;
  /**
   * Number of consecutive similar readings required to confirm text.
   * @default 3
   */
  appearanceCount?: number;
  /**
   * Maximum Levenshtein edit distance between consecutive readings to still count as the same text.
   * @default 1
   */
  fuzzyTolerance?: number;
}

export interface UseOcrResult {
  /** True once the ONNX model and dictionary are loaded and ready to process frames. */
  isReady: boolean;
  /** True while models are being loaded (between `loadModels()` and the ready signal). */
  isLoading: boolean;
  /** True while a frame inference is in flight. */
  isInferring: boolean;
  /** Non-null when a fatal worker error occurs; the hook is unusable until remounted. */
  fatalError: string | null;
  /** Confirmed text after `appearanceCount` consistent readings; null until confirmed. */
  confirmedText: string | null;
  /** Raw text from the last processed frame. */
  detectedText: string;
  /** Per-character results (char + confidence) from the last processed frame. */
  chars: OcrCharResult[];
  /** Number of consecutive consistent readings so far. */
  consistencyCount: number;
  /** Triggers model loading; no-op if already loading or ready. */
  loadModels: () => void;
  /** Terminates and restarts the worker, unloading all models from memory. */
  unloadModels: () => void;
  /** Submits an ImageData frame for inference; ignored while another frame is in flight. */
  processFrame: (imageData: ImageData) => void;
  /** Resets stabilizer state so the hook can start confirming a new reading. */
  reset: () => void;
}

const DEFAULT_WASM_BASE = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/';

export function useOcr(config: UseOcrConfig): UseOcrResult {
  const {
    workerUrl,
    recModelUrl,
    dictUrl,
    wasmBaseUrl = DEFAULT_WASM_BASE,
    appearanceCount = OCR_STABILIZER_CONFIG.appearanceCount,
    fuzzyTolerance = OCR_STABILIZER_CONFIG.fuzzyTolerance,
  } = config;

  // ── Worker lifecycle ────────────────────────────────────────────────────────
  const workerRef = useRef<Worker | null>(null);
  const [workerKey, setWorkerKey] = useState(0);

  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fatalError, setFatalError] = useState<string | null>(null);

  // ── Inference state ─────────────────────────────────────────────────────────
  const inFlightRef = useRef(false);
  const reqIdRef = useRef(0);
  const [isInferring, setIsInferring] = useState(false);

  const [detectedText, setDetectedText] = useState('');
  const [chars, setChars] = useState<OcrCharResult[]>([]);

  // ── Stabilizer state (all in refs to avoid updater-nesting bugs) ────────────
  const consistencyCountRef = useRef(0);
  const [consistencyCount, setConsistencyCount] = useState(0);
  const prevRawRef = useRef('');
  const isLockedRef = useRef(false);
  const [confirmedText, setConfirmedText] = useState<string | null>(null);

  // ── Worker setup ─────────────────────────────────────────────────────────────
  useEffect(() => {
    setIsReady(false);
    setIsLoading(false);
    setFatalError(null);
    inFlightRef.current = false;

    const worker = new Worker(workerUrl, { type: 'module' });
    workerRef.current = worker;

    worker.postMessage({
      type: 'config',
      wasmBase: wasmBaseUrl,
      recUrl: recModelUrl,
      dictUrl,
    });

    worker.onmessage = (e: MessageEvent<OcrWorkerResponse>) => {
      const { id, ready, fatalError: fe, recError, chars: charsData, timing: _t } = e.data;

      if (ready) {
        setIsLoading(false);
        setIsReady(true);
        return;
      }

      inFlightRef.current = false;
      setIsInferring(false);

      if (fe) {
        setFatalError(fe);
        return;
      }
      if (recError || id !== reqIdRef.current) return;

      const resolvedChars = charsData ?? [];
      setChars(resolvedChars);

      const text = resolvedChars.map((c) => c.char).join('');
      setDetectedText(text);

      // ── Stabilizer ────────────────────────────────────────────────────────
      if (isLockedRef.current) return;

      if (!text.trim()) {
        consistencyCountRef.current = 0;
        setConsistencyCount(0);
        prevRawRef.current = '';
        return;
      }

      if (isSimilarText(text, prevRawRef.current, fuzzyTolerance)) {
        const next = consistencyCountRef.current + 1;
        consistencyCountRef.current = next;
        setConsistencyCount(next);
        if (next >= appearanceCount) {
          isLockedRef.current = true;
          setConfirmedText(prevRawRef.current);
        }
      } else {
        consistencyCountRef.current = 1;
        setConsistencyCount(1);
        prevRawRef.current = text;
      }
    };

    worker.onerror = (err) => {
      inFlightRef.current = false;
      setIsInferring(false);
      setFatalError(err.message ?? 'Worker crashed');
    };

    return () => {
      worker.terminate();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workerKey, workerUrl, recModelUrl, dictUrl, wasmBaseUrl, appearanceCount, fuzzyTolerance]);

  // ── Public API ───────────────────────────────────────────────────────────────
  const loadModels = useCallback(() => {
    if (!workerRef.current || isReady || isLoading) return;
    setIsLoading(true);
    workerRef.current.postMessage({ type: 'load' });
  }, [isReady, isLoading]);

  const unloadModels = useCallback(() => {
    setWorkerKey((k) => k + 1);
  }, []);

  const processFrame = useCallback((imageData: ImageData) => {
    if (inFlightRef.current || !workerRef.current || isLockedRef.current) return;
    inFlightRef.current = true;
    setIsInferring(true);
    reqIdRef.current += 1;
    const id = reqIdRef.current;
    workerRef.current.postMessage(
      { id, buffer: imageData.data.buffer, width: imageData.width, height: imageData.height },
      [imageData.data.buffer],
    );
  }, []);

  const reset = useCallback(() => {
    isLockedRef.current = false;
    consistencyCountRef.current = 0;
    prevRawRef.current = '';
    // Discard any in-flight inference so the next processFrame call goes through immediately.
    inFlightRef.current = false;
    reqIdRef.current += 1;
    setConfirmedText(null);
    setConsistencyCount(0);
    setDetectedText('');
    setChars([]);
    setIsInferring(false);
  }, []);

  return {
    isReady,
    isLoading,
    isInferring,
    fatalError,
    confirmedText,
    detectedText,
    chars,
    consistencyCount,
    loadModels,
    unloadModels,
    processFrame,
    reset,
  };
}
