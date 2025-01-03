import { Sight } from '@monkvision/types';
import { Dispatch, SetStateAction } from 'react';

/**
 * Enum of the different picture taking modes that the PhotoCapture or DamageDisclosure component can be in.
 */
export enum CaptureMode {
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
   * ADD_DAMAGE_PART_SELECT mode : user is asked to select car parts to take a picture of.
   */
  ADD_DAMAGE_PART_SELECT = 'add_damage_part_select',
  /**
   * ADD_DAMAGE_PART_SELECT_SHOT mode : user is asked to take a close-up picture of a damage on the car part.
   */
  ADD_DAMAGE_PART_SELECT_SHOT = 'add_damage_part_select_shot',
}

/**
 * Enum of the different capture screen available in the capture process.
 */
export enum CaptureScreen {
  /**
   * Camera scren.
   */
  CAMERA = 'camera',
  /**
   * Gallery screen.
   */
  GALLERY = 'gallery',
}

/**
 * Object containing state management utilities for the PhotoCapture sights.
 */
export interface PhotoCaptureSightState {
  /**
   * The currently selected sight in the PhotoCapture component : the sight that the user needs to capture.
   */
  selectedSight: Sight;
  /**
   * Array containing the list of sights that the user has already captured.
   */
  sightsTaken: Sight[];
  /**
   * Callback called when the user manually select a new sight.
   */
  selectSight: (s: Sight) => void;
  /**
   * Callback called when the user has taken a picture of a sight.
   */
  takeSelectedSight: () => void;
  /**
   * Callback called when a sight needs to be retaken.
   */
  retakeSight: (id: string) => void;
  /**
   * Value storing the last picture taken by the user. If no picture has been taken yet, this value is null.
   */
  lastPictureTakenUri: string | null;
  /**
   * Callback used to manually update the last picture taken by the user after they take a picture.
   */
  setLastPictureTakenUri: (uri: string) => void;
  /**
   * Callback that can be used to retry fetching this state object from the API in case the previous fetch failed.
   */
  retryLoadingInspection: () => void;
  /**
   * Boolean indicating if the inspection is completed or not.
   */
  isInspectionCompleted: boolean;
  /**
   * Callback used to manually update the completion state of the inspection.
   */
  setIsInspectionCompleted: Dispatch<SetStateAction<boolean>>;
}

/**
 * Object containing state management utilities for the PhotoCapture sights.
 */
export interface DamageDisclosureState {
  /**
   * Value storing the last picture taken by the user. If no picture has been taken yet, this value is null.
   */
  lastPictureTakenUri: string | null;
  /**
   * Callback used to manually update the last picture taken by the user after they take a picture.
   */
  setLastPictureTakenUri: (uri: string) => void;
  /**
   * Callback that can be used to retry fetching this state object from the API in case the previous fetch failed.
   */
  retryLoadingInspection: () => void;
}
