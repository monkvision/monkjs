jest.mock('../../src/components/Counter', () => ({
  Counter: jest.fn(() => <></>),
}));
jest.mock('../../src/components/CancelButton', () => ({
  CancelButton: jest.fn(() => <></>),
}));

import { act, render, screen } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button, DynamicSVG } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { CancelButton, Counter, ZoomOutShot } from '../../src/components';
import { crosshairSvg } from '../../src/assets';
import { CaptureMode } from '../../src/types';

describe('ZoomOutShot component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a crosshair SVG on the screen', () => {
    const { unmount } = render(<ZoomOutShot />);

    expectPropsOnChildMock(DynamicSVG, { svg: crosshairSvg });

    unmount();
  });

  it('should display the Counter component on AD 1st Shot mode', () => {
    const { unmount } = render(<ZoomOutShot />);

    expectPropsOnChildMock(Counter, { mode: CaptureMode.ADD_DAMAGE_1ST_SHOT });

    unmount();
  });

  it('should display the a cancel button component and pass it the onCancel prop', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<ZoomOutShot onCancel={onCancel} />);

    expectPropsOnChildMock(CancelButton, { onCancel });

    unmount();
  });

  it('should display an info popup with the proper label', () => {
    const label = 'test-label';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<ZoomOutShot />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.infoBtn');
    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should remove the info popup when the user clicks on it', () => {
    const testId = 'button-test-id';
    (Button as unknown as jest.Mock).mockImplementation(() => <div data-testid={testId}></div>);
    const { unmount } = render(<ZoomOutShot />);

    expect(screen.queryByTestId(testId)).not.toBeNull();
    act(() => {
      (Button as unknown as jest.Mock).mock.calls[0][0].onClick();
    });
    expect(screen.queryByTestId(testId)).toBeNull();

    unmount();
    (Button as unknown as jest.Mock).mockClear();
  });
});
