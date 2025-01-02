const streamDimensions = { width: 5436, height: 1231 };

jest.mock('../../src/components/Counter', () => ({
  Counter: jest.fn(() => <></>),
}));
jest.mock('../../src/components/CancelButton', () => ({
  CancelButton: jest.fn(() => <></>),
}));
jest.mock('@monkvision/common', () => ({
  ...jest.requireActual('@monkvision/common'),
  getAspectRatio: jest.fn(() => `${streamDimensions?.width}/${streamDimensions?.height}`),
}));

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { useTranslation } from 'react-i18next';
import { CancelButton, Counter, CloseUpShot } from '../../src/components';
import { getAspectRatio } from '@monkvision/common';
import { CaptureMode } from '../../src/types';

const FRAME_CONTAINER_TEST_ID = 'frame-container';

describe('CloseUpShot component', () => {
  it('should display a frame on the center of the screen', () => {
    const { unmount } = render(<CloseUpShot streamDimensions={streamDimensions} />);

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
    (getAspectRatio as jest.Mock).mockImplementation(() => '16/9');
    const { unmount } = render(<CloseUpShot />);

    const frameContainerEl = screen.getByTestId(FRAME_CONTAINER_TEST_ID);

    expect(frameContainerEl.style.aspectRatio).toEqual('16/9');

    unmount();
  });

  it('should display the Counter in AD 2nd Shot mode', () => {
    const { unmount } = render(<CloseUpShot />);

    expectPropsOnChildMock(Counter, { mode: CaptureMode.ADD_DAMAGE_2ND_SHOT });

    unmount();
  });

  it('should display the a cancel button component and pass it the onCancel prop', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<CloseUpShot onCancel={onCancel} />);

    expectPropsOnChildMock(CancelButton, { onCancel });

    unmount();
  });

  it('should display a help message with the proper label', () => {
    const label = 'test';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<CloseUpShot />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.infoCloseup');

    unmount();
  });
});
