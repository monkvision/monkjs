import { fireEvent, render } from '@testing-library/react';
import { AddInteriorDamage } from '../../../../src/components/InteriorTab/AddInteriorDamage/AddInteriorDamage';
import { InteriorDamage } from '../../../../src/types';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key })),
}));

jest.mock('@monkvision/common', () => ({
  useObjectMemo: jest.fn((value) => value),
}));

jest.mock(
  '../../../../src/components/InteriorTab/AddInteriorDamage/hooks/useInteriorDamage',
  () => ({
    useInteriorDamage: jest.fn(),
  }),
);

jest.mock('../../../../src/hooks/useInspectionReviewProvider', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

jest.mock('../../../../src/components/DoneButton', () => ({
  DoneButton: jest.fn(({ children, onConfirm, disabled }: any) => (
    <button data-testid='done-button' onClick={onConfirm} disabled={disabled}>
      {children}
    </button>
  )),
}));

const mockUseInteriorDamage = jest.requireMock(
  '../../../../src/components/InteriorTab/AddInteriorDamage/hooks/useInteriorDamage',
).useInteriorDamage as jest.Mock;

const mockUseInspectionReviewProvider = jest.requireMock(
  '../../../../src/hooks/useInspectionReviewProvider',
).useInspectionReviewProvider as jest.Mock;

describe('AddInteriorDamage', () => {
  const defaultDamage: InteriorDamage = {
    area: 'Front Seat',
    damage_type: 'Tear',
    repair_cost: 123,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseInspectionReviewProvider.mockReturnValue({
      currency: 'USD',
      isLeftSideCurrency: false,
    });

    mockUseInteriorDamage.mockReturnValue({
      currentDamage: defaultDamage,
      isDoneDisabled: false,
      handleInputChange: jest.fn(),
      handleDone: jest.fn(),
    });
  });

  it('renders inputs with current damage values and currency', () => {
    const { getByDisplayValue, getByText } = render(
      <AddInteriorDamage selectedDamage={null} onCancelDamage={jest.fn()} onSave={jest.fn()} />,
    );

    expect(getByDisplayValue(defaultDamage.area)).toBeDefined();
    expect(getByDisplayValue(defaultDamage.damage_type)).toBeDefined();
    expect(getByDisplayValue(String(defaultDamage.repair_cost))).toBeDefined();
    expect(getByText('USD')).toBeDefined();
  });

  it('calls handleInputChange when area changes', () => {
    const { getByDisplayValue } = render(
      <AddInteriorDamage selectedDamage={null} onCancelDamage={jest.fn()} onSave={jest.fn()} />,
    );

    const areaInput = getByDisplayValue(defaultDamage.area);
    fireEvent.change(areaInput, { target: { value: 'Rear Seat' } });

    const hook = mockUseInteriorDamage.mock.results[0].value;
    expect(hook.handleInputChange).toHaveBeenCalledWith({ area: 'Rear Seat' });
  });

  it('calls handleInputChange when damage type changes', () => {
    const { getByDisplayValue } = render(
      <AddInteriorDamage selectedDamage={null} onCancelDamage={jest.fn()} onSave={jest.fn()} />,
    );

    const damageInput = getByDisplayValue(defaultDamage.damage_type);
    fireEvent.change(damageInput, { target: { value: 'Scratch' } });

    const hook = mockUseInteriorDamage.mock.results[0].value;
    expect(hook.handleInputChange).toHaveBeenCalledWith({ damage_type: 'Scratch' });
  });

  it('calls handleInputChange with numeric repair cost', () => {
    const { getByDisplayValue } = render(
      <AddInteriorDamage selectedDamage={null} onCancelDamage={jest.fn()} onSave={jest.fn()} />,
    );

    const costInput = getByDisplayValue(String(defaultDamage.repair_cost));
    fireEvent.change(costInput, { target: { value: '250' } });

    const hook = mockUseInteriorDamage.mock.results[0].value;
    expect(hook.handleInputChange).toHaveBeenCalledWith({ repair_cost: 250 });
  });

  it('calls onCancelDamage when cancel button clicked', () => {
    const onCancelDamage = jest.fn();

    const { getByText } = render(
      <AddInteriorDamage
        selectedDamage={null}
        onCancelDamage={onCancelDamage}
        onSave={jest.fn()}
      />,
    );

    fireEvent.click(getByText('tabs.actionButtons.cancel'));

    expect(onCancelDamage).toHaveBeenCalled();
  });

  it('passes disabled state to DoneButton', () => {
    mockUseInteriorDamage.mockReturnValue({
      currentDamage: defaultDamage,
      isDoneDisabled: true,
      handleInputChange: jest.fn(),
      handleDone: jest.fn(),
    });

    render(
      <AddInteriorDamage selectedDamage={null} onCancelDamage={jest.fn()} onSave={jest.fn()} />,
    );

    const doneButtonCall = (
      require('../../../../src/components/DoneButton').DoneButton as jest.Mock
    ).mock.calls.pop();
    expect(doneButtonCall[0].disabled).toBe(true);
  });

  it('calls handleDone when DoneButton clicked', () => {
    const handleDone = jest.fn();
    mockUseInteriorDamage.mockReturnValue({
      currentDamage: defaultDamage,
      isDoneDisabled: false,
      handleInputChange: jest.fn(),
      handleDone,
    });

    const { getByTestId } = render(
      <AddInteriorDamage selectedDamage={null} onCancelDamage={jest.fn()} onSave={jest.fn()} />,
    );

    fireEvent.click(getByTestId('done-button'));

    expect(handleDone).toHaveBeenCalled();
  });
});
