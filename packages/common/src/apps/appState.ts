import {
  PhotoCaptureAppConfig,
  Sight,
  SteeringWheelPosition,
  VehicleType,
  VideoCaptureAppConfig,
} from '@monkvision/types';
import { createContext } from 'react';
import { LoadingState } from '../hooks';

/**
 * Shared app states values by both photo and video capture workflows.
 */
export interface SharedMonkAppState {
  /**
   * LoadingState indicating if the application state is loading. If it is loading it usually means that the provider
   * did not have time to fetch the parameter values.
   */
  loading: LoadingState;
  /**
   * The authentication token representing the currently logged-in user. If this param is `null`, it means the user is
   * not logged in.
   */
  authToken: string | null;
  /**
   * The ID of the current inspection being handled (picture taking, report viewing...) by the application. If this
   * param is `null`, it probably means that the inspection must be created by the app.
   */
  inspectionId: string | null;
  /**
   * Setter function used to set the current auth token.
   */
  setAuthToken: (value: string | null) => void;
  /**
   * Setter function used to set the current inspection ID.
   */
  setInspectionId: (value: string | null) => void;
}

/**
 * App state values available in PhotoCapture applications.
 */
export interface PhotoCaptureAppState extends SharedMonkAppState {
  /**
   * The current configuration of the application.
   */
  config: PhotoCaptureAppConfig;
  /**
   * The current vehicle type of the app. This value usually helps to choose which sights to display to the user, or
   * which car 360 wireframes to use for the inspection report.
   */
  vehicleType: VehicleType | null;
  /**
   * The list of available vehicle types in the app based on the sights in the app config.
   */
  availableVehicleTypes: VehicleType[];
  /**
   * The position of the steering wheel.
   */
  steeringWheel: SteeringWheelPosition | null;
  /**
   * Getter function used to get the current Sights based on the current VehicleType, SteeringWheel position etc.
   */
  getCurrentSights: () => Sight[];
  /**
   * Setter function used to set the current vehicle type.
   */
  setVehicleType: (value: VehicleType | null) => void;
  /**
   * Setter function used to set the current steering wheel position.
   */
  setSteeringWheel: (value: SteeringWheelPosition | null) => void;
}

/**
 * App state values available in PhotoCapture applications.
 */
export interface VideoCaptureAppState extends SharedMonkAppState {
  /**
   * The current configuration of the application.
   */
  config: VideoCaptureAppConfig;
}

/**
 * Application state usually used by Monk applications to configure and handle the current user journey.
 */
export type MonkAppState = PhotoCaptureAppState | VideoCaptureAppState;

/**
 * React context used to store the current Monk application state.
 *
 * @see MonkAppState
 */
export const MonkAppStateContext = createContext<MonkAppState | null>(null);
