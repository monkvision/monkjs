import { CaptureAppConfig, Sight, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { createContext } from 'react';
import { LoadingState } from '../hooks';

/**
 * Application state usually used by Monk applications to configure and handle the current user journey.
 */
export interface MonkAppState {
  /**
   * LoadingState indicating if the application state is loading. If it is loading it usually means that the provider
   * did not have time to fetch the parameter values.
   */
  loading: LoadingState;
  /**
   * The current configuration of the application.
   */
  config: CaptureAppConfig;

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
   * The current vehicle type of the app. This value usually helps to choose which sights to display to the user, or
   * which car 360 wireframes to use for the inspection report.
   */
  vehicleType: VehicleType | null;
  /**
   * The position of the steering wheel.
   */
  steeringWheel: SteeringWheelPosition | null;
  /**
   * Getter function used to get the current Sights based on the current VehicleType, SteeringWheel position etc.
   */
  getCurrentSights: () => Sight[];

  /**
   * Setter function used to set the current auth token.
   */
  setAuthToken: (value: string | null) => void;
  /**
   * Setter function used to set the current inspection ID.
   */
  setInspectionId: (value: string | null) => void;
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
 * React context used to store the current Monk application state.
 *
 * @see MonkAppState
 */
export const MonkAppStateContext = createContext<MonkAppState | null>(null);
