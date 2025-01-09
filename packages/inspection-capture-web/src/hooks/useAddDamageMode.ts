import { useCallback, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { useAnalytics } from '@monkvision/analytics';
import { AddDamage, CaptureAppConfig, VehiclePart } from '@monkvision/types';
import { CaptureMode, CaptureScreen } from '../types';

/**
 * Parameters of the useAddDamageMode hook.
 */
export interface AddDamageModeParams extends Pick<CaptureAppConfig, 'addDamage'> {
  /**
   * The current screen of the Capture component.
   */
  currentScreen?: CaptureScreen;
  /**
   * Boolean indicating if the capture is in Damage Disclosure mode.
   */
  damageDisclosure?: boolean;
  /**
   * Callback called when the user clicks on the 'close` button in Damage Diclosure mode.
   */
  handleOpenGallery: () => void;
}

/**
 * Handle used to modify the current CaptureMode of the PhotoCapture or DamageDisclosure component.
 */
export interface AddDamageHandle {
  /**
   * The current mode of the component.
   */
  mode: CaptureMode;
  /**
   * Parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Callback to be called when the user clicks on the "Add Damage" button.
   */
  handleAddDamage: () => void;
  /**
   * Callback to be called when the user selects the parts to take a picture of.
   */
  handleAddDamagePartsSelected: (parts: VehiclePart[]) => void;
  /**
   * Callback to be called everytime the user takes a picture to update the mode after it.
   */
  updatePhotoCaptureModeAfterPictureTaken: () => void;
  /**
   * Callback to be called when the user clicks on the "Cancel" button of the Add Damage mode.
   */
  handleCancelAddDamage: () => void;
  /**
   * Callback called when the user clicks on the "Validate" button of the Add Damage mode.
   */
  handleValidateVehicleParts: () => void;
}

function getInitialMode(addDamage?: AddDamage, damageDisclosure?: boolean): CaptureMode {
  if (damageDisclosure && addDamage === AddDamage.PART_SELECT) {
    return CaptureMode.ADD_DAMAGE_PART_SELECT;
  }
  if (damageDisclosure && addDamage === AddDamage.TWO_SHOT) {
    return CaptureMode.ADD_DAMAGE_1ST_SHOT;
  }
  return CaptureMode.SIGHT;
}

/**
 * Custom hook used to switch between sight picture taking and add damage picture taking.
 */
export function useAddDamageMode({
  addDamage,
  currentScreen,
  handleOpenGallery = () => {},
  damageDisclosure = false,
}: AddDamageModeParams): AddDamageHandle {
  const [mode, setMode] = useState(getInitialMode(addDamage, damageDisclosure));
  const [vehicleParts, setVehicleParts] = useState<VehiclePart[]>([]);
  const { trackEvent } = useAnalytics();

  const handleAddDamage = useCallback(() => {
    if (addDamage === AddDamage.TWO_SHOT) {
      setMode(CaptureMode.ADD_DAMAGE_1ST_SHOT);
      trackEvent('AddDamage Selected', {
        mode: CaptureMode.ADD_DAMAGE_1ST_SHOT,
      });
    }
    if (addDamage === AddDamage.PART_SELECT) {
      setMode(CaptureMode.ADD_DAMAGE_PART_SELECT);
      trackEvent('AddDamage Selected', {
        mode: CaptureMode.ADD_DAMAGE_PART_SELECT,
      });
    }
  }, []);

  const updatePhotoCaptureModeAfterPictureTaken = useCallback(() => {
    setVehicleParts([]);
    setMode(
      mode === CaptureMode.ADD_DAMAGE_1ST_SHOT
        ? CaptureMode.ADD_DAMAGE_2ND_SHOT
        : getInitialMode(addDamage, damageDisclosure),
    );
    if (damageDisclosure) {
      handleOpenGallery();
    }
  }, [mode]);

  const handleCancelAddDamage = useCallback(() => {
    trackEvent('AddDamage Canceled', {
      mode,
    });
    if (
      [CaptureMode.ADD_DAMAGE_PART_SELECT, CaptureMode.ADD_DAMAGE_1ST_SHOT].includes(mode) &&
      damageDisclosure
    ) {
      handleOpenGallery();
    }
    setVehicleParts([]);
    setMode(getInitialMode(addDamage, damageDisclosure));
  }, [mode, currentScreen]);

  const handleAddDamagePartsSelected = useCallback((parts: VehiclePart[]) => {
    setVehicleParts(parts);
  }, []);

  const handleValidateVehicleParts = useCallback(() => {
    setMode(CaptureMode.ADD_DAMAGE_PART_SELECT_SHOT);
  }, []);

  return useObjectMemo({
    mode,
    vehicleParts,
    handleAddDamage,
    updatePhotoCaptureModeAfterPictureTaken,
    handleCancelAddDamage,
    handleAddDamagePartsSelected,
    handleValidateVehicleParts,
  });
}
