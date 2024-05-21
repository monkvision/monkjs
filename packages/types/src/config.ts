import { CompressionOptions } from './camera';
import { SteeringWheelPosition, VehicleType } from './sights';
import { MonkPalette } from './theme';
import { ComplianceOptions, TaskName } from './state';
import { DeviceOrientation } from './utils';

/**
 * The configuration options for inspection capture applications.
 */
export type CaptureAppConfig = Partial<CompressionOptions> &
  Partial<ComplianceOptions> & {
    /**
     * Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the
     * sight will be used.
     */
    tasksBySight?: Record<string, TaskName[]>;
    /**
     * Value indicating if tasks should be started at the end of the inspection :
     * - If not provided or if value is set to `false`, no tasks will be started.
     * - If set to `true`, the tasks described by the `tasksBySight` param (or, if not provided, the default tasks of each
     * sight) will be started.
     * - If an array of tasks is provided, the tasks started will be the ones contained in the array.
     *
     * @default true
     */
    startTasksOnComplete?: boolean | TaskName[];
    /**
     * Boolean indicating if the close button should be displayed in the HUD on top of the Camera preview.
     *
     * @default false
     */
    showCloseButton?: boolean;
    /**
     * Use this prop to enforce a specific device orientation for the Camera screen.
     */
    enforceOrientation?: DeviceOrientation;
    /**
     * If compliance is enabled, this prop indicate if the user is allowed to skip the retaking process if pictures are
     * not compliant.
     *
     * @default false
     */
    allowSkipRetake?: boolean;
    /**
     * Boolean indicating if `Add Damage` feature should be enabled or not. If disabled, the `Add Damage` button will be hidden.
     *
     * @default true
     */
    enableAddDamage?: boolean;
    /**
     * The default vehicle type used if no vehicle type is defined.
     */
    defaultVehicleType: VehicleType;
    /**
     * Boolean indicating if manual login and logout in the app should be enabled or not.
     */
    allowManualLogin: boolean;
    /**
     * Boolean indicating if the application state (such as auth token, inspection ID etc.) should be fetched from the URL
     * search params or not.
     */
    fetchFromSearchParams: boolean;
    /**
     * Optional color palette to extend the default Monk palette.
     */
    palette?: Partial<MonkPalette>;
  } & (
    | {
        /**
         * Boolean indicating if the capture Sights should vary based on the steering wheel position.
         */
        enableSteeringWheelPosition: false;
        /**
         * The capture Sights per vehicle type.
         */
        sights: Partial<Record<VehicleType, string[]>>;
      }
    | {
        /**
         * Boolean indicating if the capture Sights should vary based on the steering wheel position.
         */
        enableSteeringWheelPosition: true;
        /**
         * The capture Sights per vehicle type.
         */
        sights: Record<SteeringWheelPosition, Partial<Record<VehicleType, string[]>>>;
      }
  );

/**
 * Live configuration used to configure Monk apps on the go.
 */
export type LiveConfig = CaptureAppConfig & {
  /**
   * The ID of the live config, used to fetch it from the API.
   */
  id: string;
  /**
   * The name of the live config.
   */
  name?: string;
};
