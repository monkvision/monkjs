import * as ort from 'onnxruntime-web';
import type {
  OcrWorkerConfig,
  OcrWorkerLoadRequest,
  OcrWorkerRequest,
  OcrWorkerResponse,
} from './ocr.types';
import { OCR_RECOGNITION_CONFIG, OCR_IMAGE_PROCESSING } from './ocr.config';
import { createCanvas, get2dContext } from './ocr.utils';

// ─── Session state ────────────────────────────────────────────────────────────

let recSession: ort.InferenceSession | null = null;
let dictionary: string[] = [];
let initPromise: Promise<void> | null = null;
let cfg: OcrWorkerConfig | null = null;

const SESSION_OPTIONS: ort.InferenceSession.SessionOptions = {
  enableCpuMemArena: false,
  enableMemPattern: false,
  graphOptimizationLevel: 'basic',
};

// ─── Recognition pre-processing ───────────────────────────────────────────────

const { imagenetMean: _m, imagenetStd: _s } = OCR_IMAGE_PROCESSING;

let recSrcCanvas: OffscreenCanvas | HTMLCanvasElement | null = null;
let recSrcCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;
let recSrcW = 0;
let recSrcH = 0;
let recDstCanvas: OffscreenCanvas | HTMLCanvasElement | null = null;
let recDstCtx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D | null = null;

function preprocessForRec(pixels: Uint8ClampedArray, width: number, height: number): ort.Tensor {
  const { targetHeight, targetWidth } = OCR_RECOGNITION_CONFIG;
  if (!recSrcCanvas || recSrcW !== width || recSrcH !== height) {
    recSrcCanvas = createCanvas(width, height);
    recSrcCtx = get2dContext(recSrcCanvas);
    recSrcW = width;
    recSrcH = height;
  }
  recSrcCtx!.putImageData(
    new ImageData(pixels as unknown as Uint8ClampedArray<ArrayBuffer>, width, height),
    0,
    0,
  );
  if (!recDstCanvas) {
    recDstCanvas = createCanvas(targetWidth, targetHeight);
    recDstCtx = get2dContext(recDstCanvas);
  }
  recDstCtx!.fillStyle = 'white';
  recDstCtx!.fillRect(0, 0, targetWidth, targetHeight);
  const scale = Math.min(targetWidth / width, targetHeight / height);
  const sw = width * scale;
  const sh = height * scale;
  recDstCtx!.drawImage(recSrcCanvas, (targetWidth - sw) / 2, (targetHeight - sh) / 2, sw, sh);
  const img = recDstCtx!.getImageData(0, 0, targetWidth, targetHeight).data;
  const pc = targetHeight * targetWidth;
  const td = new Float32Array(3 * pc);
  for (let i = 0, j = 0; i < pc; i++, j += 4) {
    td[i] = img[j] / 127.5 - 1;
    td[pc + i] = img[j + 1] / 127.5 - 1;
    td[2 * pc + i] = img[j + 2] / 127.5 - 1;
  }
  return new ort.Tensor('float32', td, [1, 3, targetHeight, targetWidth]);
}

function ctcDecode(
  output: Float32Array,
  dims: readonly number[],
): { char: string; conf: number }[] {
  const timesteps = dims[1];
  const numClasses = dims[2];
  const result: { char: string; conf: number }[] = [];
  let prevIdx = -1;
  for (let t = 0; t < timesteps; t++) {
    const base = t * numClasses;
    let maxIdx = 0;
    let maxVal = -Infinity;
    for (let c = 0; c < numClasses; c++) {
      if (output[base + c] > maxVal) {
        maxVal = output[base + c];
        maxIdx = c;
      }
    }
    if (maxIdx === 0 || maxIdx === prevIdx || maxIdx > dictionary.length) {
      prevIdx = maxIdx;
      continue;
    }
    let expSum = 0;
    for (let c = 0; c < numClasses; c++) expSum += Math.exp(output[base + c] - maxVal);
    result.push({ char: dictionary[maxIdx - 1], conf: 1 / expSum });
    prevIdx = maxIdx;
  }
  return result;
}

async function runRecognition(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
): Promise<{ char: string; conf: number }[]> {
  if (!recSession) throw new Error('Recognition model not initialized');
  const tensor = preprocessForRec(pixels, width, height);
  const results = await recSession.run({ [recSession.inputNames[0]]: tensor });
  tensor.dispose();
  const out = results[recSession.outputNames[0]];
  const decoded = ctcDecode(out.data as Float32Array, out.dims);
  out.dispose();
  return decoded;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

async function init(): Promise<void> {
  if (initPromise) return initPromise;
  if (!cfg) throw new Error('Worker not configured');
  initPromise = (async () => {
    recSession = await ort.InferenceSession.create(cfg!.recUrl, SESSION_OPTIONS);
    const resp = await fetch(cfg!.dictUrl);
    dictionary = (await resp.text()).split('\n').filter((l) => l !== '');
    postMessage({ id: -1, ready: true } satisfies OcrWorkerResponse);
  })();
  return initPromise;
}

// ─── Message handler ──────────────────────────────────────────────────────────

addEventListener('message', async (e: MessageEvent) => {
  if (e.data.type === 'config') {
    cfg = e.data as OcrWorkerConfig;
    ort.env.wasm.wasmPaths = cfg.wasmBase;
    ort.env.wasm.numThreads = 1;
    return;
  }
  if ((e.data as OcrWorkerLoadRequest).type === 'load') {
    init().catch((err) => postMessage({ id: -1, fatalError: String(err) }));
    return;
  }

  const { id, buffer, width, height } = e.data as OcrWorkerRequest;
  try {
    await init();
    const pixels = new Uint8ClampedArray(buffer);
    const response: OcrWorkerResponse = { id };
    const t0 = performance.now();
    try {
      const tr = performance.now();
      const chars = await runRecognition(pixels, width, height);
      response.chars = chars;
      response.timing = { recMs: performance.now() - tr, totalMs: performance.now() - t0 };
    } catch (err) {
      response.recError = String(err);
    }
    postMessage(response);
  } catch (err) {
    postMessage({ id, fatalError: String(err) } as OcrWorkerResponse);
  }
});
