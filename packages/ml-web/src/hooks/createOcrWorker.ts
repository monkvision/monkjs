// eslint-disable-next-line no-restricted-globals
export function createOcrWorker(workerUrl?: string): Worker {
  if (workerUrl) {
    // eslint-disable-next-line no-restricted-globals
    return new Worker(workerUrl, { type: 'module' });
  }
  // eslint-disable-next-line no-restricted-globals
  return new Worker(new URL('../ocr.worker.js', import.meta.url), { type: 'module' });
}
