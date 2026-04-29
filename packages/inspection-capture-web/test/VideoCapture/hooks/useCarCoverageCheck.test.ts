import { renderHook } from '@testing-library/react';
import { Image, ImageStatus, ImageType, MonkEntityType } from '@monkvision/types';
import { useMonkState } from '@monkvision/common';
import { useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import {
  hasEnoughCarCoverage,
  useCarCoverageCheck,
  UseCarCoverageCheckParams,
} from '../../../src/VideoCapture/hooks/useCarCoverageCheck';

jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  useMonkState: jest.fn(),
  getInspectionImages: jest.fn(
    (inspectionId: string, images: Image[]) =>
      images.filter((img) => img.inspectionId === inspectionId),
  ),
}));

function createImage(alpha?: number, inspectionId = 'test-inspection'): Image {
  return {
    id: `img-${Math.random()}`,
    entityType: MonkEntityType.IMAGE,
    inspectionId,
    path: '',
    thumbnailPath: '',
    width: 100,
    height: 100,
    size: 1000,
    mimetype: 'image/jpeg',
    type: ImageType.BEAUTY_SHOT,
    status: ImageStatus.SUCCESS,
    renderedOutputs: [],
    views: [],
    additionalData: alpha !== undefined ? { alpha } : undefined,
  };
}

function createImagesForBucket(bucketIndex: number, count: number, inspectionId?: string): Image[] {
  const bucketSize = 60;
  const bucketStart = bucketIndex * bucketSize;
  return Array.from({ length: count }, (_, i) =>
    createImage(bucketStart + (i * bucketSize) / count, inspectionId),
  );
}

function createFullCoverageImages(imagesPerBucket = 5, inspectionId?: string): Image[] {
  return Array.from({ length: 6 }, (_, i) =>
    createImagesForBucket(i, imagesPerBucket, inspectionId),
  ).flat();
}

describe('hasEnoughCarCoverage', () => {
  it('should return false when there are no images', () => {
    expect(hasEnoughCarCoverage([])).toBe(false);
  });

  it('should return false when images have no alpha data', () => {
    const images = Array.from({ length: 30 }, () => createImage(undefined));
    expect(hasEnoughCarCoverage(images)).toBe(false);
  });

  it('should return true when all 6 buckets have at least 5 images', () => {
    const images = createFullCoverageImages(5);
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should return true when buckets have more than 5 images', () => {
    const images = createFullCoverageImages(10);
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should return false when one bucket has fewer than 5 images', () => {
    const images = [
      ...createImagesForBucket(0, 5),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 4),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(false);
  });

  it('should correctly assign alpha=0 to bucket 0', () => {
    const images = [
      ...Array.from({ length: 5 }, () => createImage(0)),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should correctly assign alpha=359 to bucket 5 (last bucket)', () => {
    const images = [
      ...createImagesForBucket(0, 5),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...Array.from({ length: 5 }, () => createImage(359)),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should correctly assign alpha=60 to bucket 1', () => {
    const images = [
      ...createImagesForBucket(0, 5),
      ...Array.from({ length: 5 }, () => createImage(60)),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should handle alpha=360 by normalizing to bucket 0', () => {
    const images = [
      ...Array.from({ length: 5 }, () => createImage(360)),
      ...createImagesForBucket(1, 5),
      ...createImagesForBucket(2, 5),
      ...createImagesForBucket(3, 5),
      ...createImagesForBucket(4, 5),
      ...createImagesForBucket(5, 5),
    ];
    expect(hasEnoughCarCoverage(images)).toBe(true);
  });

  it('should skip images without additionalData', () => {
    const imagesWithAlpha = createFullCoverageImages(5);
    const imagesWithout = Array.from({ length: 10 }, () => createImage(undefined));
    expect(hasEnoughCarCoverage([...imagesWithAlpha, ...imagesWithout])).toBe(true);
  });
});

describe('useCarCoverageCheck', () => {
  const mockUseMonkState = useMonkState as jest.Mock;
  const testApiConfig = {
    apiDomain: 'test-api-domain',
    authToken: 'test-auth-token',
    thumbnailDomain: 'test-thumbnail-domain',
  };

  beforeEach(() => {
    mockUseMonkState.mockReturnValue({
      state: { images: [] },
      dispatch: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when hybrid video is disabled', () => {
    const images = createFullCoverageImages(5, 'test-inspection');
    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: false,
    };
    const { result, unmount } = renderHook(() => useCarCoverageCheck(params));

    expect(result.current).toBe(false);
    unmount();
  });

  it('should return false when there are not enough images', () => {
    mockUseMonkState.mockReturnValue({
      state: { images: [] },
      dispatch: jest.fn(),
    });

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { result, unmount } = renderHook(() => useCarCoverageCheck(params));

    expect(result.current).toBe(false);
    unmount();
  });

  it('should return true when there is enough coverage in hybrid mode', () => {
    const images = createFullCoverageImages(5, 'test-inspection');
    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { result, unmount } = renderHook(() => useCarCoverageCheck(params));

    expect(result.current).toBe(true);
    unmount();
  });

  it('should only consider images from the given inspection', () => {
    const correctImages = createFullCoverageImages(5, 'test-inspection');
    const otherImages = createFullCoverageImages(5, 'other-inspection');
    mockUseMonkState.mockReturnValue({
      state: { images: [...correctImages, ...otherImages] },
      dispatch: jest.fn(),
    });

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { result, unmount } = renderHook(() => useCarCoverageCheck(params));

    expect(result.current).toBe(true);
    unmount();
  });

  it('should delete existing images once state is populated and coverage is insufficient', () => {
    const images = [
      { id: 'img-1', inspectionId: 'test-inspection' },
      { id: 'img-2', inspectionId: 'test-inspection' },
    ];
    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { rerender, unmount } = renderHook(() => useCarCoverageCheck(params));

    const { deleteImagesBulk } = (useMonkApi as jest.Mock).mock.results[0].value;
    expect(deleteImagesBulk).not.toHaveBeenCalled();

    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });
    rerender();

    expect(deleteImagesBulk).toHaveBeenCalledWith({
      inspectionId: 'test-inspection',
      imageIds: ['img-1', 'img-2'],
    });

    unmount();
  });

  it('should not call deleteImagesBulk when coverage is sufficient', () => {
    const images = createFullCoverageImages(5, 'test-inspection');

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { rerender, unmount } = renderHook(() => useCarCoverageCheck(params));

    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });
    rerender();

    const { deleteImagesBulk } = (useMonkApi as jest.Mock).mock.results[0].value;
    expect(deleteImagesBulk).not.toHaveBeenCalled();

    unmount();
  });

  it('should not call deleteImagesBulk when there are no images', () => {
    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { unmount } = renderHook(() => useCarCoverageCheck(params));

    const { deleteImagesBulk } = (useMonkApi as jest.Mock).mock.results[0].value;
    expect(deleteImagesBulk).not.toHaveBeenCalled();

    unmount();
  });

  it('should only delete images belonging to the current inspection', () => {
    const images = [
      { id: 'img-1', inspectionId: 'test-inspection' },
      { id: 'img-other', inspectionId: 'other-inspection' },
      { id: 'img-2', inspectionId: 'test-inspection' },
    ];

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { rerender, unmount } = renderHook(() => useCarCoverageCheck(params));

    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });
    rerender();

    const { deleteImagesBulk } = (useMonkApi as jest.Mock).mock.results[0].value;
    expect(deleteImagesBulk).toHaveBeenCalledWith({
      inspectionId: 'test-inspection',
      imageIds: ['img-1', 'img-2'],
    });

    unmount();
  });

  it('should only delete images once even if state changes again', () => {
    const images = [
      { id: 'img-1', inspectionId: 'test-inspection' },
    ];

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { rerender, unmount } = renderHook(() => useCarCoverageCheck(params));

    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });
    rerender();

    const { deleteImagesBulk } = (useMonkApi as jest.Mock).mock.results[0].value;
    expect(deleteImagesBulk).toHaveBeenCalledTimes(1);

    mockUseMonkState.mockReturnValue({
      state: { images: [...images, { id: 'img-3', inspectionId: 'test-inspection' }] },
      dispatch: jest.fn(),
    });
    rerender();

    expect(deleteImagesBulk).toHaveBeenCalledTimes(1);

    unmount();
  });

  it('should report errors when deleteImagesBulk fails', async () => {
    const error = new Error('delete failed');
    const deleteImagesBulkMock = jest.fn(() => Promise.reject(error));
    const handleErrorMock = jest.fn();
    (useMonkApi as jest.Mock).mockReturnValue({
      addImage: jest.fn(() => Promise.resolve()),
      deleteImagesBulk: deleteImagesBulkMock,
    });
    (useMonitoring as jest.Mock).mockReturnValue({ handleError: handleErrorMock });
    const images = [
      { id: 'img-1', inspectionId: 'test-inspection' },
    ];

    const params: UseCarCoverageCheckParams = {
      inspectionId: 'test-inspection',
      apiConfig: testApiConfig,
      enableHybridVideo: true,
    };
    const { rerender, unmount } = renderHook(() => useCarCoverageCheck(params));

    mockUseMonkState.mockReturnValue({
      state: { images },
      dispatch: jest.fn(),
    });
    rerender();

    await jest.runAllTimersAsync();

    expect(handleErrorMock).toHaveBeenCalledWith(error);

    unmount();
  });
});
