export = {
  OCR_WORKER_URL: 'https://test.example/ocr.worker.js',
  OCR_MODEL_URLS: {
    recModelUrl: 'https://test.example/rec.onnx',
    dictUrl: 'https://test.example/dict.txt',
    wasmBaseUrl: 'https://test.example/wasm/',
  },
  OCR_STABILIZER_CONFIG: {
    appearanceCount: 3,
    fuzzyTolerance: 1,
    captureIntervalMs: 600,
  },
  useOcr: jest.fn(() => ({
    isReady: false,
    isLoading: false,
    isInferring: false,
    fatalError: null,
    confirmedText: null,
    detectedText: '',
    chars: [],
    consistencyCount: 0,
    loadModels: jest.fn(),
    unloadModels: jest.fn(),
    processFrame: jest.fn(),
    reset: jest.fn(),
  })),
  createCanvas: jest.fn((w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
  }),
  get2dContext: jest.fn((canvas: HTMLCanvasElement) => canvas.getContext('2d')),
  isSimilarText: jest.fn(() => true),
};
