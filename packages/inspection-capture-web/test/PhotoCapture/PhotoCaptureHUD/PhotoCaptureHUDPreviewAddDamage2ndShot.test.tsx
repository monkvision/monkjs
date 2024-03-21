jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDCounter', () => ({
  PhotoCaptureHUDCounter: jest.fn(() => <></>),
}));
jest.mock('../../../src/PhotoCapture/PhotoCaptureHUD/PhotoCaptureHUDCancelButton', () => ({
  PhotoCaptureHUDCancelButton: jest.fn(() => <></>),
}));

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { useTranslation } from 'react-i18next';
import {
  PhotoCaptureHUDCancelButton,
  PhotoCaptureHUDCounter,
  PhotoCaptureHUDPreviewAddDamage2ndShot,
} from '../../../src';
import { isMobileDevice } from '@monkvision/common';
import { PhotoCaptureMode } from '../../../src/PhotoCapture/hooks';

const FRAME_CONTAINER_TEST_ID = 'frame-container';

describe('PhotoCaptureHUDPreviewAddDamage2ndShot component', () => {
  it('should display a frame on the center of the screen', () => {
    const isMobileDeviceMock = isMobileDevice as jest.Mock;
    isMobileDeviceMock.mockReturnValue(true);
    const streamDimensions = { width: 5436, height: 1231 };
    const { unmount } = render(
      <PhotoCaptureHUDPreviewAddDamage2ndShot streamDimensions={streamDimensions} />,
    );

    const frameContainerEl = screen.getByTestId(FRAME_CONTAINER_TEST_ID);
    expect(frameContainerEl.style.aspectRatio).toEqual(
      `${streamDimensions.width}/${streamDimensions.height}`,
    );
    expect(frameContainerEl).toHaveStyle({
      position: 'absolute',
      width: '100%',
    });
    const frameEl = frameContainerEl.children.item(0);
    expect(frameEl).toHaveStyle({
      position: 'absolute',
      top: '25%',
      left: '32%',
      width: '36%',
      height: '50%',
      border: '2px solid #FFC000',
      borderRadius: '10px',
      boxShadow: '0px 0px 0px 100pc rgba(0, 0, 0, 0.5)',
    });

    unmount();
  });

  it('should give the frame container a 16:9 ratio by default if the stream dimensions are not defined', () => {
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage2ndShot />);

    const frameContainerEl = screen.getByTestId(FRAME_CONTAINER_TEST_ID);
    expect(frameContainerEl.style.aspectRatio).toEqual('16/9');

    unmount();
  });

  it('should display the PhotoCaptureHUDCounter in AD 2nd Shot mode', () => {
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage2ndShot />);

    expectPropsOnChildMock(PhotoCaptureHUDCounter, { mode: PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT });

    unmount();
  });

  it('should display the a cancel button component and pass it the onCancel prop', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage2ndShot onCancel={onCancel} />);

    expectPropsOnChildMock(PhotoCaptureHUDCancelButton, { onCancel });

    unmount();
  });

  it('should display a help message with the proper label', () => {
    const label = 'test';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<PhotoCaptureHUDPreviewAddDamage2ndShot />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.infoCloseup');
    expect(screen.queryByText(label)).not.toBeNull();

    unmount();
  });
});
