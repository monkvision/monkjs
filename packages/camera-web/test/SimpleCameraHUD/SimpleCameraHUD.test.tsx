const TAKE_PICTURE_MOCK_BTN_TEST_ID = 'take-picture-mock-btn';
const ERROR_MESSAGE_TEST_ID = 'error-message';
const BUTTON_MOCK_TEST_ID = 'button-mock';

const tMock = jest.fn((key) => key);
jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: tMock })),
}));

const i18nWrapMock = jest.fn((component) => component);
jest.mock('@monkvision/common', () => ({
  i18nWrap: i18nWrapMock,
}));

const ButtonMock = jest.fn(() => <div data-testid={BUTTON_MOCK_TEST_ID} />);
const TakePictureButtonMock = jest.fn(() => <div data-testid={TAKE_PICTURE_MOCK_BTN_TEST_ID} />);
jest.mock('@monkvision/common-ui-web', () => ({
  Button: ButtonMock,
  TakePictureButton: TakePictureButtonMock,
}));

const i18nCameraMock = {};
jest.mock('../../src/i18n', () => ({
  i18nCamera: i18nCameraMock,
}));

import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { render, screen } from '@testing-library/react';
import { SimpleCameraHUD, UserMediaErrorType } from '../../src';

describe('SimpleCameraHUD component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should wrap the component with the i18nWrap method', () => {
    const { unmount } = render(<SimpleCameraHUD />);

    expect(i18nWrapMock).toHaveBeenCalledWith(expect.anything(), i18nCameraMock);
    unmount();
  });

  it('should disable the take picture button if the camera is loading', () => {
    const { unmount, rerender } = render(<SimpleCameraHUD />);
    expectPropsOnChildMock(TakePictureButtonMock, { disabled: false });

    rerender(<SimpleCameraHUD handle={{ isLoading: true }} />);
    expectPropsOnChildMock(TakePictureButtonMock, { disabled: true });
    unmount();
  });

  it('should disable the take picture button if the camera is in error', () => {
    const { unmount, rerender } = render(<SimpleCameraHUD />);
    expectPropsOnChildMock(TakePictureButtonMock, { disabled: false });

    rerender(
      <SimpleCameraHUD
        handle={{ error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null } }}
      />,
    );
    expectPropsOnChildMock(TakePictureButtonMock, { disabled: true });
    unmount();
  });

  it('should display a take picture button', () => {
    const { unmount } = render(<SimpleCameraHUD />);

    expect(TakePictureButtonMock).toHaveBeenCalled();
    expect(screen.queryByTestId(TAKE_PICTURE_MOCK_BTN_TEST_ID)).toBeDefined();
    unmount();
  });

  it('should pass the take picture callback from the handle to the TakePictureButton', () => {
    const handle = { takePicture: jest.fn() };
    const { unmount } = render(<SimpleCameraHUD handle={handle} />);

    expectPropsOnChildMock(TakePictureButtonMock, { onClick: handle.takePicture });
    unmount();
  });

  it('should not pass any onClick event to the TakePictureButton by default', () => {
    const { unmount } = render(<SimpleCameraHUD />);

    expectPropsOnChildMock(TakePictureButtonMock, { onClick: undefined });
    unmount();
  });

  it('should set the size of the TakePictureButton to 60', () => {
    const { unmount } = render(<SimpleCameraHUD />);

    expectPropsOnChildMock(TakePictureButtonMock, { size: 60 });
    unmount();
  });

  it('should display the proper error message when the camera is in error', () => {
    const expectedTranslations: { [key in UserMediaErrorType]: string } = {
      [UserMediaErrorType.NOT_ALLOWED]: 'errors.permission',
      [UserMediaErrorType.STREAM_INACTIVE]: 'errors.inactive',
      [UserMediaErrorType.INVALID_STREAM]: 'errors.invalid',
      [UserMediaErrorType.OTHER]: 'errors.other',
    };
    Object.values(UserMediaErrorType).forEach((type) => {
      jest.clearAllMocks();
      const { unmount } = render(
        <SimpleCameraHUD handle={{ error: { type, nativeError: null } }} />,
      );

      const errorMsg = screen.getByTestId(ERROR_MESSAGE_TEST_ID);
      expect(errorMsg.textContent).toEqual(expectedTranslations[type]);
      expect(tMock).toHaveBeenCalledWith(expectedTranslations[type]);
      unmount();
    });
  });

  it('should display a retry button that calls the retry function of the handle', () => {
    const handle = {
      error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null },
      retry: () => {},
    };
    const { unmount } = render(<SimpleCameraHUD handle={handle} />);

    expectPropsOnChildMock(ButtonMock, { onClick: handle.retry });
    unmount();
  });

  it('should display the proper label for the retry button', () => {
    const handle = {
      error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null },
      retry: () => {},
    };
    const { unmount } = render(<SimpleCameraHUD handle={handle} />);

    expectPropsOnChildMock(ButtonMock, { children: 'retry' });
    expect(tMock).toHaveBeenCalledWith('retry');
    unmount();
  });

  it('should not display the retry button if the retry function is not defined', () => {
    const handle = {
      error: { type: UserMediaErrorType.INVALID_STREAM, nativeError: null },
    };
    const { unmount } = render(<SimpleCameraHUD handle={handle} />);

    const buttonEl = screen.queryByTestId(BUTTON_MOCK_TEST_ID);
    expect(buttonEl).toBeNull();
    unmount();
  });
});
