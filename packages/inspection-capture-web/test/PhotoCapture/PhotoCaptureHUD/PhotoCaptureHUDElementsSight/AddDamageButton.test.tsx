import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { AddDamageButton } from '../../../../src';

describe('AddDamageButton component', () => {
  it('should pass the onAddDamage callback to the onClick event of the Button', () => {
    const onAddDamage = jest.fn();
    const { unmount } = render(<AddDamageButton onAddDamage={onAddDamage} />);

    expectPropsOnChildMock(Button, { onClick: onAddDamage });

    unmount();
  });

  it('should display a Button with the proper label', () => {
    const label = 'test-label-ok';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<AddDamageButton />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.sight.addDamageBtn');
    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });

  it('should be disabled and not visible when enableAddDamage is false', () => {
    const onAddDamage = jest.fn();
    const { unmount } = render(
      <AddDamageButton onAddDamage={onAddDamage} enableAddDamage={false} />,
    );

    expectPropsOnChildMock(Button, { style: { visibility: 'hidden' }, disabled: true });

    unmount();
  });
});
