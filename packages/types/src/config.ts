import { CameraResolution, CompressionOptions } from './camera';
import { SightGuideline, SteeringWheelPosition, VehicleType } from './sights';
import { MonkPalette } from './theme';
import { ComplianceOptions, TaskName } from './state';
import { DeviceOrientation } from './utils';
import { CreateInspectionOptions, MonkApiPermission } from './api';

/**
 * The types of insepction capture workflow.
 */
export enum CaptureWorkflow {
  /**
   * PhotoCapture workflow.
   */
  PHOTO = 'photo',
  /**
   * VideoCapture workflow.
   */
  VIDEO = 'video',
}

/**
 * Enumeration of the Sight guidelines options.
 */
export enum PhotoCaptureSightGuidelinesOption {
  /**
   * Sight guidelines disabled.
   */
  DISABLED = 'disabled',
  /**
   * Sight guidelines enabled.
   */
  ENABLED = 'enabled',
  /**
   * Sight guidelines is enabled only during ephemeral time.
   */
  EPHEMERAL = 'ephemeral',
}
/**
 * Enumeration of the tutorial options.
 */
export enum PhotoCaptureTutorialOption {
  /**
   * Photo capture tutorial is disabled.
   */
  DISABLED = 'disabled',
  /**
   * Photo capture tutorial is enabled.
   */
  ENABLED = 'enabled',
  /**
   * Photo capture tutorial is enabled only time.
   */
  FIRST_TIME_ONLY = 'first_time_only',
}

/**
 * Enumeration of the Add Damage options.
 */
export enum AddDamage {
  /**
   * Add Damage is disabled.
   */
  DISABLED = 'disabled',
  /**
   * Add Damage is enabled with Two Shot:
   * First shot for the zoom out image and second for the close up. The vehicle part will be infered.
   */
  TWO_SHOT = 'two_shot',
  /**
   * Add Damage is enabled with Part select:
   * Parts must be selected before taken a single close up shot.
   */
  PART_SELECT = 'part_select',
}

/**
 * Configuration used to configure the Camera and picture output of the SDK.
 */
export type CameraConfig = Partial<CompressionOptions> & {
  /**
   * This option specifies the resolution of the pictures taken by the Camera. This option does not affect the
   * resolution of the Camera preview (it will always be the highest resolution possible). If the specified resolution
   * is not equal to the one used by the device's native camera, the pictures taken will be scaled to fit the
   * requirements. Note that if the aspect ratio of the specified resolution differs from the one of the device's
   * camera, pictures taken will always have the same aspect ratio as the native camera one, and will be scaled in a way
   * to make sure that neither the width, nor the height of the output picture will exceed the dimensions of the
   * specified resolution.
   *
   * Note: If the specified resolution is higher than the best resolution available on the current device, output
   * pictures will only be scaled up to the specified resolution if the `allowImageUpscaling` property is set to `true`.
   *
   * @default CameraResolution.UHD_4K
   */
  resolution?: CameraResolution;
  /**
   * When the native resolution of the device Camera is smaller than the resolution asked in the `resolution` prop,
   * resulting pictures will only be scaled up if this property is set to `true`.
   *
   * @default false
   */
  allowImageUpscaling?: boolean;
};

/**
 * Shared config used by both PhotoCapture and VideoCapture apps.
 */
export type SharedCaptureAppConfig = CameraConfig & {
  /**
   * An optional list of additional tasks to run on every image of the inspection.
   */
  additionalTasks?: TaskName[];
  /**
   * Value indicating if tasks should be started at the end of the inspection :
   * - If not provided or if value is set to `false`, no tasks will be started.
   * - If set to `true`, for photo capture apps : the tasks described by the `tasksBySight` param (or, if not provided,
   * the default tasks of each sight) will be started.
   * - If set to `true`, for video capture apps : the default tasks of each sight (and also optionally the ones
   *   described by the `additionalTasks` param) will be started.
   * - If an array of tasks is provided, the tasks started will be the ones contained in the array.
   *
   * @default true
   */
  startTasksOnComplete?: boolean | TaskName[];
  /**
   * Use this prop to enforce a specific device orientation for the Camera screen.
   */
  enforceOrientation?: DeviceOrientation;
  /**
   * Boolean indicating if manual login and logout in the app should be enabled or not.
   */
  allowManualLogin: boolean;
  /**
   * Boolean indicating if the application state (such as auth token, inspection ID etc.) should be fetched from the
   * URL search params or not.
   */
  fetchFromSearchParams: boolean;
  /**
   * The API domain used to communicate with the API.
   */
  apiDomain: string;
  /**
   * The API domain used to communicate with the resize microservice.
   */
  thumbnailDomain: string;
  /**
   * Required API permissions to use the app.
   */
  requiredApiPermissions?: MonkApiPermission[];
  /**
   * Optional color palette to extend the default Monk palette.
   */
  palette?: Partial<MonkPalette>;
} & (
    | {
        /**
         * Boolean indicating if automatic inspection creation should be allowed or not.
         */
        allowCreateInspection: false;
      }
    | {
        /**
         * Boolean indicating if automatic inspection creation should be allowed or not.
         */
        allowCreateInspection: true;
        /**
         * Options used when automatically creating an inspection.
         */
        createInspectionOptions: CreateInspectionOptions;
      }
  );

/**
 * The configuration options for inspection capture applications using the PhotoCapture workflow.
 */
export type PhotoCaptureAppConfig = SharedCaptureAppConfig &
  ComplianceOptions & {
    /**
     * The capture workflow of the capture app.
     */
    workflow: CaptureWorkflow.PHOTO;
    /**
     * Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the
     * sight will be used.
     */
    tasksBySight?: Record<string, TaskName[]>;
    /**
     * Boolean indicating if the close button should be displayed in the HUD on top of the Camera preview.
     *
     * @default false
     */
    showCloseButton?: boolean;
    /**
     * A number indicating the maximum allowed duration in milliseconds for an upload before raising a "Bad Connection"
     * warning to the user. Set this value to -1 to never show this warning to the user.
     *
     * @default 15000
     */
    maxUploadDurationWarning?: number;
    /**
     * Boolean indicating if the image quality should be downgraded automatically in case of low connection.
     *
     * @default true
     */
    useAdaptiveImageQuality?: boolean;
    /**
     * If compliance is enabled, this prop indicate if the user is allowed to skip the retaking process if pictures are
     * not compliant.
     *
     * @default false
     */
    allowSkipRetake?: boolean;
    /**
     * Options for Add Damage. If disabled, the `Add Damage` button will be hidden.
     *
     * @default AddDamage.PART_SELECT.
     */
    addDamage?: AddDamage;
    /**
     * A collection of sight guidelines in different language with a list of sightIds associate to it.
     */
    sightGuidelines?: SightGuideline[];
    /**
     * Option for displaying the Sight guidelines. If disabled, the guideline text will be hidden.
     *
     * @default SightGuidelinesOption.EPHMERAL.
     */
    enableSightGuidelines?: PhotoCaptureSightGuidelinesOption;
    /**
     * The default vehicle type used if no vehicle type is defined.
     */
    defaultVehicleType: VehicleType;
    /**
     * Boolean indicating if vehicle type selection should be enabled if the vehicle type is not defined.
     */
    allowVehicleTypeSelection: boolean;
    /**
     * Options for displaying the photo capture tutorial.
     *
     * @default PhotoCaptureTutorialOption.FIRST_TIME_ONLY.
     */
    enableTutorial?: PhotoCaptureTutorialOption;
    /**
     * Boolean indicating if the user can skip the PhotoCapture tutorial.
     *
     * @default true
     */
    allowSkipTutorial?: boolean;
    /**
     * Boolean indicating whether the sight tutorial feature is enabled. If disabled, the sight tutorial icon displayed
     * on the bottom left will be hidden.
     *
     * @default true
     */
    enableSightTutorial?: boolean;
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
         * The default value for the steering wheel position.
         */
        defaultSteeringWheelPosition: SteeringWheelPosition;
        /**
         * The capture Sights per vehicle type.
         */
        sights: Record<SteeringWheelPosition, Partial<Record<VehicleType, string[]>>>;
      }
  );

/**
 * The configuration options for inspection capture applications using the VideoCapture workflow.
 */
export type VideoCaptureAppConfig = SharedCaptureAppConfig & {
  /**
   * The capture workflow of the capture app.
   */
  workflow: CaptureWorkflow.VIDEO;
  /**
   * The minimum duration of a recording in milliseconds.
   *
   * @default 15000
   */
  minRecordingDuration?: number;
  /**
   * The maximum number of retries for failed image uploads.
   *
   * @default 3
   */
  maxRetryCount?: number;
  /**
   * Boolean indicating if a warning should be shown to the user when they are walking too fast around the vehicle.
   *
   * @default true
   */
  enableFastWalkingWarning?: boolean;
  /**
   * Boolean indicating if a warning should be shown to the user when they are shaking their phone too much.
   *
   * @default true
   */
  enablePhoneShakingWarning?: boolean;
  /**
   * The duration (in milliseconds) to wait between fast walking warnings. We recommend setting this value to at least
   * 1000.
   *
   * @default 4000
   */
  fastWalkingWarningCooldown?: number;
  /**
   * The duration (in milliseconds) to wait between phone shaking warnings. We recommend setting this value to at least
   * 1000.
   *
   * @default 4000
   */
  phoneShakingWarningCooldown?: number;
};

/**
 * Live configuration used to configure Monk apps on the go.
 */
export type LiveConfig = (PhotoCaptureAppConfig | VideoCaptureAppConfig) & {
  /**
   * The ID of the live config, used to fetch it from the API.
   */
  id: string;
  /**
   * The description of the configuration.
   */
  description: string;
};
