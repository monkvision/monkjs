import { DeviceOrientation } from '@monkvision/types';
import { renderHook } from '@testing-library/react-hooks';
import { useEnforceOrientation } from '../../src/hooks';
import { useWindowDimensions } from '@monkvision/common';

describe('useEnforceOrientation hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return false when the orientation is not specified', () => {
    const { result, unmount } = renderHook(useEnforceOrientation);

    expect(result.current).toBe(false);

    unmount();
  });

  [DeviceOrientation.PORTRAIT, DeviceOrientation.LANDSCAPE].forEach((orientation) => {
    it(`should return false when the orientation matches (${orientation})`, () => {
      (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({
        isPortrait: orientation === DeviceOrientation.PORTRAIT,
      }));
      const { result, unmount } = renderHook(useEnforceOrientation, { initialProps: orientation });

      expect(result.current).toBe(false);

      unmount();
    });

    it(`should return true when the orientation doesn't match (${orientation})`, () => {
      (useWindowDimensions as jest.Mock).mockImplementationOnce(() => ({
        isPortrait: orientation === DeviceOrientation.LANDSCAPE,
      }));
      const { result, unmount } = renderHook(useEnforceOrientation, { initialProps: orientation });

      expect(result.current).toBe(true);

      unmount();
    });
  });
});
