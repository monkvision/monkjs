jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDButtons', () => ({
  PhotoCaptureHUDButtons: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDOverlay', () => ({
  PhotoCaptureHUDOverlay: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDPreview', () => ({
  PhotoCaptureHUDPreview: jest.fn(() => <></>),
}));

import { useTranslation } from 'react-i18next';
import { act, render, screen } from '@testing-library/react';
import { sights } from '@monkvision/sights';
import { LoadingState } from '@monkvision/common';
import { CameraHandle } from '@monkvision/camera-web';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { BackdropDialog } from '@monkvision/common-ui-web';
import {
  PhotoCaptureHUD,
  PhotoCaptureHUDButtons,
  PhotoCaptureHUDOverlay,
  PhotoCaptureHUDPreview,
  PhotoCaptureHUDProps,
} from '../../../src';
import { PhotoCaptureMode } from '../../../src/PhotoCapture/hooks';

const cameraTestId = 'camera-test-id';

function createProps(): PhotoCaptureHUDProps {
  return {
    inspectionId: 'test-inspection-id-test',
    sights: [
      sights['test-sight-1'],
      sights['test-sight-2'],
      sights['test-sight-3'],
      sights['test-sight-4'],
    ],
    selectedSight: sights['test-sight-2'],
    sightsTaken: [sights['test-sight-1']],
    lastPictureTaken: { uri: 'test-last-pic-taken', height: 1, width: 2, mimetype: 'test' },
    mode: PhotoCaptureMode.SIGHT,
    loading: { isLoading: false, error: null } as unknown as LoadingState,
    onSelectSight: jest.fn(),
    onAddDamage: jest.fn(),
    onCancelAddDamage: jest.fn(),
    onRetry: jest.fn(),
    onClose: jest.fn(),
    showCloseButton: true,
    handle: {
      isLoading: false,
      error: null,
      dimensions: { height: 2, width: 4 },
    } as unknown as CameraHandle,
    cameraPreview: <div data-testid={cameraTestId}></div>,
  };
}

describe('PhotoCaptureHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display the camera preview on the screen', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expect(screen.queryByTestId(cameraTestId)).not.toBeNull();

    unmount();
  });

  it('should display the PhotoCaptureHUDPreview component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDPreview, {
      selectedSight: props.selectedSight,
      sights: props.sights,
      sightsTaken: props.sightsTaken,
      mode: props.mode,
      onAddDamage: props.onAddDamage,
      onCancelAddDamage: props.onCancelAddDamage,
      onSelectSight: props.onSelectSight,
      isLoading: props.loading.isLoading || props.handle.isLoading,
      error: props.loading.error ?? props.handle.error,
      streamDimensions: props.handle.dimensions,
    });

    unmount();
  });

  it('should display the PhotoCaptureHUDButtons component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDButtons, {
      onTakePicture: props.handle?.takePicture,
      galleryPreview: props.lastPictureTaken ?? undefined,
      closeDisabled: !!props.loading.error || !!props.handle.error,
      galleryDisabled: !!props.loading.error || !!props.handle.error,
      takePictureDisabled: !!props.loading.error || !!props.handle.error,
      showCloseButton: props.showCloseButton,
    });

    unmount();
  });

  it('should display the PhotoCaptureHUDOverlay component with the proper props', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(PhotoCaptureHUDOverlay, {
      inspectionId: props.inspectionId,
      handle: props.handle,
      isCaptureLoading: props.loading.isLoading,
      captureError: props.loading.error,
      onRetry: props.onRetry,
    });

    unmount();
  });

  it('should display the BackdropDialog component with the proper props', () => {
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: jest.fn((v) => v) }));
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    expectPropsOnChildMock(BackdropDialog, {
      message: 'photo.hud.closeConfirm.message',
      cancelLabel: 'photo.hud.closeConfirm.cancel',
      confirmLabel: 'photo.hud.closeConfirm.confirm',
    });

    unmount();
  });

  it('should properly handle the click on close event', () => {
    const props = createProps();
    const { unmount } = render(<PhotoCaptureHUD {...props} />);

    const { onClose } = (PhotoCaptureHUDButtons as jest.Mock).mock.calls[0][0];
    expectPropsOnChildMock(BackdropDialog, { show: false });
    jest.clearAllMocks();

    act(() => onClose());
    expectPropsOnChildMock(BackdropDialog, { show: true });
    const { onConfirm } = (BackdropDialog as jest.Mock).mock.calls[0][0];
    jest.clearAllMocks();

    expect(props.onClose).not.toHaveBeenCalled();
    act(() => onConfirm());
    expectPropsOnChildMock(BackdropDialog, { show: false });
    expect(props.onClose).toHaveBeenCalled();

    unmount();
  });
});
