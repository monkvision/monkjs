jest.mock('../src/i18n', () => ({
  i18nCamera: {},
}));
jest.mock('../src/utils', () => ({
  getCameraErrorLabel: jest.fn(() => ({
    en: 'en',
    fr: 'fr',
    de: 'de',
  })),
}));

import { i18nWrap, useI18nSync, useObjectTranslation } from '@monkvision/common';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { Button, TakePictureButton } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import {
  CameraHandle,
  getCameraErrorLabel,
  i18nCamera,
  SimpleCameraHUD,
  UserMediaErrorType,
} from '../src';

const ERROR_MESSAGE_TEST_ID = 'error-message';

describe('SimpleCameraHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should wrap the component with the i18nWrap method', () => {
    const { unmount } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} />,
    );

    expect(i18nWrap).toHaveBeenCalledWith(expect.any(Function), i18nCamera);
    unmount();
  });

  it('should display the camera preview on the screen', () => {
    const cameraPreviewTestId = 'camera-preview-test-id';
    const { unmount } = render(
      <SimpleCameraHUD
        cameraPreview={<div data-testid={cameraPreviewTestId}></div>}
        handle={{} as CameraHandle}
      />,
    );

    expect(screen.queryByTestId(cameraPreviewTestId)).not.toBeNull();
    unmount();
  });

  it('should disable the take picture button if the camera is loading', () => {
    const { unmount, rerender } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} />,
    );
    expectPropsOnChildMock(TakePictureButton, { disabled: false });

    rerender(
      <SimpleCameraHUD
        cameraPreview={<></>}
        handle={{ isLoading: true } as unknown as CameraHandle}
      />,
    );
    expectPropsOnChildMock(TakePictureButton, { disabled: true });
    unmount();
  });

  it('should disable the take picture button if the camera is in error', () => {
    const { unmount, rerender } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} />,
    );
    expectPropsOnChildMock(TakePictureButton, { disabled: false });

    rerender(
      <SimpleCameraHUD
        cameraPreview={<></>}
        handle={
          {
            error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null },
          } as unknown as CameraHandle
        }
      />,
    );
    expectPropsOnChildMock(TakePictureButton, { disabled: true });
    unmount();
  });

  it('should display a take picture button', () => {
    const { unmount } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} />,
    );

    expect(TakePictureButton).toHaveBeenCalled();
    unmount();
  });

  it('should pass the take picture callback from the handle to the TakePictureButton', () => {
    const handle = { takePicture: jest.fn() } as unknown as CameraHandle;
    const { unmount } = render(<SimpleCameraHUD cameraPreview={<></>} handle={handle} />);

    expectPropsOnChildMock(TakePictureButton, { onClick: handle.takePicture });
    unmount();
  });

  it('should not pass any onClick event to the TakePictureButton by default', () => {
    const { unmount } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} />,
    );

    expectPropsOnChildMock(TakePictureButton, { onClick: undefined });
    unmount();
  });

  it('should set the size of the TakePictureButton to 60', () => {
    const { unmount } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} />,
    );

    expectPropsOnChildMock(TakePictureButton, { size: 60 });
    unmount();
  });

  it('should display the proper error message when the camera is in error', () => {
    Object.values(UserMediaErrorType).forEach((type) => {
      jest.clearAllMocks();
      const { unmount } = render(
        <SimpleCameraHUD
          cameraPreview={<></>}
          handle={{ error: { type, nativeError: null } } as unknown as CameraHandle}
        />,
      );

      const tObjMock = (useObjectTranslation as jest.Mock).mock.results[0].value.tObj;
      const errorMsg = screen.getByTestId(ERROR_MESSAGE_TEST_ID);
      expect(errorMsg.textContent).toEqual(tObjMock());
      expect(getCameraErrorLabel).toHaveBeenCalledWith(type);
      expect(tObjMock).toHaveBeenCalledWith(getCameraErrorLabel(type));
      unmount();
    });
  });

  it('should display a retry button that calls the retry function of the handle', () => {
    const handle = {
      error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null },
      retry: () => {},
    } as unknown as CameraHandle;
    const { unmount } = render(<SimpleCameraHUD cameraPreview={<></>} handle={handle} />);

    expectPropsOnChildMock(Button, { onClick: handle.retry });
    unmount();
  });

  it('should display the proper label for the retry button', () => {
    const handle = {
      error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null },
      retry: () => {},
    } as unknown as CameraHandle;
    const { unmount } = render(<SimpleCameraHUD cameraPreview={<></>} handle={handle} />);

    const tMock = (useTranslation as jest.Mock).mock.results[0].value.t;
    expectPropsOnChildMock(Button, { children: 'retry' });
    expect(tMock).toHaveBeenCalledWith('retry');
    unmount();
  });

  it('should call the useLangProp hook with the lang prop', () => {
    const lang = 'fr';
    const { unmount } = render(
      <SimpleCameraHUD cameraPreview={<></>} handle={{} as CameraHandle} lang={lang} />,
    );

    expect(useI18nSync).toHaveBeenCalledWith(lang);

    unmount();
  });
});
