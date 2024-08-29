import { useCallback, useState } from 'react';
import { useObjectMemo } from '@monkvision/common';
import { useAnalytics } from '@monkvision/analytics';

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

/**
 * Handle used to modify the current PhotoCaptureMode of the PhotoCaptureComponent.
 */
export interface AddDamageHandle {
  /**
   * The current mode of the component.
   */
  mode: PhotoCaptureMode;
  /**
   * Callback to be called when the user clicks on the "Add Damage" button.
   */
  handleAddDamage: () => void;
  /**
   * Callback to be called everytime the user takes a picture to update the mode after it.
   */
  updatePhotoCaptureModeAfterPictureTaken: () => void;
  /**
   * Callback to be called when the user clicks on the "Cancel" button of the Add Damage mode.
   */
  handleCancelAddDamage: () => void;
}

/**
 * Custom hook used to switch between sight picture taking and add damage picture taking.
 */
export function useAddDamageMode(): AddDamageHandle {
  const [mode, setMode] = useState(PhotoCaptureMode.SIGHT);
  const { trackEvent } = useAnalytics();

  const handleAddDamage = useCallback(() => {
    setMode(PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT);
    trackEvent('AddDamage Selected', {
      mode: PhotoCaptureMode.ADD_DAMAGE_1ST_SHOT,
    });
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
    setMode(PhotoCaptureMode.SIGHT);
  }, []);

  return useObjectMemo({
    mode,
    handleAddDamage,
    updatePhotoCaptureModeAfterPictureTaken,
    handleCancelAddDamage,
  });
}
