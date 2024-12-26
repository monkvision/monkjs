jest.mock('../../../src/VideoCapture/hooks/useFrameSelection/laplaceScores', () => ({
  calculateLaplaceScores: jest.fn(() => ({ mean: 0, std: 0 })),
}));

import { act, renderHook } from '@testing-library/react-hooks';
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

describe('useFrameSelection hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an onCaptureVideoFrame callback', () => {
    const initialProps = createProps();
    const { result, unmount } = renderHook(useFrameSelection, { initialProps });

    expect(typeof result.current.onCaptureVideoFrame).toBe('function');

    unmount();
  });

  it('should not select any frames if no screenshot has been taken', () => {
    const initialProps = createProps();
    const { unmount } = renderHook(useFrameSelection, { initialProps });

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
    const { result, unmount } = renderHook(useFrameSelection, { initialProps });

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

  it('should select the best frame using the laplace scoring function by making copies with the array.slice method', async () => {
    const initialProps = createProps();
    const { rerender, unmount } = renderHook(useFrameSelection, { initialProps });

    expect(useQueue).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({ storeFailedItems: false }),
    );
    const processingFunction = (useQueue as jest.Mock).mock.calls[0][0];
    (calculateLaplaceScores as jest.Mock).mockImplementation(([imageId]) => {
      if (imageId === 1) {
        return { std: 0.4 };
      }
      if (imageId === 2) {
        return { std: 0.6 };
      }
      if (imageId === 3) {
        return { std: 0.2 };
      }
      return null;
    });

    const image1 = {
      data: { slice: jest.fn(() => [1]) },
      width: 11,
      height: 12,
    } as unknown as ImageData;
    const image2 = {
      data: { slice: jest.fn(() => [2]) },
      width: 21,
      height: 22,
    } as unknown as ImageData;
    const image3 = {
      data: { slice: jest.fn(() => [3]) },
      width: 31,
      height: 32,
    } as unknown as ImageData;

    expect(calculateLaplaceScores).not.toHaveBeenCalled();
    await act(async () => {
      await processingFunction(image1);
      rerender();
      await processingFunction(image2);
      rerender();
      await processingFunction(image3);
      rerender();
    });

    expect(image1.data.slice).toHaveBeenCalled();
    expect(image2.data.slice).toHaveBeenCalled();
    expect(image3.data.slice).toHaveBeenCalled();
    expect(calculateLaplaceScores).toHaveBeenCalledTimes(3);
    expect(calculateLaplaceScores).toHaveBeenCalledWith(
      image1.data.slice(),
      image1.width,
      image1.height,
    );
    expect(calculateLaplaceScores).toHaveBeenCalledWith(
      image2.data.slice(),
      image2.width,
      image2.height,
    );
    expect(calculateLaplaceScores).toHaveBeenCalledWith(
      image3.data.slice(),
      image3.width,
      image3.height,
    );

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
});
