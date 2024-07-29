import { ComplianceOptions, Image, Sight } from '@monkvision/types';
import { MonkApiConfig } from '@monkvision/network';

/**
 * Enumeration of the reasons of a navigation event from the gallery back to the Capture flow.
 */
export enum NavigateToCaptureReason {
  /**
   * No particuliar reason : the user simply wants to return to the capture flow.
   */
  NONE = 'none',
  /**
   * The user wants to return to the capture flow in order to capture a specific sight.
   */
  CAPTURE_SIGHT = 'capture_sight',
  /**
   * The user wants to return to the capture flow in order to retake a non-compliant picture
   */
  RETAKE_PICTURE = 'retake_picture',
  /**
   * The user wants to return to the capture flow in order to add a custom damage.
   */
  ADD_DAMAGE = 'add_damage',
}

/**
 * The options passed to the `onNavigateToCapture` callback.
 */
export type NavigateToCaptureOptions =
  | {
      /**
       * The reason of the navigate event.
       */
      reason: NavigateToCaptureReason.NONE;
    }
  | {
      /**
       * The reason of the navigate event.
       */
      reason: NavigateToCaptureReason.ADD_DAMAGE;
    }
  | {
      /**
       * The reason of the navigate event.
       */
      reason: NavigateToCaptureReason.CAPTURE_SIGHT;
      /**
       * The ID of the sight to capture.
       */
      sightId: string;
    }
  | {
      /**
       * The reason of the navigate event.
       */
      reason: NavigateToCaptureReason.RETAKE_PICTURE;
      /**
       * The ID of the sight to retake.
       */
      sightId: string;
    };

/**
 * Props accepted by the InspectionGallery component.
 */
export type InspectionGalleryProps = {
  /**
   * The ID of the inspection to display the images of.
   */
  inspectionId: string;
  /**
   * The config used to communicate with the API.
   */
  apiConfig: MonkApiConfig;
  /**
   * The language used by the InspectionGallery component.
   *
   * @default en
   */
  lang?: string | null;
  /**
   * The delay (in milliseconds) between each `getInspection` request made to the API when polling the status of the
   * inspection.
   *
   * @default 1000
   */
  refreshIntervalMs?: number;
  /**
   * Boolean indicating if the back button of the gallery top bar should be displayed or not.
   *
   * @default false
   */
  showBackButton?: boolean;
  /**
   * Callback called when the user presses the back button if it is displayed.
   */
  onBack?: () => void;
  /**
   * Callback called when the user presses the validate button.
   */
  onValidate?: () => void;
  /**
   * Boolean indicating if `Add Damage` feature should be enabled or not. If disabled, the `Add Custom Damage` button
   * will be hidden.
   *
   * @default true
   */
  enableAddDamage?: boolean;
  /**
   * Custom label for validate button.
   */
  validateButtonLabel?: string;
} & (
  | ({
      /**
       * Boolean indicating if this component is displayed in "capture" mode. Capture mode enables features such as
       * compliance, retakes, navigating to capture etc. Set this prop to `true` if your user is currently capturing
       * pictures for their inspection.
       */
      captureMode: true;
      /**
       * The list of sights to be capture in the current capture flow. This prop can only be specified if `captureMode`
       * is set to true.
       */
      sights: Sight[];
      /**
       * Boolean indicating if the user should be allowed to skip the retaking of non-compliant pictures before
       * validating the inspection. This prop can only be specified if `captureMode` is set to true.
       *
       * @default false
       */
      allowSkipRetake?: boolean;
      /**
       * Callback called when the user wants to navigate back to the capture component. This prop can only be specified
       * if `captureMode` is set to true.
       */
      onNavigateToCapture?: (options: NavigateToCaptureOptions) => void;
    } & Partial<ComplianceOptions>)
  | {
      /**
       * Boolean indicating if this component is displayed in "capture" mode. Capture mode enables features such as
       * compliance, retakes, navigating to capture etc. Set this prop to `true` if your user is currently capturing
       * pictures for their inspection.
       */
      captureMode: false;
    }
);

export type InspectionGalleryItem =
  | { isAddDamage: true }
  | { isAddDamage: false; isTaken: true; image: Image }
  | { isAddDamage: false; isTaken: false; sightId: string };
