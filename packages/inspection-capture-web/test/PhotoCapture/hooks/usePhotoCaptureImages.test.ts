const stateMock = { images: [{ id: 'test' }] };
const inspectionImagesMock = [{ id: 'test-hello' }];

jest.mock('@monkvision/common', () => ({
  useMonkState: jest.fn(() => ({ state: stateMock })),
  getInspectionImages: jest.fn(() => inspectionImagesMock),
}));

import { usePhotoCaptureImages } from '../../../src/PhotoCapture/hooks';
import { renderHook } from '@testing-library/react-hooks';
import { getInspectionImages, useMonkState } from '@monkvision/common';

describe('usePhotoCaptureImages hook', () => {
  it('should return the images of the inspection using the getInspectionImages function', () => {
    const inspectionId = 'test-inspection-id-test';
    const { result, unmount } = renderHook(usePhotoCaptureImages, { initialProps: inspectionId });

    expect(useMonkState).toHaveBeenCalled();
    expect(getInspectionImages).toHaveBeenCalledWith(inspectionId, stateMock.images, true);
    expect(result.current).toEqual(inspectionImagesMock);

    unmount();
  });
});
