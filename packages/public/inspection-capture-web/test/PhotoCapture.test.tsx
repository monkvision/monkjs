import { expectPropsOnChildMock } from '@monkvision/test-utils';

jest.mock('@monkvision/common-ui-web');
jest.mock('@monkvision/camera-web');
jest.mock('../src/PhotoCaptureHUD/PhotoCaptureHUD', () => ({
  PhotoCaptureHUD: jest.fn(() => <></>),
}));

import { render } from '@testing-library/react';
import { Sight } from '@monkvision/types';
import { PhotoCapture } from '../src';
import {
  Camera,
  CameraFacingMode,
  CameraResolution,
  CompressionFormat,
} from '@monkvision/camera-web';

const sights = [
  { id: 'id', label: { en: 'en', fr: 'fr', de: 'de' } },
  { id: 'id2', label: { en: 'en2', fr: 'fr2', de: 'de2' } },
] as unknown as Sight[];

describe('PhotoCapture component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a Camera component', () => {
    const { unmount } = render(<PhotoCapture sights={sights} />);

    expect(Camera).toHaveBeenCalled();

    unmount();
  });
  it('should passed states, hud and handlePictureTaken to Camera component', () => {
    const CameraMock = Camera as jest.Mock;
    const state = {
      facingMode: CameraFacingMode.ENVIRONMENT,
      resolution: CameraResolution.UHD_4K,
      compressionFormat: CompressionFormat.JPEG,
      quality: '0.8',
    };
    const { unmount } = render(<PhotoCapture sights={sights} />);

    expectPropsOnChildMock(Camera as jest.Mock, {
      HUDComponent: expect.any(Function),
    });
    const { HUDComponent } = CameraMock.mock.calls[0][0];
    HUDComponent({ sights, cameraPreview: <> </>, handle: jest.fn() });
    expect(CameraMock.mock.calls[0][0].facingMode).toEqual(state.facingMode);
    expect(CameraMock.mock.calls[0][0].resolution).toEqual(state.resolution);
    expect(CameraMock.mock.calls[0][0].format).toEqual(state.compressionFormat);
    expect(CameraMock.mock.calls[0][0].quality).toEqual(Number(state.quality));

    unmount();
  });
});
