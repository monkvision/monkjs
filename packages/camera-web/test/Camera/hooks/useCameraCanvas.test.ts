/* eslint-disable jest/valid-title */
import { getResolutionDimensions } from '../../../src/Camera/hooks/utils';

jest.mock('../../../src/Camera/hooks/utils', () => ({
  ...jest.requireActual('../../../src/Camera/hooks/utils'),
  getResolutionDimensions: jest.fn(() => ({ width: 1, height: 1 })),
}));

import { renderHook } from '@testing-library/react';
import React from 'react';
import { CameraCanvasConfig, useCameraCanvas } from '../../../src/Camera/hooks';
import { CameraResolution } from '@monkvision/types';

function createProps(): CameraCanvasConfig {
  return {
    resolution: CameraResolution.HD_720P,
    streamDimensions: { width: 4567, height: 1234 },
    allowImageUpscaling: false,
  };
}

describe('useCameraCanvas hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a ref object', () => {
    const useRefSpy = jest.spyOn(React, 'useRef');

    const { result, unmount } = renderHook(useCameraCanvas, { initialProps: createProps() });

    expect(useRefSpy).toHaveBeenCalledWith(null);
    expect(result.current.ref).toBe(useRefSpy.mock.results[0].value);
    unmount();
  });

  it('should not update the dimensions of the canvas when the stream dimensions are null', () => {
    const width = 12;
    const height = 24;
    const ref = { current: { width, height } };
    const initialProps = { ...createProps(), streamDimensions: null };
    jest.spyOn(React, 'useRef').mockImplementation(() => ref);

    const { result, unmount } = renderHook(useCameraCanvas, { initialProps });

    expect(ref.current.width).toEqual(width);
    expect(ref.current.height).toEqual(height);
    expect(result.current.dimensions).toBeNull();
    unmount();
  });

  [
    {
      title:
        'should handle the case where asked resolution is bigger than stream resolution but upscaling is disabled',
      streamDimensions: { width: 500, height: 500 },
      askedDimensions: { width: 5000, height: 8000 },
      allowImageUpscaling: false,
      expected: { width: 500, height: 500 },
    },
    {
      title:
        'should handle the case where asked resolution is bigger than stream resolution and upscaling is enabled',
      streamDimensions: { width: 500, height: 500 },
      askedDimensions: { width: 5000, height: 5000 },
      allowImageUpscaling: true,
      expected: { width: 5000, height: 5000 },
    },
    {
      title: 'should handle the case where asked resolution is smaller than the stream resolution',
      streamDimensions: { width: 5000, height: 5000 },
      askedDimensions: { width: 500, height: 500 },
      allowImageUpscaling: false,
      expected: { width: 500, height: 500 },
    },
    {
      title: 'should handle smaller resolution and wrong ratio with fit to width',
      streamDimensions: { width: 5000, height: 5000 },
      askedDimensions: { width: 500, height: 800 },
      allowImageUpscaling: false,
      expected: { width: 500, height: 500 },
    },
    {
      title: 'should handle smaller resolution and wrong ratio with fit to height',
      streamDimensions: { width: 5000, height: 5000 },
      askedDimensions: { width: 800, height: 400 },
      allowImageUpscaling: false,
      expected: { width: 400, height: 400 },
    },
    {
      title: 'should handle bigger resolution and wrong ratio with upscaling',
      streamDimensions: { width: 500, height: 500 },
      askedDimensions: { width: 8000, height: 5000 },
      allowImageUpscaling: true,
      expected: { width: 5000, height: 5000 },
    },
  ].forEach((params) => {
    it(params.title, () => {
      const ref = { current: { width: 0, height: 0 } };
      const initialProps = {
        resolution: CameraResolution.QNHD_180P,
        streamDimensions: params.streamDimensions,
        allowImageUpscaling: params.allowImageUpscaling,
      };
      jest.spyOn(React, 'useRef').mockImplementation(() => ref);
      (getResolutionDimensions as jest.Mock).mockImplementationOnce(() => params.askedDimensions);

      const { result, unmount } = renderHook(useCameraCanvas, { initialProps });

      expect(getResolutionDimensions).toHaveBeenCalledWith(
        initialProps.resolution,
        params.streamDimensions.width < params.streamDimensions.height,
      );
      expect(ref.current.width).toEqual(params.expected.width);
      expect(ref.current.height).toEqual(params.expected.height);
      expect(result.current.dimensions).toEqual({
        width: params.expected.width,
        height: params.expected.height,
      });
      unmount();
    });
  });
});
