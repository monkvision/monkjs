const { HUDMode } = jest.requireActual('../../../src/PhotoCaptureHUD/hook');

jest.mock('@monkvision/common-ui-web');
jest.mock('react-i18next');
jest.mock('../../../src/PhotoCaptureHUD/hook', () => ({
  i18nAddDamage: {},
  HUDMode,
}));

import { render } from '@testing-library/react';
import { Button } from '@monkvision/common-ui-web';
import { useTranslation } from 'react-i18next';
import { expectPropsOnChildMock } from '@monkvision/test-utils';
import { AddDamageButton } from '../../../src/PhotoCaptureHUD/PhotoCaptureHUDSightPreview/AddDamageButton';

describe('AddDamage component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get passed onAddDamage callback', () => {
    const buttonMock = Button as unknown as jest.Mock;
    const onAddDamage = jest.fn();

    const { unmount } = render(<AddDamageButton onAddDamage={onAddDamage} />);
    expect(buttonMock).toHaveBeenCalled();
    expectPropsOnChildMock(buttonMock, { onClick: expect.any(Function) });
    const onClickProp = buttonMock.mock.calls[0][0].onClick;
    onClickProp();
    expect(onAddDamage).toBeCalledWith(HUDMode.ADD_DAMAGE);

    unmount();
  });

  it('should call t function to translate the button text', () => {
    const onAddDamage = jest.fn();

    const { unmount } = render(<AddDamageButton onAddDamage={onAddDamage} />);

    const { t } = (useTranslation as jest.Mock).mock.results[0].value;
    expect(t).toHaveBeenCalled();

    unmount();
  });
});
