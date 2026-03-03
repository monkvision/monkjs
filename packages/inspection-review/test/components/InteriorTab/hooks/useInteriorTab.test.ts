import { act, renderHook } from '@testing-library/react';
import { InteriorViews, InteriorDamage } from '../../../../src/types';
import { useInteriorTab } from '../../../../src/components/InteriorTab/hooks/useInteriorTab';

jest.mock('@monkvision/common', () => ({
  useMonkState: jest.fn(),
  useObjectMemo: jest.fn((value) => value),
}));

jest.mock('../../../../src/hooks/useInspectionReviewProvider', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

jest.mock('../../../../src/hooks/useTabViews', () => ({
  useTabViews: jest.fn(),
}));

const mockUseMonkState = jest.requireMock('@monkvision/common').useMonkState as jest.Mock;
const mockUseInspectionReviewProvider = jest.requireMock(
  '../../../../src/hooks/useInspectionReviewProvider',
).useInspectionReviewProvider as jest.Mock;
const mockUseTabViews = jest.requireMock('../../../../src/hooks/useTabViews')
  .useTabViews as jest.Mock;

const INSPECTION_ID = 'insp-1';
const DAMAGE_1: InteriorDamage = { area: 'Front Seat', damage_type: 'Tear', repair_cost: 100 };
const DAMAGE_2: InteriorDamage = { area: 'Rear Seat', damage_type: 'Scratch', repair_cost: 50 };

const createState = (damages: InteriorDamage[] = [DAMAGE_1, DAMAGE_2]) => ({
  inspections: [
    {
      id: INSPECTION_ID,
      additionalData: {
        other_damages: damages,
      },
    },
  ],
});

const createProvider = (): ReturnType<typeof mockUseInspectionReviewProvider> => ({
  inspection: { id: INSPECTION_ID },
  handleAddInteriorDamage: jest.fn(),
  handleDeleteInteriorDamage: jest.fn(),
});

const createTabViews = (): ReturnType<typeof mockUseTabViews> => ({
  currentView: InteriorViews.DamagesList,
  setCurrentView: jest.fn(),
});

describe('useInteriorTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMonkState.mockReturnValue({ state: createState() });
    mockUseInspectionReviewProvider.mockReturnValue(createProvider());
    mockUseTabViews.mockReturnValue(createTabViews());
  });

  it('initializes interior damages from state and default view', () => {
    const { result } = renderHook(() => useInteriorTab());

    expect(result.current.interiorDamages).toEqual([DAMAGE_1, DAMAGE_2]);
    expect(result.current.currentView).toBe(InteriorViews.DamagesList);
    expect(result.current.selectedDamage).toBeNull();
  });

  it('sets current view when setCurrentView is called', () => {
    const tabViews = createTabViews();
    mockUseTabViews.mockReturnValue(tabViews);

    const { result } = renderHook(() => useInteriorTab());

    act(() => {
      result.current.setCurrentView(InteriorViews.AddDamage);
    });

    expect(tabViews.setCurrentView).toHaveBeenCalledWith(InteriorViews.AddDamage);
  });

  it('saves new damage and resets view', () => {
    const provider = createProvider();
    const tabViews = createTabViews();
    mockUseInspectionReviewProvider.mockReturnValue(provider);
    mockUseTabViews.mockReturnValue(tabViews);

    const { result } = renderHook(() => useInteriorTab());

    const NEW_DAMAGE: InteriorDamage = { area: 'Dash', damage_type: 'Crack', repair_cost: 200 };

    act(() => {
      result.current.onSave(NEW_DAMAGE);
    });

    expect(provider.handleAddInteriorDamage).toHaveBeenCalledWith(NEW_DAMAGE, undefined);
    expect(tabViews.setCurrentView).toHaveBeenCalledWith(InteriorViews.DamagesList);
    expect(result.current.selectedDamage).toBeNull();
  });

  it('edits damage by setting selectedDamage and switching view', () => {
    const tabViews = createTabViews();
    mockUseTabViews.mockReturnValue(tabViews);

    const { result } = renderHook(() => useInteriorTab());

    act(() => {
      result.current.onEditDamage(1, DAMAGE_2);
    });

    expect(result.current.selectedDamage).toEqual({ index: 1, damage: DAMAGE_2 });
    expect(tabViews.setCurrentView).toHaveBeenCalledWith(InteriorViews.AddDamage);
  });

  it('forwards delete to provider', () => {
    const provider = createProvider();
    mockUseInspectionReviewProvider.mockReturnValue(provider);

    const { result } = renderHook(() => useInteriorTab());

    act(() => {
      result.current.onDeleteInteriorDamage(2);
    });

    expect(provider.handleDeleteInteriorDamage).toHaveBeenCalledWith(2);
  });

  it('cancels damage editing and resets view/state', () => {
    const provider = createProvider();
    const tabViews = createTabViews();
    mockUseInspectionReviewProvider.mockReturnValue(provider);
    mockUseTabViews.mockReturnValue(tabViews);

    const { result } = renderHook(() => useInteriorTab());

    act(() => {
      result.current.onEditDamage(0, DAMAGE_1);
    });

    act(() => {
      result.current.onCancelDamage();
    });

    expect(result.current.selectedDamage).toBeNull();
    expect(tabViews.setCurrentView).toHaveBeenCalledWith(InteriorViews.DamagesList);
  });
});
