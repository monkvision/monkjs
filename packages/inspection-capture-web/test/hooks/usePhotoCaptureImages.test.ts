const stateMock = { images: [{ id: 'test' }] };
const inspectionImagesMock = [{ id: 'test-hello' }];

jest.mock('@monkvision/common', () => ({
  useMonkState: jest.fn(() => ({ state: stateMock })),
  getInspectionImages: jest.fn(() => inspectionImagesMock),
}));

import { usePhotoCaptureImages } from '../../src/hooks';
import { renderHook } from '@testing-library/react';
import { getInspectionImages, useMonkState } from '@monkvision/common';

describe('usePhotoCaptureImages hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the images of the inspection using the getInspectionImages function', () => {
    const inspectionId = 'test-inspection-id-test';
    const { result, unmount } = renderHook(usePhotoCaptureImages, { initialProps: inspectionId });

    expect(useMonkState).toHaveBeenCalled();
    expect(getInspectionImages).toHaveBeenCalledWith(
      inspectionId,
      stateMock.images,
      undefined,
      true,
    );
    expect(result.current).toEqual(inspectionImagesMock);

    unmount();
  });

  it('should re-calculate the images of the inspection every time the state images change', () => {
    (getInspectionImages as jest.Mock).mockImplementation(() => [{ id: 'test-hello-1' }]);
    (useMonkState as jest.Mock).mockImplementation(() => ({
      state: { images: [{ id: 'test-1' }] },
    }));
    const inspectionId = 'test-inspection-id-test';
    const { result, rerender, unmount } = renderHook(usePhotoCaptureImages, {
      initialProps: inspectionId,
    });

    const newImages = [{ id: 'test-hello-2' }];
    (getInspectionImages as jest.Mock).mockImplementation(() => newImages);
    (useMonkState as jest.Mock).mockImplementation(() => ({
      state: { images: [{ id: 'test-2' }] },
    }));
    rerender();
    expect(result.current).toEqual(newImages);

    unmount();
  });

  it('should not re-calculate the images of the inspection if other elements of the state change', () => {
    const initialInspectionImages = [{ id: 'test-hello-1' }];
    const images = [{ id: 'test-1' }];

    (getInspectionImages as jest.Mock).mockImplementation(() => initialInspectionImages);
    (useMonkState as jest.Mock).mockImplementation(() => ({
      state: { images, inspections: [{ id: 'test-inspection-1' }] },
    }));

    const inspectionId = 'test-inspection-id-test';
    const { result, rerender, unmount } = renderHook(() => usePhotoCaptureImages(inspectionId));

    (getInspectionImages as jest.Mock).mockClear();

    (useMonkState as jest.Mock).mockImplementation(() => ({
      state: { images, inspections: [{ id: 'test-inspection-2' }] }, // Same images reference
    }));

    rerender();

    expect(getInspectionImages as jest.Mock).not.toHaveBeenCalled();

    expect(result.current).toEqual(initialInspectionImages);

    unmount();
  });
});
