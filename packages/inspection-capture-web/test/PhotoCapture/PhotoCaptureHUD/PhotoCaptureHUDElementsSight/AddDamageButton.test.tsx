import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { Button } from '@monkvision/common-ui-web';
import { AddDamageButton } from '../../../../src';
import { AddDamage } from '@monkvision/types';

describe('AddDamageButton component', () => {
  it('should not render when addDamage is disabled', () => {
    const onAddDamage = jest.fn();
    const { unmount } = render(
      <AddDamageButton onAddDamage={onAddDamage} addDamage={AddDamage.DISABLED} />,
    );
    expect(Button).not.toHaveBeenCalled();

    unmount();
  });

  it('should pass the onAddDamage callback to the onClick event of the Button', () => {
    const onAddDamage = jest.fn();
    const { unmount } = render(
      <AddDamageButton onAddDamage={onAddDamage} addDamage={AddDamage.PART_SELECT} />,
    );

    expectPropsOnChildMock(Button, { onClick: onAddDamage });

    unmount();
  });

  it('should display a Button with the proper label', () => {
    const label = 'test-label-ok';
    const tMock = jest.fn(() => label);
    (useTranslation as jest.Mock).mockImplementationOnce(() => ({ t: tMock }));
    const { unmount } = render(<AddDamageButton addDamage={AddDamage.PART_SELECT} />);

    expect(tMock).toHaveBeenCalledWith('photo.hud.sight.addDamageBtn');
    expectPropsOnChildMock(Button, { children: label });

    unmount();
  });
});
