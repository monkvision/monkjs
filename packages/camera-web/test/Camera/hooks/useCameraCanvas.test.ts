import { renderHook } from '@testing-library/react';
import React from 'react';
import { useCameraCanvas } from '../../../src/Camera/hooks';

describe('useCameraCanvas hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a ref object', () => {
    const useRefSpy = jest.spyOn(React, 'useRef');

    const { result, unmount } = renderHook(useCameraCanvas, { initialProps: { dimensions: null } });

    expect(useRefSpy).toHaveBeenCalledWith(null);
    expect(result.current.ref).toBe(useRefSpy.mock.results[0].value);
    unmount();
  });

  it('should update the dimensions of the canvas when the dimensions change', () => {
    const ref = { current: { width: 0, height: 0 } };
    const dimensions = { width: 99, height: 112 };
    jest.spyOn(React, 'useRef').mockImplementation(() => ref);

    const { unmount } = renderHook(useCameraCanvas, { initialProps: { dimensions } });

    expect(ref.current.width).toEqual(dimensions.width);
    expect(ref.current.height).toEqual(dimensions.height);
    unmount();
  });
});
