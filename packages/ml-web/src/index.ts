export { useOcr } from './hooks/useOcr';
export { createCanvas, get2dContext, isSimilarText } from './ocr.utils';
export type { UseOcrConfig, UseOcrResult } from './hooks/useOcr';
export type { OcrCharResult } from './ocr.types';
export { OCR_MODEL_URLS, OCR_STABILIZER_CONFIG } from './ocr.config';

/**
 * Default URL for the compiled OCR Web Worker script, resolved by the bundler relative to this
 * module. Pass this as `workerUrl` in `UseOcrConfig` unless you need a custom worker location.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const OCR_WORKER_URL: string = new URL('./ocr.worker.js', (import.meta as any).url).href;
