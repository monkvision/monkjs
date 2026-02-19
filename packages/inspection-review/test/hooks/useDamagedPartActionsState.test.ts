import { LoadingState, MonkActionType, useMonkState } from '@monkvision/common';
import { useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { renderHook } from '@testing-library/react';
import { DamageType, Inspection, MonkEntityType, VehiclePart } from '@monkvision/types';
import useDamagedPartActionsState, {
  type UseDamageActionsStateProps,
} from '../../src/hooks/useDamagedPartActionsState';
import type { DamagedPartDetails, InteriorDamage } from '../../src';
import { getChildPartsForAggregation } from '../../src/utils/partAggregation.utils';
import * as useDamagedPartActionsStateUtils from '../../src/utils/useDamagedPartActionsState.utils';

const mockInspectionId = 'test-inspection-id';
const mockStatePart = {
  id: 'test-part',
  inspectionId: mockInspectionId,
  type: VehiclePart.HOOD,
  damages: ['test-damage-id'],
  relatedImages: [],
};
const mockStatePricing = {
  id: 'test-pricing-id',
  inspectionId: mockInspectionId,
  relatedItemId: mockStatePart.id,
};
const mockState = {
  images: [{ id: 'test' }],
  parts: [mockStatePart],
  pricings: [],
  damages: [],
};
const mockDispatch = jest.fn();
const mockInteriorDamage: InteriorDamage = {
  area: 'test-interior-damage',
  damage_type: 'scratch',
  repair_cost: 100,
};
const mockGetInspection = jest.fn();
const mockUpdateAdditionalData = jest.fn();
const mockDeleteDamage = jest.fn();
const mockDeletePricing = jest.fn().mockResolvedValue(undefined);
const mockUpdatePricing = jest.fn();
const mockCreatePricing = jest.fn().mockResolvedValue({ id: 'new-pricing-id' });
const mockCreateDamage = jest.fn();

(useMonkApi as jest.Mock).mockReturnValue({
  getInspection: mockGetInspection,
  updateAdditionalData: mockUpdateAdditionalData,
  deleteDamage: mockDeleteDamage,
  deletePricing: mockDeletePricing,
  updatePricing: mockUpdatePricing,
  createPricing: mockCreatePricing,
  createDamage: mockCreateDamage,
});
(useMonitoring as jest.Mock).mockReturnValue({
  handleError: jest.fn(),
});

jest.mock('../../src/utils/partAggregation.utils', () => ({
  getChildPartsForAggregation: jest.fn(),
}));
jest.mock('../../src/utils/useDamagedPartActionsState.utils', () => ({
  handleChildPartDamagesAndPricingDeletion: jest.fn(),
  handleDeleteDamagesAndPricing: jest.fn(),
  handleUpdatePricing: jest.fn(),
  handleCreatePricing: jest.fn(),
  handleDeleteOldAndCreateNewDamages: jest.fn(),
}));
jest.mock('@monkvision/common', () => ({
  useMonkState: jest.fn(() => ({ state: mockState, dispatch: mockDispatch })),
  LoadingState: jest.fn(),
  MonkActionType: {
    UPDATED_ONE_INSPECTION_ADDITIONAL_DATA: 'UPDATED_ONE_INSPECTION_ADDITIONAL_DATA',
  },
}));

function createProps(): UseDamageActionsStateProps {
  return {
    inspectionId: mockInspectionId,
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    inspection: {
      entityType: MonkEntityType.INSPECTION,
      id: mockInspectionId,
      additionalData: {
        other_damages: [
          {
            area: 'test-existing-interior-damage',
            damage_type: 'dent',
            repair_cost: 10,
          },
        ],
      },
    } as unknown as Inspection,
    loading: {
      start: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    } as unknown as LoadingState,
  };
}

describe('useDamagedPartActionsState hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add an interior damage if index param is not provided', () => {
    const initialProps = createProps();
    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));

    result.current.handleAddInteriorDamage(mockInteriorDamage);
    const callback = mockUpdateAdditionalData.mock.calls[0][0].callback;
    const updatedData = callback(initialProps.inspection?.additionalData);

    expect(mockUpdateAdditionalData).toHaveBeenCalledWith({
      id: initialProps.inspectionId,
      callback,
    });
    expect(updatedData).toEqual({
      other_damages: [
        ...(initialProps.inspection?.additionalData?.['other_damages'] as InteriorDamage[]),
        mockInteriorDamage,
      ],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId: initialProps.inspectionId,
        additionalData: updatedData,
      },
    });
  });

  it('should edit an interior damage if index param is provided', () => {
    const initialProps = createProps();
    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));

    result.current.handleAddInteriorDamage(mockInteriorDamage, 0);
    const callback = mockUpdateAdditionalData.mock.calls[0][0].callback;
    const updatedData = callback(initialProps.inspection?.additionalData);

    expect(mockUpdateAdditionalData).toHaveBeenCalledWith({
      id: initialProps.inspectionId,
      callback,
    });
    expect(updatedData).toEqual({
      other_damages: [mockInteriorDamage],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId: initialProps.inspectionId,
        additionalData: updatedData,
      },
    });
  });

  it('should add an interior damage if a bad index param is provided', () => {
    const initialProps = createProps();
    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));

    result.current.handleAddInteriorDamage(mockInteriorDamage, 1);
    const callback = mockUpdateAdditionalData.mock.calls[0][0].callback;
    const updatedData = callback(initialProps.inspection?.additionalData);

    expect(mockUpdateAdditionalData).toHaveBeenCalledWith({
      id: initialProps.inspectionId,
      callback,
    });
    expect(updatedData).toEqual({
      other_damages: [
        ...(initialProps.inspection?.additionalData?.['other_damages'] as InteriorDamage[]),
        mockInteriorDamage,
      ],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId: initialProps.inspectionId,
        additionalData: updatedData,
      },
    });
  });

  it('should delete an interior damage', () => {
    const initialProps = createProps();
    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));

    result.current.handleDeleteInteriorDamage(0);
    const callback = mockUpdateAdditionalData.mock.calls[0][0].callback;
    const updatedData = callback(initialProps.inspection?.additionalData);

    expect(mockUpdateAdditionalData).toHaveBeenCalledWith({
      id: initialProps.inspectionId,
      callback,
    });
    expect(updatedData).toEqual({
      other_damages: [],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId: initialProps.inspectionId,
        additionalData: updatedData,
      },
    });
  });

  it('should not delete any interior damage if a bad index is provided', () => {
    const initialProps = createProps();
    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));

    result.current.handleDeleteInteriorDamage(1);
    const callback = mockUpdateAdditionalData.mock.calls[0][0].callback;
    const updatedData = callback(initialProps.inspection?.additionalData);
    expect(mockUpdateAdditionalData).toHaveBeenCalledWith({
      id: initialProps.inspectionId,
      callback,
    });
    expect(updatedData).toEqual({
      other_damages: initialProps.inspection?.additionalData?.['other_damages'],
    });
    expect(mockDispatch).toHaveBeenCalledWith({
      type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
      payload: {
        inspectionId: initialProps.inspectionId,
        additionalData: updatedData,
      },
    });
  });

  it('should add new exterior damage', () => {
    const initialProps = createProps();
    const mockChildParts: VehiclePart[] = [];
    const mockDamagedPart: DamagedPartDetails = {
      part: VehiclePart.HOOD,
      isDamaged: true,
      pricing: 200,
      damageTypes: [DamageType.SCRATCH, DamageType.DENT],
    };

    (getChildPartsForAggregation as jest.Mock).mockReturnValue(mockChildParts);

    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));
    result.current.handleConfirmExteriorDamages(mockDamagedPart);

    const mockUseMonkApiResult = (useMonkApi as jest.Mock).mock.results[0].value;

    expect(getChildPartsForAggregation).toHaveBeenCalledWith(mockDamagedPart.part);
    expect(
      useDamagedPartActionsStateUtils.handleChildPartDamagesAndPricingDeletion,
    ).toHaveBeenCalledWith(
      mockUseMonkApiResult,
      mockState,
      initialProps.inspectionId,
      mockChildParts,
    );
    expect(useDamagedPartActionsStateUtils.handleDeleteDamagesAndPricing).not.toHaveBeenCalled();
    expect(useDamagedPartActionsStateUtils.handleCreatePricing).toHaveBeenCalledWith(
      mockUseMonkApiResult,
      initialProps.inspectionId,
      mockDamagedPart,
      mockStatePart,
    );
    expect(useDamagedPartActionsStateUtils.handleDeleteOldAndCreateNewDamages).toHaveBeenCalledWith(
      mockUseMonkApiResult,
      mockState,
      initialProps.inspectionId,
      mockDamagedPart,
      mockStatePart,
    );
  });

  it('should delete exterior damages when isDamaged is false', () => {
    const initialProps = createProps();
    const mockDamagedPart: DamagedPartDetails = {
      part: VehiclePart.HOOD,
      isDamaged: false,
      damageTypes: [],
    };

    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));
    result.current.handleConfirmExteriorDamages(mockDamagedPart);

    const mockUseMonkApiResult = (useMonkApi as jest.Mock).mock.results[0].value;

    expect(useDamagedPartActionsStateUtils.handleDeleteDamagesAndPricing).toHaveBeenCalledWith(
      mockUseMonkApiResult,
      initialProps.inspectionId,
      mockStatePart,
      undefined,
    );
    expect(useDamagedPartActionsStateUtils.handleCreatePricing).not.toHaveBeenCalled();
    expect(useDamagedPartActionsStateUtils.handleUpdatePricing).not.toHaveBeenCalled();
    expect(
      useDamagedPartActionsStateUtils.handleDeleteOldAndCreateNewDamages,
    ).not.toHaveBeenCalled();
  });

  it('should update pricing when pricing exists', () => {
    const initialProps = createProps();
    const mockDamagedPart: DamagedPartDetails = {
      part: VehiclePart.HOOD,
      isDamaged: true,
      pricing: 300,
      damageTypes: [DamageType.SCRATCH],
    };

    const stateWithPricing = {
      ...mockState,
      pricings: [mockStatePricing],
    };
    (useMonkState as jest.Mock).mockReturnValueOnce({
      state: stateWithPricing,
      dispatch: mockDispatch,
    });

    const { result } = renderHook(() => useDamagedPartActionsState(initialProps));
    result.current.handleConfirmExteriorDamages(mockDamagedPart);

    const mockUseMonkApiResult = (useMonkApi as jest.Mock).mock.results[0].value;

    expect(useDamagedPartActionsStateUtils.handleUpdatePricing).toHaveBeenCalledWith(
      mockUseMonkApiResult,
      initialProps.inspectionId,
      mockDispatch,
      mockDamagedPart.pricing,
      mockStatePricing,
    );
    expect(useDamagedPartActionsStateUtils.handleCreatePricing).not.toHaveBeenCalled();
  });
});
