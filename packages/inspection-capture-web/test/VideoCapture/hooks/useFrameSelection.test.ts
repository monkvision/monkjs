jest.mock('../../../src/VideoCapture/hooks/useFrameSelection/laplaceScores', () => ({
  calculateLaplaceScores: jest.fn(() => ({ mean: 0, std: 0 })),
}));

import { act, renderHook } from '@testing-library/react';
import { useInterval, useQueue } from '@monkvision/common';
import { useFrameSelection, UseFrameSelectionParams } from '../../../src/VideoCapture/hooks';
import { calculateLaplaceScores } from '../../../src/VideoCapture/hooks/useFrameSelection/laplaceScores';

function createProps(): UseFrameSelectionParams {
  return {
    handle: {
      getImageData: jest.fn(() => ({ data: [0, 2], width: 123, height: 456 })),
      compressImage: jest.fn(() => Promise.resolve({ blob: {}, uri: 'test' })),
    },
    frameSelectionInterval: 1500,
    onFrameSelected: jest.fn(),
  } as unknown as UseFrameSelectionParams;
}

// Creates a promise whose resolution is controlled from the outside, to test the ordering of async effects
// (compressImage) against synchronous ones (discardBestFrame).
function createDeferred<T>() {
  let deferredResolve!: (value: T) => void;
  const promise = new Promise<T>((resolve) => {
    deferredResolve = resolve;
  });
  return { promise, resolve: deferredResolve };
}

describe('useFrameSelection hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an onCaptureVideoFrame callback', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(
      (props: UseFrameSelectionParams) => useFrameSelection(props),
      { initialProps },
    );

    expect(typeof result.current.onCaptureVideoFrame).toBe('function');

    unmount();
  });

  it('should not select any frames if no screenshot has been taken', () => {
    const initialProps = createProps();
    const { unmount } = renderHook((props: UseFrameSelectionParams) => useFrameSelection(props), {
      initialProps,
    });

    expect(useQueue).toHaveBeenCalled();
    const { push } = (useQueue as jest.Mock).mock.results[0].value;
    expect(push).not.toHaveBeenCalled();
    expect(initialProps.handle.getImageData).not.toHaveBeenCalled();
    expect(initialProps.handle.compressImage).not.toHaveBeenCalled();
    expect(initialProps.onFrameSelected).not.toHaveBeenCalled();
    expect(calculateLaplaceScores).not.toHaveBeenCalled();

    unmount();
  });

  it('should push the image to the processing queue when a screenshot is taken', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(
      (props: UseFrameSelectionParams) => useFrameSelection(props),
      { initialProps },
    );

    expect(useQueue).toHaveBeenCalled();
    const { push } = (useQueue as jest.Mock).mock.results[0].value;

    expect(initialProps.handle.getImageData).not.toHaveBeenCalled();
    expect(push).not.toHaveBeenCalled();
    act(() => {
      result.current.onCaptureVideoFrame();
    });
    expect(initialProps.handle.getImageData).toHaveBeenCalled();
    const image = (initialProps.handle.getImageData as jest.Mock).mock.results[0].value;
    expect(push).toHaveBeenCalledWith(image);

    unmount();
  });

  it('should select the best frame using the laplace scoring function, without copying the pixel array', async () => {
    const initialProps = createProps();
    const { rerender, unmount } = renderHook(() => useFrameSelection(initialProps));

    expect(useQueue).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ storeFailedItems: false }),
    );
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    (calculateLaplaceScores as jest.Mock).mockImplementation((data) => {
      if (data[0] === 1) {
        return { std: 0.4 };
      }
      if (data[0] === 2) {
        return { std: 0.6 };
      }
      if (data[0] === 3) {
        return { std: 0.2 };
      }
      return null;
    });

    const image1 = { data: [1], width: 11, height: 12 } as unknown as ImageData;
    const image2 = { data: [2], width: 21, height: 22 } as unknown as ImageData;
    const image3 = { data: [3], width: 31, height: 32 } as unknown as ImageData;

    expect(calculateLaplaceScores).not.toHaveBeenCalled();
    await act(async () => {
      await processingFunction(image1);
      rerender();
      await processingFunction(image2);
      rerender();
      await processingFunction(image3);
      rerender();
    });

    expect(calculateLaplaceScores).toHaveBeenCalledTimes(3);
    expect(calculateLaplaceScores).toHaveBeenCalledWith(image1.data, image1.width, image1.height);
    expect(calculateLaplaceScores).toHaveBeenCalledWith(image2.data, image2.width, image2.height);
    expect(calculateLaplaceScores).toHaveBeenCalledWith(image3.data, image3.width, image3.height);
    // The array passed to the scoring function must be the untouched ImageData.data, never a copy of it.
    expect((calculateLaplaceScores as jest.Mock).mock.calls[0][0]).toBe(image1.data);

    expect(useInterval).toHaveBeenCalledWith(
      expect.any(Function),
      initialProps.frameSelectionInterval,
    );
    const callback = (useInterval as jest.Mock).mock.calls[0][0];
    expect(initialProps.handle.compressImage).not.toHaveBeenCalled();
    expect(initialProps.onFrameSelected).not.toHaveBeenCalled();
    act(() => {
      callback();
    });
    expect(initialProps.handle.compressImage).toHaveBeenCalledTimes(1);
    expect(initialProps.handle.compressImage).toHaveBeenCalledWith(image2);
    const picture = await (initialProps.handle.compressImage as jest.Mock).mock.results[0].value;
    expect(initialProps.onFrameSelected).toHaveBeenCalledTimes(1);
    expect(initialProps.onFrameSelected).toHaveBeenCalledWith(picture);

    unmount();
  });

  it('should return the processed frames and the total processing frames', () => {
    const totalItems = 4321;
    const processingCount = 876;
    (useQueue as jest.Mock).mockImplementationOnce(() => ({
      push: jest.fn(),
      totalItems,
      processingCount,
    }));
    const initialProps = createProps();
    const { result, unmount } = renderHook(
      (props: UseFrameSelectionParams) => useFrameSelection(props),
      { initialProps },
    );

    expect(result.current.processedFrames).toEqual(totalItems - processingCount);
    expect(result.current.totalProcessingFrames).toEqual(totalItems);

    unmount();
  });

  it('should upload the buffered best frame when flushBestFrame is called', async () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useFrameSelection(initialProps));
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const image = { data: [1], width: 11, height: 12 } as unknown as ImageData;

    await act(async () => {
      await processingFunction(image);
    });
    expect(initialProps.handle.compressImage).not.toHaveBeenCalled();

    await act(async () => {
      result.current.flushBestFrame();
    });
    expect(initialProps.handle.compressImage).toHaveBeenCalledWith(image);
    expect(initialProps.onFrameSelected).toHaveBeenCalled();

    unmount();
  });

  it('should reset the buffer after a flush', async () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useFrameSelection(initialProps));
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const image = { data: [1], width: 11, height: 12 } as unknown as ImageData;

    await act(async () => {
      await processingFunction(image);
    });
    await act(async () => {
      result.current.flushBestFrame();
    });
    await act(async () => {
      result.current.flushBestFrame();
    });
    expect(initialProps.handle.compressImage).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('should discard the buffered frame without uploading it', async () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useFrameSelection(initialProps));
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const image = { data: [1], width: 11, height: 12 } as unknown as ImageData;

    await act(async () => {
      await processingFunction(image);
    });
    act(() => {
      result.current.discardBestFrame();
    });
    await act(async () => {
      result.current.flushBestFrame();
    });
    expect(initialProps.handle.compressImage).not.toHaveBeenCalled();
    expect(initialProps.onFrameSelected).not.toHaveBeenCalled();

    unmount();
  });

  it('should reset the best score when the buffer is discarded, so a stale score cannot survive it', async () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(() => useFrameSelection(initialProps));
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const highScoreImage = { data: [1], width: 11, height: 12 } as unknown as ImageData;
    const lowScoreImage = { data: [2], width: 11, height: 12 } as unknown as ImageData;
    (calculateLaplaceScores as jest.Mock).mockImplementation((data) => ({
      std: data[0] === 1 ? 0.9 : 0.1,
    }));

    await act(async () => {
      await processingFunction(highScoreImage);
    });
    act(() => {
      result.current.discardBestFrame();
    });
    await act(async () => {
      await processingFunction(lowScoreImage);
    });
    await act(async () => {
      result.current.flushBestFrame();
    });

    expect(initialProps.handle.compressImage).toHaveBeenCalledTimes(1);
    expect(initialProps.handle.compressImage).toHaveBeenCalledWith(lowScoreImage);

    unmount();
  });

  it('should not call onFrameSelected for a flush that was discarded while its compression was in flight', async () => {
    const initialProps = createProps();
    const deferred = createDeferred<{ blob: unknown; uri: string }>();
    (initialProps.handle.compressImage as jest.Mock).mockImplementation(() => deferred.promise);
    const { result, unmount } = renderHook(() => useFrameSelection(initialProps));
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const image = { data: [1], width: 11, height: 12 } as unknown as ImageData;

    await act(async () => {
      await processingFunction(image);
    });
    act(() => {
      result.current.flushBestFrame();
    });
    act(() => {
      result.current.discardBestFrame();
    });
    await act(async () => {
      deferred.resolve({ blob: {}, uri: 'test' });
      await deferred.promise;
    });

    expect(initialProps.onFrameSelected).not.toHaveBeenCalled();

    unmount();
  });

  it('should count in-flight flushes in the processing counters, to avoid a premature "done" state', async () => {
    // Persisted (not "Once") : the flush below triggers state updates, which cause useQueue to be called again on
    // every re-render, and the "totalItems: 2, processingCount: 0" shape must stay in effect for all of them.
    (useQueue as jest.Mock).mockReturnValue({
      push: jest.fn(),
      totalItems: 2,
      processingCount: 0,
    });
    const initialProps = createProps();
    const deferred = createDeferred<{ blob: unknown; uri: string }>();
    (initialProps.handle.compressImage as jest.Mock).mockImplementation(() => deferred.promise);
    const { result, unmount } = renderHook(() => useFrameSelection(initialProps));
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const image = { data: [1], width: 11, height: 12 } as unknown as ImageData;

    try {
      await act(async () => {
        await processingFunction(image);
      });
      act(() => {
        result.current.flushBestFrame();
      });

      expect(result.current.totalProcessingFrames).toEqual(3);
      expect(result.current.processedFrames).toEqual(2);

      await act(async () => {
        deferred.resolve({ blob: {}, uri: 'test' });
        await deferred.promise;
      });

      expect(result.current.processedFrames).toEqual(3);
    } finally {
      // Restore the default shape from the @monkvision/common mock, so later tests in this file are not affected.
      (useQueue as jest.Mock).mockReturnValue({
        length: 0,
        processingCount: 0,
        onHoldCount: 0,
        totalItems: 0,
        isFull: false,
        isAtMaxProcessing: false,
        push: jest.fn(),
        failedItems: [],
        clearFailedItems: jest.fn(),
        clear: jest.fn(),
      });
    }

    unmount();
  });

  it('should flush on every flushTrigger change and disable the interval, when flushTrigger is provided', async () => {
    const initialProps = { ...createProps(), flushTrigger: 0 };
    const { rerender, unmount } = renderHook(
      (props: UseFrameSelectionParams) => useFrameSelection(props),
      { initialProps },
    );

    expect(useInterval).toHaveBeenCalledWith(expect.any(Function), null);
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    const image = { data: [1], width: 11, height: 12 } as unknown as ImageData;
    await act(async () => {
      await processingFunction(image);
    });
    expect(initialProps.handle.compressImage).not.toHaveBeenCalled();

    await act(async () => {
      rerender({ ...initialProps, flushTrigger: 1 });
    });

    expect(initialProps.handle.compressImage).toHaveBeenCalledTimes(1);
    expect(initialProps.handle.compressImage).toHaveBeenCalledWith(image);

    unmount();
  });
});
