import { act, renderHook } from '@testing-library/react';
import { PartSelectionOrientation, TaskName, VehiclePart, VehicleType } from '@monkvision/types';
import {
  useExteriorTab,
  ExteriorViews,
} from '../../../../src/components/ExteriorTab/hooks/useExteriorTab';
import { DamagedPartDetails, GalleryItem } from '../../../../src/types';

const mockUseInspectionReviewProvider = jest.fn();
const mockUseTabViews = jest.fn();
const mockUseMonkTheme = jest.fn();

jest.mock('@monkvision/common/lib/theme/hooks', () => ({
  useMonkTheme: jest.fn(),
}));

jest.mock('../../../../src/hooks/useTabViews', () => ({
  useTabViews: jest.fn(),
}));

jest.mock('../../../../src/hooks/useInspectionReviewProvider', () => ({
  useInspectionReviewProvider: jest.fn(),
}));

const DEFAULT_PART = VehiclePart.BUMPER_FRONT;
const OTHER_PART = VehiclePart.ROOF;

const mockPalette = {
  text: { primary: '#111' },
};

const availablePricings = {
  low: { min: 0, max: 200, color: 'green' },
  mid: { min: 200, max: 500, color: 'yellow' },
};

const createGalleryItem = (overrides: Partial<GalleryItem>): GalleryItem => ({
  image: {
    id: 'img-1',
    path: 'path-1',
    detailedViewpoint: overrides.image?.detailedViewpoint,
  } as any,
  renderedOutput: undefined,
  hasDamage: false,
  parts: overrides.parts ?? [],
  sight: overrides.sight,
  totalPolygonArea: overrides.totalPolygonArea ?? 0,
});

const galleryWithMixedItems: GalleryItem[] = [
  createGalleryItem({
    sight: { tasks: [TaskName.WHEEL_ANALYSIS], wheelName: DEFAULT_PART } as any,
    parts: [{ type: OTHER_PART } as any],
    totalPolygonArea: 5,
  }),
  createGalleryItem({
    sight: { tasks: [], wheelName: undefined } as any,
    parts: [{ type: DEFAULT_PART } as any],
    totalPolygonArea: 10,
  }),
  createGalleryItem({
    sight: undefined,
    parts: [{ type: DEFAULT_PART } as any],
    totalPolygonArea: 1,
  }),
  createGalleryItem({
    sight: { tasks: [], wheelName: undefined } as any,
    parts: [],
    image: { detailedViewpoint: { centersOn: [DEFAULT_PART] } } as any,
    totalPolygonArea: 8,
  }),
  createGalleryItem({
    sight: { tasks: [], wheelName: undefined } as any,
    parts: [{ type: OTHER_PART } as any],
    totalPolygonArea: 2,
  }),
];

const damagedPartsDetails: DamagedPartDetails[] = [
  { part: DEFAULT_PART, isDamaged: true, damageTypes: [], pricing: undefined },
  { part: OTHER_PART, isDamaged: false, damageTypes: [], pricing: 250 },
];

const setupMocks = () => {
  (
    require('../../../../src/hooks/useInspectionReviewProvider')
      .useInspectionReviewProvider as jest.Mock
  ).mockImplementation(mockUseInspectionReviewProvider);
  mockUseInspectionReviewProvider.mockReturnValue({
    onChangeSelectedExteriorPart: jest.fn(),
    vehicleType: VehicleType.SEDAN,
    handleConfirmExteriorDamages: jest.fn(),
    damagedPartsDetails,
    availablePricings,
    currentGalleryItems: galleryWithMixedItems,
    setCurrentGalleryItems: jest.fn(),
    resetSelectedItem: jest.fn(),
  });

  (require('../../../../src/hooks/useTabViews').useTabViews as jest.Mock).mockImplementation(
    mockUseTabViews,
  );
  mockUseTabViews.mockReturnValue({
    currentView: ExteriorViews.SVGCar,
    setCurrentView: jest.fn(),
  });

  (require('@monkvision/common/lib/theme/hooks').useMonkTheme as jest.Mock).mockImplementation(
    mockUseMonkTheme,
  );
  mockUseMonkTheme.mockReturnValue({ palette: mockPalette });
};

describe('useExteriorTab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupMocks();
  });

  it('initializes with provider and tab view values', () => {
    const { result } = renderHook(() => useExteriorTab());

    expect(result.current.currentView).toBe(ExteriorViews.SVGCar);
    expect(result.current.orientation).toBe(PartSelectionOrientation.FRONT_LEFT);
    expect(result.current.vehicleType).toBe(VehicleType.SEDAN);
    expect(result.current.validatedParts).toEqual([]);
  });

  it('rotates orientation left and wraps', () => {
    const { result } = renderHook(() => useExteriorTab());

    act(() => {
      result.current.onRotateLeft();
    });

    const orientations = Object.values(PartSelectionOrientation);
    expect(orientations.includes(result.current.orientation)).toBe(true);
  });

  it('rotates orientation right and wraps', () => {
    const { result } = renderHook(() => useExteriorTab());

    act(() => {
      for (let i = 0; i < Object.values(PartSelectionOrientation).length + 1; i += 1) {
        result.current.onRotateRight();
      }
    });

    const orientations = Object.values(PartSelectionOrientation);
    expect(orientations.includes(result.current.orientation)).toBe(true);
  });

  it('switches to AddPartDamage view and selects part on click', () => {
    const { result } = renderHook(() => useExteriorTab());
    const provider = mockUseInspectionReviewProvider.mock.results[0].value;
    const tabViews = mockUseTabViews.mock.results[0].value;

    act(() => {
      result.current.onPartClicked(DEFAULT_PART);
    });

    expect(tabViews.setCurrentView).toHaveBeenCalledWith(ExteriorViews.AddPartDamage);
    expect(provider.onChangeSelectedExteriorPart).toHaveBeenCalledWith(damagedPartsDetails[0]);
  });

  it('creates default part when not existing and filters gallery items', () => {
    const { result } = renderHook(() => useExteriorTab());
    const provider = mockUseInspectionReviewProvider.mock.results[0].value;

    act(() => {
      result.current.onPartClicked(VehiclePart.TRUNK);
    });

    const selectedArg = provider.onChangeSelectedExteriorPart.mock.calls[0][0];
    expect(selectedArg).toEqual({
      part: VehiclePart.TRUNK,
      isDamaged: false,
      damageTypes: [],
      pricing: undefined,
    });

    const filteredCall = provider.setCurrentGalleryItems.mock.calls[0][0] as GalleryItem[];
    expect(filteredCall.length).toBe(0);
  });

  it('filters gallery items for part and sorts close-ups first', () => {
    const { result } = renderHook(() => useExteriorTab());
    const provider = mockUseInspectionReviewProvider.mock.results[0].value;

    act(() => {
      result.current.onPartClicked(DEFAULT_PART);
    });

    const call = provider.setCurrentGalleryItems.mock.calls[0][0] as GalleryItem[];
    expect(call[0].sight).toBeUndefined();
    expect(
      call
        .slice(1)
        .every(
          (item, idx, arr) => idx === 0 || arr[idx - 1].totalPolygonArea >= item.totalPolygonArea,
        ),
    ).toBe(true);
  });

  it('computes part attributes with pricing ranges', () => {
    const { result } = renderHook(() => useExteriorTab());

    const noData = result.current.onGetPartAttributes(VehiclePart.DOOR_FRONT_LEFT);
    expect(noData.style).toBeDefined();
    expect(noData.style?.stroke).toBe(mockPalette.text.primary);

    const needsPricing = result.current.onGetPartAttributes(DEFAULT_PART);
    expect(needsPricing.style?.fill).toBe('lightgray');

    const priced = result.current.onGetPartAttributes(OTHER_PART);
    expect(priced.style?.fill).toBe('yellow');
  });

  it('handles done flow: confirms, validates, resets view and selection', () => {
    const { result } = renderHook(() => useExteriorTab());
    const provider = mockUseInspectionReviewProvider.mock.results[0].value;
    const tabViews = mockUseTabViews.mock.results[0].value;

    act(() => {
      result.current.onPartClicked(DEFAULT_PART);
    });

    act(() => {
      result.current.onDone({ part: DEFAULT_PART, isDamaged: true, damageTypes: [], pricing: 100 });
    });

    expect(provider.handleConfirmExteriorDamages).toHaveBeenCalledWith({
      part: DEFAULT_PART,
      isDamaged: true,
      damageTypes: [],
      pricing: 100,
    });
    expect(result.current.validatedParts).toContain(DEFAULT_PART);
    expect(provider.setCurrentGalleryItems).toHaveBeenLastCalledWith(galleryWithMixedItems);
    expect(tabViews.setCurrentView).toHaveBeenCalledWith(ExteriorViews.SVGCar);
    expect(provider.onChangeSelectedExteriorPart).toHaveBeenCalledWith(null);
    expect(provider.resetSelectedItem).toHaveBeenCalled();
  });

  it('resets view and selection on cancel damage', () => {
    const { result } = renderHook(() => useExteriorTab());
    const provider = mockUseInspectionReviewProvider.mock.results[0].value;
    const tabViews = mockUseTabViews.mock.results[0].value;

    act(() => {
      result.current.onPartClicked(DEFAULT_PART);
    });

    act(() => {
      result.current.onCancelDamage();
    });

    expect(tabViews.setCurrentView).toHaveBeenCalledWith(ExteriorViews.SVGCar);
    expect(provider.onChangeSelectedExteriorPart).toHaveBeenCalledWith(null);
    expect(provider.resetSelectedItem).toHaveBeenCalled();
    expect(provider.setCurrentGalleryItems).toHaveBeenLastCalledWith(galleryWithMixedItems);
  });
});
