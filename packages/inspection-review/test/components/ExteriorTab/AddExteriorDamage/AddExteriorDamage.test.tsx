import { fireEvent, render } from '@testing-library/react';
import { CurrencySymbol, DamageType, VehiclePart } from '@monkvision/types';
import { AddExteriorDamage } from '../../../../src/components/ExteriorTab/AddExteriorDamage/AddExteriorDamage';

const mockUseMonkTheme = jest.fn();
const mockUseObjectTranslation = jest.fn();
const mockUseInspectionReviewProvider = jest.fn();
const mockUseExteriorDamage = jest.fn();
const mockUseTranslation = jest.fn();

jest.mock('@monkvision/common', () => ({
  useMonkTheme: jest.fn(),
  useObjectTranslation: jest.fn(),
  vehiclePartLabels: {
    [VehiclePart.BUMPER_FRONT]: { en: 'Front Bumper' },
  },
}));

jest.mock('@monkvision/common-ui-web', () => ({
  SwitchButton: jest.fn(({ checked, onSwitch }: any) => (
    <button data-testid='switch' data-checked={checked} onClick={() => onSwitch(!checked)} />
  )),
}));

jest.mock('../../../../src/components/ExteriorTab/AddExteriorDamage/DamageChip', () => ({
  DamageChip: jest.fn(({ damage }: any) => <div data-testid='damage-chip' data-damage={damage} />),
}));

jest.mock(
  '../../../../src/components/ExteriorTab/AddExteriorDamage/hooks/useExteriorDamage',
  () => ({
    useExteriorDamage: jest.fn(),
  }),
);

jest.mock('../../../../src/components/DoneButton', () => ({
  DoneButton: jest.fn(({ children, onConfirm, disabled }: any) => (
    <button data-testid='done-button' onClick={onConfirm} disabled={disabled}>
      {children}
    </button>
  )),
}));

jest.mock('../../../../src/hooks/useInspectionReviewProvider', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(),
}));

const mockOnCancelDamage = jest.fn();
const mockOnDone = jest.fn();

const firstColumnDamages = [
  DamageType.BROKEN_GLASS,
  DamageType.DENT,
  DamageType.SCRATCH,
  DamageType.PAINT_DAMAGE,
];
const secondColumnDamages = [
  DamageType.BODY_CRACK,
  DamageType.MISSING_HUBCAP,
  DamageType.MISSING_PIECE,
  DamageType.RUSTINESS,
  DamageType.MISSHAPE,
];

function setupExteriorHook(overrides: Partial<ReturnType<typeof buildExteriorState>> = {}) {
  const state = { ...buildExteriorState(), ...overrides };
  mockUseExteriorDamage.mockReturnValue(state);
  return state;
}

function buildExteriorState() {
  return {
    hasDamage: true,
    setHasDamage: jest.fn(),
    damageTypes: [DamageType.SCRATCH],
    onDamageClicked: jest.fn(),
    pricing: 123,
    isDoneDisabled: false,
    handlePricingChange: jest.fn(),
    handleDoneClick: jest.fn(),
  };
}

beforeEach(() => {
  jest.clearAllMocks();

  (require('@monkvision/common').useMonkTheme as jest.Mock).mockImplementation(mockUseMonkTheme);
  mockUseMonkTheme.mockReturnValue({
    palette: {
      primary: { base: '#111' },
      secondary: { base: '#222' },
      text: { white: '#fff' },
      background: { light: '#eee' },
    },
  });

  (require('@monkvision/common').useObjectTranslation as jest.Mock).mockImplementation(
    mockUseObjectTranslation,
  );
  mockUseObjectTranslation.mockReturnValue({ tObj: jest.fn(() => 'Front Bumper') });

  (
    require('../../../../src/hooks/useInspectionReviewProvider')
      .useInspectionReviewProvider as jest.Mock
  ).mockImplementation(mockUseInspectionReviewProvider);
  mockUseInspectionReviewProvider.mockReturnValue({
    currency: CurrencySymbol.EUR,
    isLeftSideCurrency: true,
    selectedExteriorPart: {
      part: VehiclePart.BUMPER_FRONT,
      damageTypes: [DamageType.SCRATCH],
      pricing: 50,
    },
  });

  (
    require('../../../../src/components/ExteriorTab/AddExteriorDamage/hooks/useExteriorDamage')
      .useExteriorDamage as jest.Mock
  ).mockImplementation(mockUseExteriorDamage);

  (require('react-i18next').useTranslation as jest.Mock).mockImplementation(mockUseTranslation);
  mockUseTranslation.mockReturnValue({ t: (key: string) => key });
});

describe('AddExteriorDamage', () => {
  it('renders selected part title using translation object', () => {
    setupExteriorHook();

    const { getByText } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    expect(getByText('Front Bumper')).toBeDefined();
  });

  it('renders damage chips when hasDamage is true', () => {
    setupExteriorHook({ hasDamage: true });

    render(<AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />);

    const calls = (
      require('../../../../src/components/ExteriorTab/AddExteriorDamage/DamageChip')
        .DamageChip as jest.Mock
    ).mock.calls;
    expect(calls).toHaveLength(firstColumnDamages.length + secondColumnDamages.length);
    expect(calls[0][0].damage).toBe(firstColumnDamages[0]);
  });

  it('does not render damage chips when hasDamage is false', () => {
    setupExteriorHook({ hasDamage: false });

    const { queryByTestId } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    expect(queryByTestId('damage-chip')).toBeNull();
  });

  it('toggles hasDamage via switch button', () => {
    const hookState = setupExteriorHook({ hasDamage: false });

    const { getByTestId } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    fireEvent.click(getByTestId('switch'));

    expect(hookState.setHasDamage).toHaveBeenCalledWith(true);
  });

  it('passes pricing value to input and forwards change handler', () => {
    const hookState = setupExteriorHook({ pricing: 77 });

    const { getByDisplayValue } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    const input = getByDisplayValue('77') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '150' } });

    expect(hookState.handlePricingChange).toHaveBeenCalled();
  });

  it('calls onCancelDamage when cancel button clicked', () => {
    setupExteriorHook();

    const { getByText } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    fireEvent.click(getByText('tabs.actionButtons.cancel'));

    expect(mockOnCancelDamage).toHaveBeenCalled();
  });

  it('passes disabled state to DoneButton', () => {
    setupExteriorHook({ isDoneDisabled: true });

    render(<AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />);

    const doneButtonCall = (
      require('../../../../src/components/DoneButton').DoneButton as jest.Mock
    ).mock.calls.pop();
    expect(doneButtonCall[0].disabled).toBe(true);
  });

  it('calls handleDoneClick when DoneButton is pressed', () => {
    const hookState = setupExteriorHook({ isDoneDisabled: false });

    const { getByTestId } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    fireEvent.click(getByTestId('done-button'));

    expect(hookState.handleDoneClick).toHaveBeenCalled();
  });

  it('renders currency from provider', () => {
    setupExteriorHook();

    const { getByText } = render(
      <AddExteriorDamage onDone={mockOnDone} onCancelDamage={mockOnCancelDamage} />,
    );

    expect(getByText(CurrencySymbol.EUR)).toBeDefined();
  });
});
