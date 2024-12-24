import { useCallback, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { useAnalytics } from '@monkvision/analytics';
import { AddDamage, CaptureAppConfig, VehiclePart } from '@monkvision/types';

/**
 * Enum of the different picture taking modes that the PhotoCapture component can be in.
 */
export enum PhotoCaptureMode {
  /**
   * SIGHT mode : user is asked to take a picture of its vehicle following a given Sight.
   */
  SIGHT = 'sight',
  /**
   * ADD_DAMAGE_1ST_SHOT mode : user is asked to take a picture centered on a damage, far away from the vehicle.
   */
  ADD_DAMAGE_1ST_SHOT = 'add_damage_1st_shot',
  /**
   * ADD_DAMAGE_2ND_SHOT mode : user is asked to take a zoomed picture of a damage on the car.
   */
  ADD_DAMAGE_2ND_SHOT = 'add_damage_2nd_shot',
  /**
   * ADD_DAMAGE_PART_SELECT mode : user is asked to take a close-up picture of a damage on the car part.
   */
  ADD_DAMAGE_PART_SELECT = 'add_damage_part_select',
}

interface AddDamageModeParams extends Pick<CaptureAppConfig, 'addDamage'> {
  /**
   * Boolean indicating if the only close damage will be taken first then sights picutures.
   */
  damageDisclosure?: boolean;
  /**
   * Callback called when the user clicks on the 'close` button in vehicleDiclosure mode.
   */
  onOpenGallery: () => void;
}

/**
 * Handle used to modify the current PhotoCaptureMode of the PhotoCaptureComponent.
 */
export interface AddDamageHandle {
  /**
   * The current mode of the component.
   */
  mode: PhotoCaptureMode;
  /**
   * Parts selected to take a picture of.
   */
  vehicleParts: VehiclePart[];
  /**
   * Boolean indicating if the vehicle part selector is currently displayed.
   */
  showVehiclePartSelector: boolean;
  /**
   * Boolean indicating if the damage disclosure mode is currently displayed.
   */
  damageDisclosure: boolean;
  /**
   * Callback to be called when the user clicks on the "Add Damage" button.
   */
  handleAddDamage: () => void;
  /**
   * Callback to be called when the user selects the parts to take a picture of.
   */
  handleAddDamagePartsSelected: (parts: VehiclePart[]) => void;
  /**
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
  /**
   * Callback called when the user clicks on the "Next" button in the gallery.
   */
  handleDamageDisclosure: () => void;
}

/**
 * Custom hook used to switch between sight picture taking and add damage picture taking.
 */
export function useAddDamageMode({
  addDamage,
  onOpenGallery = () => {},
  damageDisclosure = false,
}: AddDamageModeParams): AddDamageHandle {
  const [mode, setMode] = useState(
    damageDisclosure ? PhotoCaptureMode.ADD_DAMAGE_PART_SELECT : PhotoCaptureMode.SIGHT,
  );
  const [vehicleParts, setVehicleParts] = useState<VehiclePart[]>([]);
  const [damageDisclosureMode, setDamageDisclosureMode] = useState(damageDisclosure);
  const [showVehiclePartSelector, setShowVehiclePartSelector] = useState(damageDisclosure);
  const { trackEvent } = useAnalytics();

  const handleAddDamage = useCallback(() => {
    if (addDamage === AddDamage.TWO_SHOT) {
      setMode(PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT);
      trackEvent('AddDamage Selected', {
        mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT,
      });
    }
    if (addDamage === AddDamage.PART_SELECT) {
      setMode(PhotoCaptureMode.ADD_DAMAGE_PART_SELECT);
      setShowVehiclePartSelector(true);
      trackEvent('AddDamage Selected', {
        mode: PhotoCaptureMode.ADD_DAMAGE_PART_SELECT,
      });
    }
  }, []);

  const updatePhotoCaptureModeAfterPictureTaken = useCallback(() => {
    setMode((currentMode) =>
      currentMode === PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT
        ? PhotoCaptureMode.ADD_DAMAGE_2ND_SHOT
        : PhotoCaptureMode.SIGHT,
    );
  }, []);

  const handleCancelAddDamage = useCallback(() => {
    trackEvent('AddDamage Canceled', {
      mode,
    });
    setMode(
      damageDisclosureMode ? PhotoCaptureMode.ADD_DAMAGE_PART_SELECT : PhotoCaptureMode.SIGHT,
    );
    setVehicleParts([]);
    if (
      mode === PhotoCaptureMode.ADD_DAMAGE_PART_SELECT &&
      showVehiclePartSelector &&
      damageDisclosureMode
    ) {
      onOpenGallery();
      return;
    }
    setShowVehiclePartSelector(damageDisclosureMode);
  }, [damageDisclosureMode, showVehiclePartSelector, mode]);

  const handleAddDamagePartsSelected = useCallback((parts: VehiclePart[]) => {
    setVehicleParts(parts);
  }, []);

  const handleValidateVehicleParts = useCallback(() => {
    setShowVehiclePartSelector(false);
  }, []);

  const handleDamageDisclosure = useCallback(() => {
    setDamageDisclosureMode(false);
    setShowVehiclePartSelector(false);
    setMode(PhotoCaptureMode.SIGHT);
  }, []);

  return useObjectMemo({
    mode,
    showVehiclePartSelector,
    vehicleParts,
    damageDisclosure: damageDisclosureMode,
    handleAddDamage,
    updatePhotoCaptureModeAfterPictureTaken,
    handleCancelAddDamage,
    handleAddDamagePartsSelected,
    handleValidateVehicleParts,
    handleDamageDisclosure,
  });
}
