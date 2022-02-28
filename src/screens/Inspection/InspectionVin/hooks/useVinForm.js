import { useCallback, useMemo } from 'react';

import { updateOneInspectionVehicle } from '@monkvision/corejs';

import useRequest from 'hooks/useRequest/index';

import { INSPECTION_CREATE } from 'screens/names';
import { useNavigation } from '@react-navigation/native';

// initial "vehicle required fields" values
const payload = { market_value: { unit: 'EUR', value: 1 }, mileage: { value: 1, unit: 'km' } };

export default function useVinForm({ inspectionId, requiredFields, vin }) {
  const navigation = useNavigation();

  // Go yo inspection create
  const handleTakePictures = useCallback(
    () => navigation.navigate(INSPECTION_CREATE, { inspectionId }),
    [inspectionId, navigation],
  );

  // Update vehicle info (especially the vin)
  const { isLoading: isSubmittingVehicleInfo,
    request: submitVehicleInfo } = useRequest(null, {}, false);

  // Fill the required fields for update vehicle request which are (market_value and mileage)
  const requiredPayload = useMemo(() => {
    // we check if the current inspection has already a mileage, if not we put an initial value
    const hasMileage = requiredFields.mileage?.unit && requiredFields.mileage?.value;

    // we check if the current inspection has already a maket_value, if not we put an initial value
    const hasMarketValue = requiredFields.marketValue?.unit && requiredFields.marketValue?.value;

    return { market_value: hasMarketValue ? requiredFields.marketValue : payload.market_value,
      mileage: hasMileage ? requiredFields.mileage : payload.mileage,
    };
  }, [requiredFields.marketValue, requiredFields.mileage]);

  /**
 *  When we skip:
 * - if there is a VIN set by the OCR we should submit an empty VIN in order clear it
 *  and then we proceed to the camera (without blocking the user in error case)
 * - fi there not VIN set by the OCR then we proceed directly
 *  */
  const handleSkip = useCallback(() => {
    if (!vin) { handleTakePictures(); return; }
    submitVehicleInfo(updateOneInspectionVehicle({ inspectionId, data: { vin: '', ...requiredPayload } }),
      { onSuccess: handleTakePictures, onError: handleTakePictures });
  },
  [vin, submitVehicleInfo, inspectionId, requiredPayload, handleTakePictures]);

  return {
    handleTakePictures,
    handleSkip,
    requiredPayload,
    isSubmittingVehicleInfo,
    submitVehicleInfo,
  };
}
