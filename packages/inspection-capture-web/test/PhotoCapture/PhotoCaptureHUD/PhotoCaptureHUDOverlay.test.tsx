import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import {
  CameraHandle,
  getCameraErrorLabel,
  UserMediaError,
  UserMediaErrorType,
} from '@monkvision/camera-web';
import { Button, Spinner } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { useObjectTranslation } from '@monkvision/common';
import { MonkNetworkError } from '@monkvision/network';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { PhotoCaptureHUDOverlay, PhotoCaptureHUDOverlayProps } from '../../../src';
import { PhotoCaptureErrorName } from '../../../src/PhotoCapture/errors';

const OVERLAY_TEST_ID = 'overlay';

function createProps(): PhotoCaptureHUDOverlayProps {
  return {
    isCaptureLoading: false,
    captureError: null,
    handle: {
      isLoading: false,
      error: null,
      retry: jest.fn(),
    } as unknown as CameraHandle,
    onRetry: jest.fn(),
    inspectionId: 'test-inspection-id',
  };
}

function mockTranslationFunction(returnValue: string, mockTObj = false): jest.Mock {
  const mock = jest.fn(() => returnValue);
  if (mockTObj) {
    (useObjectTranslation as jest.Mock).mockImplementation(() => ({ tObj: mock }));
  } else {
    (useTranslation as jest.Mock).mockImplementation(() => ({ t: mock }));
  }
  return mock;
}

describe('PhotoCaptureHUDOverlay component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null there is no loading or error', () => {
    const props = createProps();
    const { container, unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expect(container).toBeEmptyDOMElement();

    unmount();
  });

  it('should display a fixed overlay on top of the screen', () => {
    const props = createProps();
    props.isCaptureLoading = true;
    const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expect(screen.getByTestId(OVERLAY_TEST_ID)).toHaveStyle({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 9,
      backgroundColor: 'rgba(0,0,0,0.8)',
    });

    unmount();
  });

  it('should display a spinner on the screen if the camera is loading', () => {
    const props = createProps();
    props.handle.isLoading = true;
    const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expect(Spinner).toHaveBeenCalled();

    unmount();
  });

  it('should display a spinner on the screen if the capture is loading', () => {
    const props = createProps();
    props.isCaptureLoading = true;
    const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expect(Spinner).toHaveBeenCalled();

    unmount();
  });

  [
    {
      errors: [PhotoCaptureErrorName.MISSING_TASK_IN_INSPECTION],
      label: 'photo.hud.error.missingTasks',
    },
    {
      errors: [MonkNetworkError.MISSING_TOKEN, MonkNetworkError.INVALID_TOKEN],
      label: 'photo.hud.error.invalidToken',
    },
    { errors: [MonkNetworkError.EXPIRED_TOKEN], label: 'photo.hud.error.expiredToken' },
    {
      errors: [MonkNetworkError.INSUFFICIENT_AUTHORIZATION],
      label: 'photo.hud.error.insufficientAuth',
    },
    { errors: [null], label: 'photo.hud.error.inspectionLoading' },
  ].forEach(({ errors, label }) => {
    it(`should display the proper error label for ${errors ?? 'unknown capture'} errors`, () => {
      const props = createProps();
      const { unmount, rerender } = render(<PhotoCaptureHUDOverlay {...props} />);

      errors.forEach((err) => {
        const translationLabel = `test-${err}`;
        const tMock = mockTranslationFunction(translationLabel);
        props.captureError = new Error();
        (props.captureError as Error).name = err ?? 'unknown';
        rerender(<PhotoCaptureHUDOverlay {...props} />);

        expect(tMock).toHaveBeenCalledWith(label);
        expect(
          screen.queryByText(err ? translationLabel : `${translationLabel} ${props.inspectionId}`),
        ).not.toBeNull();
      });

      (useTranslation as jest.Mock).mockClear();
      unmount();
    });
  });

  it('should display the proper error label for camera errors', () => {
    const obj = { test: 'hello' };
    (getCameraErrorLabel as jest.Mock).mockImplementationOnce(() => obj);
    const label = 'test-label-hello';
    const tObjMock = mockTranslationFunction(label, true);
    const props = createProps();
    props.handle.error = { type: UserMediaErrorType.OTHER } as UserMediaError;
    const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expect(getCameraErrorLabel).toHaveBeenCalledWith(props.handle.error.type);
    expect(tObjMock).toHaveBeenCalledWith(obj);
    expect(screen.queryByText(label)).not.toBeNull();

    (useObjectTranslation as jest.Mock).mockClear();
    unmount();
  });

  it('should display a retry button for camera errors', () => {
    const props = createProps();
    props.handle.error = { type: UserMediaErrorType.OTHER } as UserMediaError;
    const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expectPropsOnChildMock(Button, {
      onClick: props.handle.retry,
    });

    unmount();
  });

  [
    PhotoCaptureErrorName.MISSING_TASK_IN_INSPECTION,
    MonkNetworkError.MISSING_TOKEN,
    MonkNetworkError.INVALID_TOKEN,
    MonkNetworkError.EXPIRED_TOKEN,
    MonkNetworkError.INSUFFICIENT_AUTHORIZATION,
  ].forEach((error) => {
    it(`should not display a retry button for ${error} errors`, () => {
      const props = createProps();
      props.captureError = new Error();
      (props.captureError as Error).name = error;
      const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

      expect(Button).not.toHaveBeenCalled();

      unmount();
    });
  });

  it('should display a retry button for unknown capture errors', () => {
    const props = createProps();
    props.captureError = new Error();
    (props.captureError as Error).name = 'unknown';
    const { unmount } = render(<PhotoCaptureHUDOverlay {...props} />);

    expectPropsOnChildMock(Button, {
      onClick: props.onRetry,
    });

    unmount();
  });
});
