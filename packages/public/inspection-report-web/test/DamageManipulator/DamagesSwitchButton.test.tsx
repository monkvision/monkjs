jest.mock('react-i18next');
jest.mock('@monkvision/common-ui-web');

import { render } from '@testing-library/react';
import { useTranslation } from 'react-i18next';
import { SwitchButton } from '@monkvision/common-ui-web';
import { DamagesSwitchButton } from '../../src/DamageManipulator/DamagesSwitchButton';

describe('DamagesSwitchButton component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should use t function twice from useTranslation hook', () => {
    const useTranslationMock = useTranslation as jest.Mock;
    const { unmount, rerender } = render(<DamagesSwitchButton hasDamage={true} />);

    const { t } = useTranslationMock.mock.results[0].value;
    expect(t).toHaveBeenCalledTimes(2);

    rerender(<DamagesSwitchButton hasDamage={false} />);
    expect(t).toHaveBeenCalledTimes(2);

    unmount();
  });

  it('should translate the right json key when it hasDamage is true', () => {
    const useTranslationMock = useTranslation as jest.Mock;
    const { unmount } = render(<DamagesSwitchButton hasDamage={true} />);

    const { t } = useTranslationMock.mock.results[0].value;
    expect(t).toHaveBeenCalledWith('damageManipulator.damagesSwitchBtn.damages');
    expect(t).toHaveBeenCalledWith('damageManipulator.damagesSwitchBtn.damaged');

    unmount();
  });

  it('should translate the right json key when it hasDamage is false', () => {
    const useTranslationMock = useTranslation as jest.Mock;
    const { unmount } = render(<DamagesSwitchButton hasDamage={false} />);

    const { t } = useTranslationMock.mock.results[0].value;
    expect(t).toHaveBeenCalledWith('damageManipulator.damagesSwitchBtn.damages');
    expect(t).toHaveBeenCalledWith('damageManipulator.damagesSwitchBtn.notDamaged');

    unmount();
  });

  it('should render SwitchButton', () => {
    const { unmount } = render(<DamagesSwitchButton hasDamage={false} />);

    expect(SwitchButton).toHaveBeenCalled();

    unmount();
  });
});
