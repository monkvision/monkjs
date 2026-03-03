import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { InteriorDamage, InteriorViews } from '../../../src/types';

jest.mock('react-i18next', () => ({
  useTranslation: jest.fn(() => ({ t: (key: string) => key })),
}));

jest.mock('@monkvision/common-ui-web', () => ({
  Button: jest.fn(({ children, onClick }) => <button onClick={onClick}>{children}</button>),
  Icon: jest.fn(({ icon, onClick }) => <button onClick={onClick}>{icon}</button>),
}));

jest.mock('../../../src/hooks/useInspectionReviewProvider', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

jest.mock('../../../src/components/InteriorTab/hooks/useInteriorTab', () => ({
  useInteriorTab: jest.fn(),
}));

const mockAddInteriorDamage = jest.fn((props: any) => (
  <div data-testid='add-interior-damage'>{JSON.stringify(props)}</div>
));

jest.mock('../../../src/components/InteriorTab/AddInteriorDamage/AddInteriorDamage', () => ({
  AddInteriorDamage: (props: any) => mockAddInteriorDamage(props),
}));

const { useInspectionReviewProvider } = jest.requireMock(
  '../../../src/hooks/useInspectionReviewProvider',
) as { useInspectionReviewProvider: jest.Mock };

const { useInteriorTab } = jest.requireMock(
  '../../../src/components/InteriorTab/hooks/useInteriorTab',
) as { useInteriorTab: jest.Mock };

const { InteriorTab } = require('../../../src/components/InteriorTab/InteriorTab');

const createDamage = (overrides: Partial<InteriorDamage> = {}): InteriorDamage => ({
  area: 'Front Seat',
  damage_type: 'Tear',
  repair_cost: 100,
  ...overrides,
});

const baseHookState: ReturnType<typeof useInteriorTab> = {
  interiorDamages: [createDamage({ area: 'Front', damage_type: 'Scratch', repair_cost: 50 })],
  currentView: InteriorViews.DamagesList,
  selectedDamage: null,
  setCurrentView: jest.fn(),
  onSave: jest.fn(),
  onEditDamage: jest.fn(),
  onDeleteInteriorDamage: jest.fn(),
  onCancelDamage: jest.fn(),
};

describe('InteriorTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useInspectionReviewProvider.mockReturnValue({ currency: 'USD', isLeftSideCurrency: false });
    useInteriorTab.mockReturnValue(baseHookState);
  });

  it('renders add damage view when current view is AddDamage', () => {
    const hookState = { ...baseHookState, currentView: InteriorViews.AddDamage, selectedDamage: 1 };
    useInteriorTab.mockReturnValue(hookState);

    render(<InteriorTab />);

    const addDamage = screen.getByTestId('add-interior-damage');
    expect(addDamage).toBeInTheDocument();
    expect(mockAddInteriorDamage).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedDamage: 1,
        onCancelDamage: hookState.onCancelDamage,
        onSave: hookState.onSave,
      }),
    );
  });

  it('renders damages list and wires actions', () => {
    render(<InteriorTab />);

    expect(screen.getByText('tabs.interior.area')).toBeInTheDocument();
    expect(screen.getByText('Front')).toBeInTheDocument();
    expect(screen.getByText('Scratch')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();

    fireEvent.click(screen.getByText('edit'));
    fireEvent.click(screen.getByText('delete'));
    fireEvent.click(screen.getByText('tabs.interior.addDamageButton'));

    expect(baseHookState.onEditDamage).toHaveBeenCalledWith(0, baseHookState.interiorDamages[0]);
    expect(baseHookState.onDeleteInteriorDamage).toHaveBeenCalledWith(0);
    expect(baseHookState.setCurrentView).toHaveBeenCalledWith(InteriorViews.AddDamage);
  });
});
