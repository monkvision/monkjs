import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { PhotoCaptureHUDCancelButton } from '../../../src';

describe('PhotoCaptureHUDCancelButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a Button with the proper label', () => {
    const label = 'wow-test-label-yes';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<PhotoCaptureHUDCancelButton />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.cancelBtn');
    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should pass the onClick event to the Button', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<PhotoCaptureHUDCancelButton onCancel={onCancel} />);

    expectPropsOnChildMock(Button, { onClick: onCancel });

    unmount();
  });
});
