// createOcrWorker contains import.meta.url which ts-jest cannot compile to CJS.
// Mock it so that the Worker constructor goes through the global FakeWorker instead.
jest.mock('../src/hooks/createOcrWorker', () => ({
  createOcrWorker: (workerUrl?: string) =>
    // eslint-disable-next-line no-restricted-globals
    new Worker(workerUrl ?? 'mock-worker-url', { type: 'module' }),
}));

import { act, renderHook } from '@testing-library/react';
import { UseOcrConfig, useOcr } from '../src/hooks/useOcr';

// jsdom does not ship ImageData; provide a minimal polyfill.
if (typeof (global as any).ImageData === 'undefined') {
  (global as any).ImageData = class MockImageData {
    data: Uint8ClampedArray;
    width: number;
    height: number;
    constructor(w: number, h: number) {
      this.width = w;
      this.height = h;
      this.data = new Uint8ClampedArray(w * h * 4);
    }
  };
}

// ─── Worker mock ──────────────────────────────────────────────────────────────

class FakeWorker {
  static instances: FakeWorker[] = [];

  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  postMessage = jest.fn();
  terminate = jest.fn();

  constructor() {
    FakeWorker.instances.push(this);
  }

  dispatch(data: unknown) {
    this.onmessage?.(new MessageEvent('message', { data }));
  }

  fail(message: string) {
    this.onerror?.(new ErrorEvent('error', { message }));
  }
}

beforeEach(() => {
  FakeWorker.instances = [];
  (global as any).Worker = jest.fn().mockImplementation(() => new FakeWorker());
});

afterEach(() => {
  jest.clearAllMocks();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function createConfig(overrides?: Partial<UseOcrConfig>): UseOcrConfig {
  return {
    recModelUrl: 'https://test.example/rec.onnx',
    dictUrl: 'https://test.example/dict.txt',
    // Provide workerUrl to avoid import.meta.url in the jest environment
    workerUrl: 'https://test.example/worker.js',
    ...overrides,
  };
}

function latestWorker(): FakeWorker {
  return FakeWorker.instances[FakeWorker.instances.length - 1];
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useOcr', () => {
  it('creates a Worker with the provided workerUrl and sends a config message on mount', () => {
    const config = createConfig();
    renderHook(() => useOcr(config));

    expect(global.Worker).toHaveBeenCalledWith(config.workerUrl, { type: 'module' });
    expect(latestWorker().postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'config',
        recUrl: config.recModelUrl,
        dictUrl: config.dictUrl,
      }),
    );
  });

  it('terminates the worker on unmount', () => {
    const { unmount } = renderHook(() => useOcr(createConfig()));
    const worker = latestWorker();
    unmount();
    expect(worker.terminate).toHaveBeenCalled();
  });

  it('returns the expected initial state', () => {
    const { result } = renderHook(() => useOcr(createConfig()));
    expect(result.current.isReady).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isInferring).toBe(false);
    expect(result.current.fatalError).toBeNull();
    expect(result.current.confirmedText).toBeNull();
    expect(result.current.detectedText).toBe('');
    expect(result.current.chars).toEqual([]);
    expect(result.current.consistencyCount).toBe(0);
  });

  describe('loadModels', () => {
    it('sends a load message and sets isLoading', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        result.current.loadModels();
      });

      expect(result.current.isLoading).toBe(true);
      expect(latestWorker().postMessage).toHaveBeenCalledWith({ type: 'load' });
    });

    it('is a no-op when already loading', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        result.current.loadModels();
      });
      const callsBefore = latestWorker().postMessage.mock.calls.length;

      act(() => {
        result.current.loadModels();
      });

      expect(latestWorker().postMessage.mock.calls.length).toBe(callsBefore);
    });

    it('is a no-op when already ready', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        latestWorker().dispatch({ ready: true, id: -1 });
      });
      const callsBefore = latestWorker().postMessage.mock.calls.length;

      act(() => {
        result.current.loadModels();
      });

      expect(latestWorker().postMessage.mock.calls.length).toBe(callsBefore);
    });
  });

  describe('worker ready signal', () => {
    it('sets isReady and clears isLoading', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        result.current.loadModels();
      });
      act(() => {
        latestWorker().dispatch({ ready: true, id: -1 });
      });

      expect(result.current.isReady).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('fatal errors', () => {
    it('sets fatalError from a fatal message payload', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        latestWorker().dispatch({ id: 0, fatalError: 'OOM' });
      });

      expect(result.current.fatalError).toBe('OOM');
    });

    it('sets fatalError when the worker fires onerror', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        latestWorker().fail('Worker crashed');
      });

      expect(result.current.fatalError).toBe('Worker crashed');
    });
  });

  describe('processFrame', () => {
    it('sends the frame buffer and sets isInferring', () => {
      const { result } = renderHook(() => useOcr(createConfig()));
      const imageData = new ImageData(10, 10);

      act(() => {
        result.current.processFrame(imageData);
      });

      expect(latestWorker().postMessage).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1, width: 10, height: 10 }),
        expect.any(Array),
      );
      expect(result.current.isInferring).toBe(true);
    });

    it('ignores a second call while a frame is already in flight', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      const callsBefore = latestWorker().postMessage.mock.calls.length;

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });

      expect(latestWorker().postMessage.mock.calls.length).toBe(callsBefore);
    });

    it('updates chars and detectedText from a recognition response', () => {
      const { result } = renderHook(() => useOcr(createConfig()));
      const chars = [
        { char: 'A', conf: 0.9 },
        { char: 'B', conf: 0.8 },
      ];

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 1, chars });
      });

      expect(result.current.chars).toEqual(chars);
      expect(result.current.detectedText).toBe('AB');
      expect(result.current.isInferring).toBe(false);
    });

    it('ignores stale responses with a mismatched id', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 99, chars: [{ char: 'X', conf: 1 }] });
      });

      expect(result.current.detectedText).toBe('');
    });

    it('ignores responses with recError', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 1, recError: 'inference failed' });
      });

      expect(result.current.detectedText).toBe('');
    });
  });

  describe('stabilizer', () => {
    it('confirms text after appearanceCount consistent readings', () => {
      const { result } = renderHook(() =>
        useOcr(createConfig({ appearanceCount: 3, fuzzyTolerance: 0 })),
      );
      const chars = [{ char: 'A', conf: 1 }];

      for (let i = 1; i <= 3; i++) {
        act(() => {
          result.current.processFrame(new ImageData(10, 10));
        });
        act(() => {
          latestWorker().dispatch({ id: i, chars });
        });
      }

      expect(result.current.confirmedText).toBe('A');
      expect(result.current.consistencyCount).toBe(3);
    });

    it('resets consistency count when the detected text changes', () => {
      const { result } = renderHook(() =>
        useOcr(createConfig({ appearanceCount: 3, fuzzyTolerance: 0 })),
      );

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 1, chars: [{ char: 'A', conf: 1 }] });
      });
      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 2, chars: [{ char: 'B', conf: 1 }] });
      });

      expect(result.current.consistencyCount).toBe(1);
      expect(result.current.confirmedText).toBeNull();
    });

    it('resets consistency count on a blank detection', () => {
      const { result } = renderHook(() => useOcr(createConfig({ appearanceCount: 3 })));

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 1, chars: [{ char: 'A', conf: 1 }] });
      });
      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });
      act(() => {
        latestWorker().dispatch({ id: 2, chars: [] });
      });

      expect(result.current.consistencyCount).toBe(0);
    });

    it('blocks further processFrame calls once text is confirmed', () => {
      const { result } = renderHook(() =>
        useOcr(createConfig({ appearanceCount: 2, fuzzyTolerance: 0 })),
      );
      const chars = [{ char: 'A', conf: 1 }];

      for (let i = 1; i <= 2; i++) {
        act(() => {
          result.current.processFrame(new ImageData(10, 10));
        });
        act(() => {
          latestWorker().dispatch({ id: i, chars });
        });
      }

      expect(result.current.confirmedText).toBe('A');
      const callsBefore = latestWorker().postMessage.mock.calls.length;

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });

      expect(latestWorker().postMessage.mock.calls.length).toBe(callsBefore);
    });
  });

  describe('reset', () => {
    it('clears confirmedText, detectedText, chars, and consistencyCount', () => {
      const { result } = renderHook(() =>
        useOcr(createConfig({ appearanceCount: 2, fuzzyTolerance: 0 })),
      );
      const chars = [{ char: 'A', conf: 1 }];

      for (let i = 1; i <= 2; i++) {
        act(() => {
          result.current.processFrame(new ImageData(10, 10));
        });
        act(() => {
          latestWorker().dispatch({ id: i, chars });
        });
      }
      expect(result.current.confirmedText).toBe('A');

      act(() => {
        result.current.reset();
      });

      expect(result.current.confirmedText).toBeNull();
      expect(result.current.consistencyCount).toBe(0);
      expect(result.current.detectedText).toBe('');
      expect(result.current.chars).toEqual([]);
      expect(result.current.isInferring).toBe(false);
    });

    it('allows processFrame calls after reset', () => {
      const { result } = renderHook(() =>
        useOcr(createConfig({ appearanceCount: 2, fuzzyTolerance: 0 })),
      );
      const chars = [{ char: 'A', conf: 1 }];

      for (let i = 1; i <= 2; i++) {
        act(() => {
          result.current.processFrame(new ImageData(10, 10));
        });
        act(() => {
          latestWorker().dispatch({ id: i, chars });
        });
      }

      act(() => {
        result.current.reset();
      });
      const callsBefore = latestWorker().postMessage.mock.calls.length;

      act(() => {
        result.current.processFrame(new ImageData(10, 10));
      });

      expect(latestWorker().postMessage.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  describe('unloadModels', () => {
    it('terminates the current worker and creates a fresh one', () => {
      const { result } = renderHook(() => useOcr(createConfig()));
      const firstWorker = latestWorker();

      act(() => {
        result.current.unloadModels();
      });

      expect(firstWorker.terminate).toHaveBeenCalled();
      expect(FakeWorker.instances.length).toBe(2);
    });

    it('resets isReady and isLoading after reinitialising', () => {
      const { result } = renderHook(() => useOcr(createConfig()));

      act(() => {
        latestWorker().dispatch({ ready: true, id: -1 });
      });
      expect(result.current.isReady).toBe(true);

      act(() => {
        result.current.unloadModels();
      });

      expect(result.current.isReady).toBe(false);
    });
  });
});
