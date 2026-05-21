import { act, renderHook } from '@testing-library/react';
import { useMonkApi } from '@monkvision/network';
import { useMonkState } from '@monkvision/common';
import { ImageStatus } from '@monkvision/types';
import { ImagesCleanupParams, useImagesCleanup } from '../../../src/PhotoCapture/hooks';

const apiConfig = {
  apiDomain: 'apiDomain',
  authToken: 'authToken',
  thumbnailDomain: 'thumbnailDomain',
};
const inspectionId = 'inspection-123';
const state = {
  images: [
    { sightId: 'sight-1', id: 'id-1', inspectionId, status: ImageStatus.SUCCESS },
    { sightId: 'sight-1', id: 'id-2', inspectionId, status: ImageStatus.SUCCESS },
    { sightId: 'sight-1', id: 'id-3', inspectionId, status: ImageStatus.SUCCESS },
    { sightId: 'sight-2', id: 'id-4', inspectionId, status: ImageStatus.SUCCESS },
    { sightId: 'sight-2', id: 'id-5', inspectionId, status: ImageStatus.SUCCESS },
    { sightId: 'sight-3', id: 'id-6', inspectionId, status: ImageStatus.SUCCESS },
  ],
};

const createInitialProps = (autoDeletePreviousSightImages = true): ImagesCleanupParams => ({
  inspectionId,
  apiConfig,
  autoDeletePreviousSightImages,
});

describe('useImagesCleanup hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should properly clean up images', () => {
    const deleteImage = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ deleteImage }));
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

    const { result, unmount } = renderHook(useImagesCleanup, {
      initialProps: createInitialProps(),
    });

    act(() => {
      result.current.cleanupEventHandlers.onUploadSuccess?.({ sightId: 'sight-1' });
    });
    expect(deleteImage).toHaveBeenCalled();
    expect(deleteImage.mock.calls.length).toBe(4);

    unmount();
  });

  it('should not clean up images if no upload success event is triggered', () => {
    const deleteImage = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ deleteImage }));
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

    const { unmount } = renderHook(useImagesCleanup, {
      initialProps: createInitialProps(),
    });

    expect(deleteImage).not.toHaveBeenCalled();

    unmount();
  });

  it('should leave every sight with 1 image if sightId is not matched or undefined', () => {
    const deleteImage = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ deleteImage }));
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

    const { result, unmount } = renderHook(useImagesCleanup, {
      initialProps: createInitialProps(),
    });

    act(() => {
      result.current.cleanupEventHandlers.onUploadSuccess?.({ sightId: 'sight-non-matching' });
    });

    expect(deleteImage.mock.calls.length).toBe(3);

    unmount();
  });

  it('should not clean up images if timeout occurs', () => {
    const deleteImage = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ deleteImage }));
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

    const { result, unmount } = renderHook(useImagesCleanup, {
      initialProps: createInitialProps(),
    });

    act(() => {
      result.current.cleanupEventHandlers.onUploadTimeout?.();
    });

    expect(deleteImage).not.toHaveBeenCalled();

    unmount();
  });

  it('should not trigger cleanup if autoDeletePreviousSightImages is false', () => {
    const deleteImage = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ deleteImage }));
    (useMonkState as jest.Mock).mockImplementation(() => ({ state }));

    const { result, unmount } = renderHook(useImagesCleanup, {
      initialProps: createInitialProps(false),
    });

    act(() => {
      result.current.cleanupEventHandlers.onUploadSuccess?.({ sightId: 'sight-1' });
    });

    expect(deleteImage).not.toHaveBeenCalled();

    unmount();
  });

  it('should not delete images that have not been uploaded to the server', () => {
    const deleteImage = jest.fn(() => Promise.resolve());
    (useMonkApi as jest.Mock).mockImplementation(() => ({ deleteImage }));
    const stateWithNonUploaded = {
      images: [
        { sightId: 'sight-1', id: 'id-1', inspectionId, status: ImageStatus.UPLOADING },
        { sightId: 'sight-1', id: 'id-2', inspectionId, status: ImageStatus.UPLOAD_FAILED },
        { sightId: 'sight-1', id: 'id-3', inspectionId, status: ImageStatus.UPLOAD_ERROR },
        { sightId: 'sight-1', id: 'id-4', inspectionId, status: ImageStatus.SUCCESS },
      ],
    };
    (useMonkState as jest.Mock).mockImplementation(() => ({ state: stateWithNonUploaded }));

    const { result, unmount } = renderHook(useImagesCleanup, {
      initialProps: createInitialProps(),
    });

    act(() => {
      result.current.cleanupEventHandlers.onUploadSuccess?.({
        sightId: 'sight-1',
        imageId: 'id-4',
      });
    });

    expect(deleteImage).not.toHaveBeenCalled();

    unmount();
  });
});
