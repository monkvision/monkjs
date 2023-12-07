import { expectHTMLElementToHaveRef } from '@monkvision/test-utils';
import React from 'react';

const VIDEO_PREVIEW_TEST_ID = 'camera-video-preview';
const CANVAS_TEST_ID = 'camera-canvas';

const videoRefMock = React.createRef<HTMLVideoElement>();
const dimensionsMock = { width: 1234, height: 5678 };
const errorMock = { type: 'test-error' };
const retryMock = jest.fn();
let isPreviewLoadingMock = false;
const useCameraPreviewMock = jest.fn(() => ({
  ref: videoRefMock,
  dimensions: dimensionsMock,
  error: errorMock,
  retry: retryMock,
  isLoading: isPreviewLoadingMock,
}));

const canvasRefMock = React.createRef<HTMLCanvasElement>();
const useCameraCanvasMock = jest.fn(() => ({ ref: canvasRefMock }));

const takeScreenshotMock = jest.fn();
const useCameraScreenshotMock = jest.fn(() => ({ takeScreenshot: takeScreenshotMock }));

const takePictureMock = jest.fn();
let isTakePictureLoadingMock = false;
const useTakePictureMock = jest.fn(() => ({
  takePicture: takePictureMock,
  isLoading: isTakePictureLoadingMock,
}));

const compressMock = jest.fn();
const useCompressionMock = jest.fn(() => ({ compress: compressMock }));

const cameraHUDTestId = 'test-id-camera-hud';
const useCameraHUDMock = jest.fn(() => <div data-testid={cameraHUDTestId}></div>);

jest.mock('../../src/Camera/hooks', () => ({
  ...jest.requireActual('../../src/Camera/hooks'),
  useCameraPreview: useCameraPreviewMock,
  useCameraCanvas: useCameraCanvasMock,
  useCameraScreenshot: useCameraScreenshotMock,
  useCompression: useCompressionMock,
  useTakePicture: useTakePictureMock,
  useCameraHUD: useCameraHUDMock,
}));

import { render, screen } from '@testing-library/react';
import {
  Camera,
  CameraFacingMode,
  CameraHUDComponent,
  CameraResolution,
  CompressionFormat,
} from '../../src';
import { useCameraHUD } from '../../src/Camera/hooks';

describe('Camera component', () => {
  afterEach(() => {
    jest.clearAllMocks();
    isPreviewLoadingMock = false;
    isTakePictureLoadingMock = false;
  });

  it('should pass the facingMode, resolution and deviceId props to the useCameraPreview hook', () => {
    const facingMode = CameraFacingMode.USER;
    const resolution = CameraResolution.HD_720P;
    const deviceId = 'test-device-id';
    const { unmount } = render(
      <Camera facingMode={facingMode} resolution={resolution} deviceId={deviceId} />,
    );

    expect(useCameraPreviewMock).toHaveBeenCalledWith({ facingMode, resolution, deviceId });
    unmount();
  });

  it('should use CameraFacingMode.ENVIRONMENT as the default facingMode', () => {
    const { unmount } = render(<Camera />);

    expect(useCameraPreviewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        facingMode: CameraFacingMode.ENVIRONMENT,
      }),
    );
    unmount();
  });

  it('should use CameraResolution.UHD_4K as the default resolution', () => {
    const { unmount } = render(<Camera />);

    expect(useCameraPreviewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        resolution: CameraResolution.UHD_4K,
      }),
    );
    unmount();
  });

  it('should not use any deviceId if not provided', () => {
    const { unmount } = render(<Camera />);

    expect(useCameraPreviewMock).toHaveBeenCalledWith(
      expect.objectContaining({
        deviceId: undefined,
      }),
    );
    unmount();
  });

  it('should pass the stream dimensions to the useCameraCanvas hook', () => {
    const { unmount } = render(<Camera />);

    expect(useCameraCanvasMock).toHaveBeenCalledWith({ dimensions: dimensionsMock });
    unmount();
  });

  it('should pass the video ref, canvasRef and stream dimensions to the useCameraScreenshot hook', () => {
    const { unmount } = render(<Camera />);

    expect(useCameraScreenshotMock).toHaveBeenCalledWith({
      videoRef: videoRefMock,
      canvasRef: canvasRefMock,
      dimensions: dimensionsMock,
    });
    unmount();
  });

  it('should pass the canvas ref and the compression options to the useCompression hook', () => {
    const format = CompressionFormat.JPEG;
    const quality = 0.4;
    const { unmount } = render(<Camera format={format} quality={quality} />);

    expect(useCompressionMock).toHaveBeenCalledWith({
      canvasRef: canvasRefMock,
      options: { format, quality },
    });
    unmount();
  });

  it('should use the CompressionFormat.JPEG as the default compression format', () => {
    const { unmount } = render(<Camera />);

    expect(useCompressionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ format: CompressionFormat.JPEG }),
      }),
    );
    unmount();
  });

  it('should use 0.8 as the default compression quality', () => {
    const { unmount } = render(<Camera />);

    expect(useCompressionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.objectContaining({ quality: 0.8 }),
      }),
    );
    unmount();
  });

  it('should pass the proper options to the useTakePicture hook', () => {
    const monitoring = {
      parentId: 'test-id',
      tags: { testTagName: 'testTagValue' },
      data: { testDataName: 'testDataValue' },
    };
    const onPictureTaken = () => {};
    const { unmount } = render(<Camera monitoring={monitoring} onPictureTaken={onPictureTaken} />);

    expect(useTakePictureMock).toHaveBeenCalledWith({
      compress: compressMock,
      takeScreenshot: takeScreenshotMock,
      onPictureTaken,
      monitoring,
    });
    unmount();
  });

  it('should use no onPictureTaken handler by default', () => {
    const { unmount } = render(<Camera />);

    expect(useTakePictureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        onPictureTaken: undefined,
      }),
    );
    unmount();
  });

  it('should use no extra monitoring config by default', () => {
    const { unmount } = render(<Camera />);

    expect(useTakePictureMock).toHaveBeenCalledWith(
      expect.objectContaining({
        monitoring: undefined,
      }),
    );
    unmount();
  });

  it('should pass the HUDComponent and camera handle to the useCameraHUD hook', () => {
    const HUDComponent = (<div></div>) as unknown as CameraHUDComponent;
    const { unmount } = render(<Camera HUDComponent={HUDComponent} />);

    expect(useCameraHUD).toHaveBeenCalledWith({
      component: HUDComponent,
      handle: {
        takePicture: takePictureMock,
        error: errorMock,
        retry: retryMock,
        isLoading: isPreviewLoadingMock || isTakePictureLoadingMock,
      },
    });
    unmount();
  });

  it('should use no HUDComponent if not provided', () => {
    const { unmount } = render(<Camera />);

    expect(useCameraHUD).toHaveBeenCalledWith(expect.objectContaining({ component: undefined }));
    unmount();
  });

  it('should not be loading when both the preview and the take picture are not loading', () => {
    isPreviewLoadingMock = false;
    isTakePictureLoadingMock = false;
    const { unmount } = render(<Camera />);

    expect(useCameraHUD).toHaveBeenCalledWith(
      expect.objectContaining({
        handle: expect.objectContaining({ isLoading: false }),
      }),
    );
    unmount();
  });

  it('should be loading when the preview is loading', () => {
    isPreviewLoadingMock = true;
    isTakePictureLoadingMock = false;
    const { unmount } = render(<Camera />);

    expect(useCameraHUD).toHaveBeenCalledWith(
      expect.objectContaining({
        handle: expect.objectContaining({ isLoading: true }),
      }),
    );
    unmount();
  });

  it('should be loading when the take picture is loading', () => {
    isPreviewLoadingMock = false;
    isTakePictureLoadingMock = true;
    const { unmount } = render(<Camera />);

    expect(useCameraHUD).toHaveBeenCalledWith(
      expect.objectContaining({
        handle: expect.objectContaining({ isLoading: true }),
      }),
    );
    unmount();
  });

  it('should display a video element', () => {
    const { unmount } = render(<Camera />);

    expect(screen.queryByTestId(VIDEO_PREVIEW_TEST_ID)).not.toBeNull();
    unmount();
  });

  it('should display a canvas element', () => {
    const { unmount } = render(<Camera />);

    expect(screen.queryByTestId(CANVAS_TEST_ID)).not.toBeNull();
    unmount();
  });

  it('should display the HUD element obtained from the useCameraHUD hook', () => {
    const { unmount } = render(<Camera />);

    const hudEl = screen.queryByTestId(cameraHUDTestId);
    expect(hudEl).not.toBeNull();
    unmount();
  });

  describe('Camera preview video element', () => {
    let videoEl = {} as HTMLVideoElement;
    let unmount = () => {};

    beforeEach(() => {
      const { unmount: unmountFn, container } = render(<Camera />);
      unmount = unmountFn;

      videoEl = container.querySelector('video') as HTMLVideoElement;
      if (!videoEl) {
        throw new Error(
          "Unable to run the video element tests because the video element can't be found.",
        );
      }
    });

    afterEach(() => {
      unmount();
    });

    it('should have autoplay on', () => {
      expect(videoEl.getAttribute('autoPlay')).toEqual('');
    });

    it('should have playsInline on', () => {
      expect(videoEl.getAttribute('playsInline')).toEqual('');
    });

    it('should have controls off', () => {
      expect(videoEl.getAttribute('controls')).toEqual(null);
    });

    it('should have its ref set to the video ref', () => {
      expectHTMLElementToHaveRef(VIDEO_PREVIEW_TEST_ID, videoRefMock);
    });
  });

  describe('Camera canvas element', () => {
    it('should have its ref set to the canvas ref', () => {
      const { unmount } = render(<Camera />);

      expectHTMLElementToHaveRef(CANVAS_TEST_ID, canvasRefMock);
      unmount();
    });
  });
});
