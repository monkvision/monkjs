export const OCR_MODEL_URLS = {
  recModelUrl: 'https://storage.googleapis.com/monk-front-public/live-configurations/rec_static_int8.onnx',
  dictUrl: 'https://storage.googleapis.com/monk-front-public/live-configurations/dict.txt',
  wasmBaseUrl: 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.27.0/dist/',
};

export const OCR_RECOGNITION_CONFIG = {
  targetHeight: 48,
  targetWidth: 320,
} as const;

export const OCR_IMAGE_PROCESSING = {
  imagenetMean: [0.485, 0.456, 0.406] as const,
  imagenetStd: [0.229, 0.224, 0.225] as const,
} as const;

export const OCR_STABILIZER_CONFIG = {
  appearanceCount: 3,
  fuzzyTolerance: 1,
  captureIntervalMs: 600,
} as const;
