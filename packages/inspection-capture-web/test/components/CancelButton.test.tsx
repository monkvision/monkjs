import { render } from '@testing-library/react';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { CancelButton } from '../../src/components';

describe('CancelButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display a Button with the proper label', () => {
    const label = 'wow-test-label-yes';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<CancelButton />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.addDamage.cancelBtn');
    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should pass the onClick event to the Button', () => {
    const onCancel = jest.fn();
    const { unmount } = render(<CancelButton onCancel={onCancel} />);

    expectPropsOnChildMock(Button, { onClick: onCancel });

    unmount();
  });
});
