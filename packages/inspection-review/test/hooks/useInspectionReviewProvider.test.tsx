import { renderHook } from '@testing-library/react';
import React from 'react';
import { CurrencySymbol, Inspection, VehicleType } from '@monkvision/types';
import {
  InspectionReviewStateContext,
  useInspectionReviewProvider,
} from '../../src/hooks/useInspectionReviewProvider';
import {
  InspectionReviewProps,
  TabKeys,
  type DamagedPartDetails,
  type GalleryItem,
  type InspectionReviewProviderState,
} from '../../src/types';

const mockSetCurrentGalleryItems = jest.fn();
const mockOnSelectItemById = jest.fn();
const mockResetSelectedItem = jest.fn();
const mockOnTabChange = jest.fn();
const mockOnChangeSelectedExteriorPart = jest.fn();
const mockHandleAddInteriorDamage = jest.fn();
const mockHandleDeleteInteriorDamage = jest.fn();
const mockHandleConfirmExteriorDamages = jest.fn();

const createMockProviderState = (
  overrides?: Partial<InspectionReviewProviderState>,
): InspectionReviewProviderState =>
  ({
    inspection: undefined,
    allGalleryItems: [],
    currentGalleryItems: [],
    availablePricings: {},
    damagedPartsDetails: [],
    isLeftSideCurrency: true,
    selectedItem: null,
    activeTab: TabKeys.Exterior,
    allTabs: {},
    ActiveTabComponent: null,
    selectedExteriorPart: null,
    vehicleType: undefined,
    currency: undefined,
    sightsPerTab: {
      [TabKeys.Exterior]: [],
      [TabKeys.Interior]: [],
    },
    additionalInfo: undefined,
    setCurrentGalleryItems: mockSetCurrentGalleryItems,
    onSelectItemById: mockOnSelectItemById,
    resetSelectedItem: mockResetSelectedItem,
    onTabChange: mockOnTabChange,
    onChangeSelectedExteriorPart: mockOnChangeSelectedExteriorPart,
    handleAddInteriorDamage: mockHandleAddInteriorDamage,
    handleDeleteInteriorDamage: mockHandleDeleteInteriorDamage,
    handleConfirmExteriorDamages: mockHandleConfirmExteriorDamages,
    ...overrides,
  } as InspectionReviewProviderState);

describe('useInspectionReviewProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('context usage', () => {
    it('should return provider state when used inside context', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current).toBe(mockState);
    });

    it('should throw error when used outside context', () => {
      expect(() => {
        renderHook(() => useInspectionReviewProvider());
      }).toThrow('useInspectionReviewProvider must be used inside InspectionReviewStateProvider');
    });

    it('should throw error when context value is null', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={null}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      expect(() => {
        renderHook(() => useInspectionReviewProvider(), { wrapper });
      }).toThrow('useInspectionReviewProvider must be used inside InspectionReviewStateProvider');
    });
  });

  describe('state access', () => {
    it('should provide access to inspection data', () => {
      const mockInspection = { id: 'inspection-id' };
      const mockState = createMockProviderState({
        inspection: mockInspection as unknown as Inspection,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.inspection).toBe(mockInspection);
    });

    it('should provide access to gallery items', () => {
      const mockGalleryItems = [{ id: 'item-1' }, { id: 'item-2' }] as unknown as GalleryItem[];
      const mockState = createMockProviderState({
        allGalleryItems: mockGalleryItems,
        currentGalleryItems: mockGalleryItems,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.allGalleryItems).toBe(mockGalleryItems);
      expect(result.current.currentGalleryItems).toBe(mockGalleryItems);
    });

    it('should provide access to damaged parts details', () => {
      const mockDamagedParts = [
        { part: 'hood', isDamaged: true },
      ] as unknown as DamagedPartDetails[];
      const mockState = createMockProviderState({
        damagedPartsDetails: mockDamagedParts,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.damagedPartsDetails).toBe(mockDamagedParts);
    });

    it('should provide access to selected item', () => {
      const mockSelectedItem = { id: 'selected-item' } as unknown as GalleryItem;
      const mockState = createMockProviderState({
        selectedItem: mockSelectedItem,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.selectedItem).toBe(mockSelectedItem);
    });

    it('should provide access to active tab', () => {
      const mockState = createMockProviderState({
        activeTab: TabKeys.Interior,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.activeTab).toBe(TabKeys.Interior);
    });

    it('should provide access to selected exterior part', () => {
      const mockSelectedPart = { part: 'hood', isDamaged: true } as unknown as DamagedPartDetails;
      const mockState = createMockProviderState({
        selectedExteriorPart: mockSelectedPart,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.selectedExteriorPart).toBe(mockSelectedPart);
    });
  });

  describe('function access', () => {
    it('should provide access to setCurrentGalleryItems function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.setCurrentGalleryItems).toBe(mockSetCurrentGalleryItems);
    });

    it('should provide access to onSelectItemById function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.onSelectItemById).toBe(mockOnSelectItemById);
    });

    it('should provide access to resetSelectedItem function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.resetSelectedItem).toBe(mockResetSelectedItem);
    });

    it('should provide access to onTabChange function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.onTabChange).toBe(mockOnTabChange);
    });

    it('should provide access to onChangeSelectedExteriorPart function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.onChangeSelectedExteriorPart).toBe(mockOnChangeSelectedExteriorPart);
    });

    it('should provide access to handleAddInteriorDamage function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.handleAddInteriorDamage).toBe(mockHandleAddInteriorDamage);
    });

    it('should provide access to handleDeleteInteriorDamage function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.handleDeleteInteriorDamage).toBe(mockHandleDeleteInteriorDamage);
    });

    it('should provide access to handleConfirmExteriorDamages function', () => {
      const mockState = createMockProviderState();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.handleConfirmExteriorDamages).toBe(mockHandleConfirmExteriorDamages);
    });
  });

  describe('configuration access', () => {
    it('should provide access to vehicleType', () => {
      const mockVehicleType = VehicleType.SEDAN;
      const mockState = createMockProviderState({
        vehicleType: mockVehicleType,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.vehicleType).toBe(mockVehicleType);
    });

    it('should provide access to currency', () => {
      const mockCurrency = CurrencySymbol.USD;
      const mockState = createMockProviderState({
        currency: mockCurrency,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.currency).toBe(mockCurrency);
    });

    it('should provide access to sightsPerTab', () => {
      const mockSightsPerTab: InspectionReviewProps['sightsPerTab'] = {
        [TabKeys.Exterior]: ['sight-1', 'sight-2'],
        [TabKeys.Interior]: ['sight-3'],
      };
      const mockState = createMockProviderState({
        sightsPerTab: mockSightsPerTab,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.sightsPerTab).toBe(mockSightsPerTab);
    });

    it('should provide access to isLeftSideCurrency', () => {
      const mockState = createMockProviderState({
        isLeftSideCurrency: false,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.isLeftSideCurrency).toBe(false);
    });

    it('should provide access to availablePricings', () => {
      const mockPricings: InspectionReviewProviderState['availablePricings'] = {
        customPricing1: { min: 100, max: 500, color: 'red' },
        customPricing2: { min: 500, max: 1000, color: 'blue' },
      };
      const mockState = createMockProviderState({
        availablePricings: mockPricings,
      });
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <InspectionReviewStateContext.Provider value={mockState}>
          {children}
        </InspectionReviewStateContext.Provider>
      );

      const { result } = renderHook(() => useInspectionReviewProvider(), { wrapper });

      expect(result.current.availablePricings).toBe(mockPricings);
    });
  });
});
