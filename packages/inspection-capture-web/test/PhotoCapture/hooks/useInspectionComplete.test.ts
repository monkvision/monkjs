import { renderHook } from '@testing-library/react';
import { LoadingState } from '@monkvision/common';
import { createFakePromise, FakePromise, flushPromises } from '@monkvision/test-utils';
import {
  InspectionCompleteParams,
  PhotoCaptureSightState,
  useInspectionComplete,
} from '../../../src/PhotoCapture/hooks';

function createParams(
  imagesCleanupPromise: FakePromise<void>,
  isInspectionCompliant = false,
): InspectionCompleteParams {
  return {
    startTasks: jest.fn(() => Promise.resolve()),
    sightState: {
      isInspectionCompliant,
      isInspectionCompleted: false,
      setIsInspectionCompleted: jest.fn(),
    } as unknown as PhotoCaptureSightState,
    loading: {
      start: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    } as unknown as LoadingState,
    startTasksOnComplete: true,
    onUpdateDuration: jest.fn(() => Promise.resolve(1234)),
    cleanupImages: jest.fn(() => imagesCleanupPromise),
  };
}

describe('useInspectionComplete hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should not start the inspection tasks before the images cleanup is completed', async () => {
    const imagesCleanupPromise = createFakePromise<void>();
    const initialProps = createParams(imagesCleanupPromise);
    const { result, unmount } = renderHook(useInspectionComplete, { initialProps });

    result.current.handleInspectionCompleted();
    await flushPromises();
    expect(initialProps.cleanupImages).toHaveBeenCalled();
    expect(initialProps.loading.start).toHaveBeenCalled();
    expect(initialProps.startTasks).not.toHaveBeenCalled();

    imagesCleanupPromise.resolve();
    await flushPromises();
    expect(initialProps.startTasks).toHaveBeenCalled();

    unmount();
  });

  it('should wait for the images cleanup when the inspection is automatically completed', async () => {
    const imagesCleanupPromise = createFakePromise<void>();
    const initialProps = createParams(imagesCleanupPromise, true);
    const { unmount } = renderHook(useInspectionComplete, { initialProps });

    await flushPromises();
    expect(initialProps.cleanupImages).toHaveBeenCalled();
    expect(initialProps.startTasks).not.toHaveBeenCalled();

    imagesCleanupPromise.resolve();
    await flushPromises();
    expect(initialProps.startTasks).toHaveBeenCalled();

    unmount();
  });
});
