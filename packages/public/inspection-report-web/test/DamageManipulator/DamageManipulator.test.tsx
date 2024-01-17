jest.mock('@monkvision/common');
jest.mock('../../src/i18n', () => ({
  i18nInspectionReportWeb: {},
}));
jest.mock('../../src/DamageManipulator/PartPictureButton', () => ({
  PartPictureButton: jest.fn(() => <></>),
}));
jest.mock('../../src/DamageManipulator/DamagesSwitchButton', () => ({
  DamagesSwitchButton: jest.fn(() => <></>),
}));
jest.mock('../../src/DamageManipulator/SeveritySelection', () => ({
  SeveritySelection: jest.fn(() => <></>),
}));
jest.mock('../../src/DamageManipulator/PricingSlider', () => ({
  PricingSlider: jest.fn(() => <></>),
}));
jest.mock('../../src/DamageManipulator/DoneButton', () => ({
  DoneButton: jest.fn(() => <></>),
}));

import { fireEvent, render, screen } from '@testing-library/react';
import { i18nWrap } from '@monkvision/common';
import { DamageManipulator } from '../../src';
import { PartPictureButton } from '../../src/DamageManipulator/PartPictureButton';
import { SeveritySelection } from '../../src/DamageManipulator/SeveritySelection';
import { i18nInspectionReportWeb } from '../../src/i18n';
import { PricingSlider } from '../../src/DamageManipulator/PricingSlider';
import { DoneButton } from '../../src/DamageManipulator/DoneButton';
import { DamagesSwitchButton } from '../../src/DamageManipulator/DamagesSwitchButton';

describe('DamageManipulator component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render 5 components: PartPictureButton wrapped with i18nWrap', () => {
    const { unmount } = render(<DamageManipulator />);

    expect(i18nWrap).toHaveBeenCalledWith(expect.any(Function), i18nInspectionReportWeb);
    expect(PartPictureButton).toHaveBeenCalled();
    expect(SeveritySelection).toHaveBeenCalled();
    expect(DamagesSwitchButton).toHaveBeenCalled();
    expect(PricingSlider).toHaveBeenCalled();
    expect(DoneButton).toHaveBeenCalled();
    unmount();
  });

  it('should test', () => {
    const { unmount } = render(<DamageManipulator />);

    fireEvent.click(screen.getByTestId('toggle-btn'));

    unmount();
  });
});
