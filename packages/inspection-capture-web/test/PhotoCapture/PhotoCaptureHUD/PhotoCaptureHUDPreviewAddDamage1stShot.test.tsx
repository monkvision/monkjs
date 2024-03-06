jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDCounter', () => ({
  PhotoCaptureHUDCounter: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDCancelButton', () => ({
  PhotoCaptureHUDCancelButton: jest.fn(() => <></>),
}));

import { act, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import {
  PhotoCaptureHUDCancelButton,
  PhotoCaptureHUDCounter,
  PhotoCaptureHUDPreviewAddDamage1stShot,
} from '../../../src';
import { crosshairSvg } from '../../../src/assets';
import { PhotoCaptureMode } from '../../../src/PhotoCapture/hooks';

describe('PhotoCaptureHUDPreviewAddDamage1stShot component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a crosshair SVG on the screen', () => {
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage1stShot />);

    expectPropsOnChildMock(DynamicSVG, { svg: crosshairSvg });

    unmount();
  });

  it('should display the PhotoCaptureHUDCounter component on AD 1st Shot mode', () => {
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage1stShot />);

    expectPropsOnChildMock(PhotoCaptureHUDCounter, { mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT });

    unmount();
  });

  it('should display the a cancel button component and pass it the onCancel prop', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage1stShot onCancel={onCancel} />);

    expectPropsOnChildMock(PhotoCaptureHUDCancelButton, { onCancel });

    unmount();
  });

  it('should display an info popup with the proper label', () => {
    const label = 'test-label';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage1stShot />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.infoBtn');
    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should remove the info popup when the user clicks on it', () => {
    const testId = 'button-test-id';
    (Button as unknown as jest.Mock).mockImplementation(() => <div data-testid={testId}></div>);
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage1stShot />);

    expect(screen.queryByTestId(testId)).not.toBeNull();
    act(() => {
      (Button as unknown as jest.Mock).mock.calls[0][0].onClick();
    });
    expect(screen.queryByTestId(testId)).toBeNull();

    unmount();
    (Button as unknown as jest.Mock).mockClear();
  });
});
