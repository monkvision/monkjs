export interface OcrCharResult {
  char: string;
  conf: number;
}

export interface OcrTiming {
  recMs: number;
  totalMs: number;
}

export interface OcrWorkerConfig {
  type: 'config';
  wasmBase: string;
  recUrl: string;
  dictUrl: string;
}

export interface OcrWorkerLoadRequest {
  type: 'load';
}

export interface OcrWorkerRequest {
  id: number;
  buffer: ArrayBuffer;
  width: number;
  height: number;
}

export interface OcrWorkerResponse {
  id: number;
  chars?: OcrCharResult[];
  timing?: OcrTiming;
  recError?: string;
  fatalError?: string;
  ready?: true;
}
