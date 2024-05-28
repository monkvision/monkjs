import { AdditionalData, LabelPrediction } from './common';
import { MonkEntity, MonkEntityType } from './entity';
import { VehiclePart } from './part';
import { TranslationObject } from '../i18n';

/**
 * Additional data that can be added to an image when it has been uploaded.
 */
export interface ImageAdditionalData extends AdditionalData {
  /**
   * The Date (ISO String) at which the image was created.
   */
  created_at?: string;
  /**
   * The ID of the sight of the image. This value is present only if the picture is a beautyshot picture and if it was
   * taken using the PhotoCapture component of the MonkJs SDK.
   */
  sight_id?: string;
  /**
   * The label of the image. This value is present only if the picture is a beautyshot picture and if it was taken using
   * the PhotoCapture component of the MonkJs SDK.
   */
  label?: TranslationObject;
}

/**
 * The type of image.
 */
export enum ImageType {
  /**
   * A "normal" image taken by the user when doing an inspection : a sight was shown to the user, and he took a picture
   * of the vehicle while trying to match the point of view of the sight.
   */
  BEAUTY_SHOT = 'beauty_shot',
  /**
   * This type of image includes 2 scenarios :
   * - This image is a "close up" picture taken by the user when using the "Zoomed Damage" feature of the capture
   * workflow : the user took a custom picture, zoomed closely on a damage and without being shown a sight at all.
   * - This image is associated to a View of beauty shot image (a zoomed / cropped / transformed image) that focuses on
   * a specific part of the image (a vehicle part, a damage etc.).
   */
  CLOSE_UP = 'close_up',
}

/**
 * The subtype of an image.
 */
export enum ImageSubtype {
  /**
   * For images that are "close up" images focused on a vehicle part.
   */
  CLOSE_UP_PART = 'close_up_part',
  /**
   * For images that are "close up" images focused on a damage.
   */
  CLOSE_UP_DAMAGE = 'close_up_damage',
}

/**
 * Enumeration of elements other than vehicle parts that can be the main focus of a picture.
 */
export enum CentersOnElement {
  FRONT = 'front',
  BACK = 'back',
  LEFT = 'left',
  RIGHT = 'right',
  FRONT_LEFT = 'front_left',
  FRONT_RIGHT = 'front_right',
  BACK_LEFT = 'back_left',
  BACK_RIGHT = 'back_right',
  KEYS = 'keys',
  DASHBOARD = 'dashboard',
  UNDERCARRIAGE = 'undercarriage',
  SEATS = 'seats',
  TRUNK_INTERIOR = 'trunk_interior',
}

/**
 * Detailed information describing an inspection image context (where was the picture taken from etc.)
 */
export interface Viewpoint {
  /**
   * Boolean indicating if the picture represents the exterior of a vehicle or not.
   */
  isExterior?: boolean;
  /**
   * The estimated distance from the vehicle at which this picture was taken from.
   */
  distance?: string;
  /**
   * The list of vehicle parts that the picture is focusing on.
   */
  centersOn?: (VehiclePart | CentersOnElement)[];
}

/**
 * Enumeration of the possible statuses of an inspection image.
 */
export enum ImageStatus {
  /**
   * The image is currently being uploaded.
   */
  UPLOADING = 'uploading',
  /**
   * The image has been uploaded successfully, the compliance is enabled for this image and the compliance check has not
   * finished yet.
   */
  COMPLIANCE_RUNNING = 'compliance_running',
  /**
   * The image was successfully uploaded. If the compliance is enabled for this image, this status also means that the
   * compliance has finished and the image is fully compliant.
   */
  SUCCESS = 'success',
  /**
   * The image couldn't be uploaded to the API.
   */
  UPLOAD_FAILED = 'upload_failed',
  /**
   * The image was successfully uploaded to the API, and the compliance chekc finished running but its result says that
   * the image is NOT compliant. The list of reasons describing why the image is not compliant is available in the
   * `image.complianceReasons` array.
   */
  NOT_COMPLIANT = 'not_compliant',
}

/**
 * Enumeration of the possible issues that could explain why an image is not compliant.
 */
export enum ComplianceIssue {
  OTHER = 'other',
  LOW_RESOLUTION = 'low_resolution',
  BLURRINESS = 'blurriness',
  UNDEREXPOSURE = 'underexposure',
  OVEREXPOSURE = 'overexposure',
  LENS_FLARE = 'lens_flare',
  DIRTINESS = 'dirtiness',
  SNOWNESS = 'snowness',
  WETNESS = 'wetness',
  REFLECTIONS = 'reflections',
  UNKNOWN_SIGHT = 'unknown_sight',
  UNKNOWN_VIEWPOINT = 'unknown_viewpoint',
  NO_VEHICLE = 'no_vehicle',
  WRONG_ANGLE = 'wrong_angle',
  WRONG_CENTER_PART = 'wrong_center_part',
  MISSING_PARTS = 'missing_parts',
  HIDDEN_PARTS = 'hidden_parts',
  TOO_ZOOMED = 'too_zoomed',
  NOT_ZOOMED_ENOUGH = 'not_zoomed_enough',
  INTERIOR_NOT_SUPPORTED = 'interior_not_supported',
  MISSING = 'missing',
  LOW_QUALITY = 'low_quality',
}

/**
 * The order of priority of compliance issues in the SDK. This array is used to sort compliance issue arrays. The
 * smaller the index, the higher the priority of the compliance issue.
 */
export const COMPLIANCE_ISSUES_PRIORITY = [
  ComplianceIssue.NO_VEHICLE,

  ComplianceIssue.BLURRINESS,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.LENS_FLARE,

  ComplianceIssue.TOO_ZOOMED,
  ComplianceIssue.NOT_ZOOMED_ENOUGH,
  ComplianceIssue.WRONG_ANGLE,
  ComplianceIssue.HIDDEN_PARTS,
  ComplianceIssue.MISSING_PARTS,
  ComplianceIssue.WRONG_CENTER_PART,

  ComplianceIssue.REFLECTIONS,
  ComplianceIssue.SNOWNESS,
  ComplianceIssue.WETNESS,
  ComplianceIssue.DIRTINESS,

  ComplianceIssue.LOW_QUALITY,
  ComplianceIssue.LOW_RESOLUTION,
  ComplianceIssue.UNKNOWN_SIGHT,
  ComplianceIssue.UNKNOWN_VIEWPOINT,
  ComplianceIssue.INTERIOR_NOT_SUPPORTED,
  ComplianceIssue.MISSING,
  ComplianceIssue.OTHER,
];

/**
 * The default compliance issues used in the SDK. This array is the default value for the `complianceIssues` property of
 * the `ComplianceOptions` interface. If a compliance issue is not in this array, then it is disabled by default in the
 * SDK.
 *
 * @see ComplianceOptions
 */
export const DEFAULT_COMPLIANCE_ISSUES = [
  // ComplianceIssue.OTHER,
  // ComplianceIssue.LOW_RESOLUTION,
  ComplianceIssue.BLURRINESS,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.LENS_FLARE,
  // ComplianceIssue.DIRTINESS,
  // ComplianceIssue.SNOWNESS,
  // ComplianceIssue.WETNESS,
  ComplianceIssue.REFLECTIONS,
  ComplianceIssue.UNKNOWN_SIGHT,
  ComplianceIssue.UNKNOWN_VIEWPOINT,
  ComplianceIssue.NO_VEHICLE,
  ComplianceIssue.WRONG_ANGLE,
  ComplianceIssue.WRONG_CENTER_PART,
  ComplianceIssue.MISSING_PARTS,
  ComplianceIssue.HIDDEN_PARTS,
  ComplianceIssue.TOO_ZOOMED,
  ComplianceIssue.NOT_ZOOMED_ENOUGH,
  // ComplianceIssue.INTERIOR_NOT_SUPPORTED,
  ComplianceIssue.MISSING,
  // ComplianceIssue.LOW_QUALITY,
];

/**
 * An array of compliance issues used to make the IQA checks (Image Quality Assessment). Spread this array in the
 * `complianceIssues` property of the `ComplianceOptions` interface to enable IQA.
 */
export const IQA_COMPLIANCE_ISSUES = [
  ComplianceIssue.BLURRINESS,
  ComplianceIssue.UNDEREXPOSURE,
  ComplianceIssue.OVEREXPOSURE,
  ComplianceIssue.LENS_FLARE,
];

/**
 * An array of compliance issues used to make the VQA checks (Vehicle Quality Assessment). Spread this array in the
 * `complianceIssues` property of the `ComplianceOptions` interface to enable VQA.
 */
export const VQA_COMPLIANCE_ISSUES = [
  ComplianceIssue.DIRTINESS,
  ComplianceIssue.SNOWNESS,
  ComplianceIssue.WETNESS,
  ComplianceIssue.REFLECTIONS,
];

/**
 * An array of compliance issues used to make the zoom level checks. Spread this array in the `complianceIssues`
 * property of the `ComplianceOptions` interface to enable zoom level checks.
 */
export const ZOOM_LEVEL_COMPLIANCE_ISSUES = [
  ComplianceIssue.TOO_ZOOMED,
  ComplianceIssue.NOT_ZOOMED_ENOUGH,
];

/**
 * An array of compliance issues used to make the car coverage checks (is the sight properly aligned etc.). Spread this
 * array in the `complianceIssues` property of the `ComplianceOptions` interface to enable car coverage.
 */
export const CAR_COVERAGE_COMPLIANCE_ISSUES = [
  ComplianceIssue.UNKNOWN_SIGHT,
  ComplianceIssue.UNKNOWN_VIEWPOINT,
  ComplianceIssue.NO_VEHICLE,
  ComplianceIssue.WRONG_ANGLE,
  ComplianceIssue.WRONG_CENTER_PART,
  ComplianceIssue.MISSING_PARTS,
  ComplianceIssue.HIDDEN_PARTS,
];

/**
 * Custom thresholds that can be used to modify the strictness of the compliance for certain compliance issues.
 * Thresholds are values between 0 and 1, where a compliance score under the thresholds indicates that the image fails
 * the compliance check (ex: a threshold of 0 will mean that the compliance always passes).
 */
export interface CustomComplianceThresholds {
  /**
   * Custom threshold for the `ComplianceIssue.BLURRINESS` issue.
   *
   * @see ComplianceIssue.BLURRINESS
   */
  blurriness?: number;
  /**
   * Custom threshold for the `ComplianceIssue.OVEREXPOSURE` issue.
   *
   * @see ComplianceIssue.OVEREXPOSURE
   */
  overexposure?: number;
  /**
   * Custom threshold for the `ComplianceIssue.UNDEREXPOSURE` issue.
   *
   * @see ComplianceIssue.UNDEREXPOSURE
   */
  underexposure?: number;
  /**
   * Custom threshold for the `ComplianceIssue.LENS_FLARE` issue.
   *
   * @see ComplianceIssue.LENS_FLARE
   */
  lensFlare?: number;
  /**
   * Custom threshold for the `ComplianceIssue.WETNESS` issue.
   *
   * @see ComplianceIssue.WETNESS
   */
  wetness?: number;
  /**
   * Custom threshold for the `ComplianceIssue.SNOWNESS` issue.
   *
   * @see ComplianceIssue.SNOWNESS
   */
  snowness?: number;
  /**
   * Custom threshold for the `ComplianceIssue.DIRTINESS` issue.
   *
   * @see ComplianceIssue.DIRTINESS
   */
  dirtiness?: number;
  /**
   * Custom threshold for the `ComplianceIssue.REFLECTIONS` issue.
   *
   * @see ComplianceIssue.REFLECTIONS
   */
  reflections?: number;
  /**
   * Custom thresholds for the zoom level checks. The zoom level compliance score is different from the other scores.
   * This check outputs a score number (usually between 0 and 1, but it can be a bit greater than 1) that defines the
   * prediction of how zoomed the photo is (the lower the value, the greater the zoom). The compliance thresholds for
   * this compliance check are two numbers `min` and `max` with `max > min`. If the compliance score is smaller than the
   * `min` value, the photo is considered too zoomed (`ComplianceIssue.TOO_ZOOMED`), if it is greater than the `max`
   * value, the photo is considered not zoomed enough (`ComplianceIssue.NOT_ZOOMED_ENOUGH`). Scores that fall between
   * the `min` and `max` values indicate that the photo is compliant.
   */
  zoom?: {
    /**
     * The smallest compliant value for the zoom level compliance score.
     */
    min: number;
    /**
     * The biggest compliant value for the zoom level compliance score.
     */
    max: number;
  };
}

/**
 * Options used to configure the compliance checks at the application level. Note that these options do NOT affect
 * anything at the API level, and are only here to specify how the compliance should behave in the Front-End
 * applications.
 */
export interface ComplianceOptions {
  /**
   * Boolean indicating if compliance checks should be enabled or not.
   *
   * @default true
   */
  enableCompliance?: boolean;
  /**
   * An array of Sight IDs that indicates for which sight IDs the compliance should be enabled. If this property is
   * defined, it overrides the value of the `enableCompliance` property, meaning that for images taken for a specific
   * Sight, the compliance will only be enabled if the Sight's ID is included in the array. For images taken without
   * Sights (close-ups for instance), this property is ignored and only the value from `enableCompliance` will be taken
   * into account.
   */
  enableCompliancePerSight?: string[];
  /**
   * If compliance checks are enabled, this property can be used to select a list of compliance issues to check. If an
   * image is not compliant only because of issues that are not present in this array, the image will be considered
   * compliant. If `enableCompliance` is set to `false`, this property is ignored.
   *
   * @default DEFAULT_COMPLIANCE_ISSUES
   * @see DEFAULT_COMPLIANCE_ISSUES
   */
  complianceIssues?: ComplianceIssue[];
  /**
   * A map associating Sight IDs to a list of compliance issues to check. This property overrides the `complianceIssues`
   * property, meaning that for images taken for a specific Sight, if this map contains a value, it will be used as the
   * list of valid compliance issues for this image. If the map does not contain a value for the given Sight ID, or if
   * the image does not have a corresponding Sight (like close-up pictures for instance), then the value used will be
   * the one given by the `complianceIssues` property (or the default value if `complianceIssues` is not defined).
   *
   * @see complianceIssues
   */
  complianceIssuesPerSight?: Record<string, ComplianceIssue[]>;
  /**
   * Boolean indicating if live compliance should be enabled or not. With this feature enabled, you directly get the
   * result of the compliance checks in the response of the POST image request, at the cost of the request taking more
   * time to complete. If `enableCompliance` is set to `false`, this option is ignored.
   *
   * @default false
   */
  useLiveCompliance?: boolean;
  /**
   * Custom thresholds that can be used to modify the strictness of the compliance for certain compliance issues.
   * Thresholds are values between 0 and 1, where a compliance score under the thresholds indicates that the image fails
   * the compliance check (ex: a threshold of 0 will mean that the compliance always passes).
   */
  customComplianceThresholds?: CustomComplianceThresholds;
  /**
   * A map associating Sight IDs to custom compliance thresholds. This property overrides the `customThresholds`
   * property, meaning that for images taken for a specific Sight, if this map contains a value, it will be used as the
   * list of custom compliance thresholds for this image. If the map does not contain a value for the given Sight ID, or
   * if the image does not have a corresponding Sight (like close-up pictures for instance), then the value used will be
   * the one given by the `customComplianceThresholds` property (or the default value if `customComplianceThresholds` is
   * not defined).
   *
   * @see customComplianceThresholds
   */
  customComplianceThresholdsPerSight?: Record<string, CustomComplianceThresholds>;
}

/**
 * An inspection image.
 */
export interface Image extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.IMAGE;
  /**
   * The ID of the inspection that this image was uploaded to.
   */
  inspectionId: string;
  /**
   * The URL at which the image can be downloaded.
   */
  path: string;
  /**
   * The width of the image.
   */
  width: number;
  /**
   * The height of the image.
   */
  height: number;
  /**
   * The binary size (in bytes) of the image.
   */
  size: number;
  /**
   * The mimetype of the image.
   */
  mimetype: string;
  /**
   * The type of the image.
   */
  type: ImageType;
  /**
   * The current status of the image.
   */
  status: ImageStatus;
  /**
   * The ID of the sight of the image. This value can be `undefined` for many reasons:
   * - The picture was not taken by the MonkJs SDK or by an old version of the SDK
   * - The picture does not have a corresponding sight (close-up etc.)
   * - ...
   */
  sightId?: string;
  /**
   * The timestamp at which the image was created. This value can be `undefined` for many reasons (the picture was not
   * taken by the MonkJs SDK or by an old version of the SDK etc.). This timestamp is generated using the `Date.now()`
   * and` Date.parse()` APIs.
   */
  createdAt?: number;
  /**
   * If the image status is equal to `ImageStatus.NOT_COMPLIANT` meaning that the compliance was enabled for this image
   * and the image was not compliant, the list of issues indicating why the image is not compliant is given in this
   * field. If the compliance was not enabled for this image or if the image is compliant, this property is not defined.
   */
  complianceIssues?: ComplianceIssue[];
  /**
   * This key can be set when coupling two pictures together for the 2-shot damage detection. This key must be unique
   * for each pair of image accross the whole inspection.
   */
  siblingKey?: string;
  /**
   * The labels (one for each language) of this image.
   */
  label?: TranslationObject;
  /**
   * The subtype of the image.
   */
  subtype?: ImageSubtype;
  /**
   * A prediction made by the AI model when trying to determine the context of this picture (where this picture was
   * taken from etc.).
   */
  viewpoint?: LabelPrediction;
  /**
   * Additional information about the picture context (where this picture was taken from etc.).
   */
  detailedViewpoint?: Viewpoint;
  /**
   * The IDs of the RenderedOutput entities created using this image.
   */
  renderedOutputs: string[];
  /**
   * The IDs of the View entities created using this image.
   */
  views: string[];
  /**
   * Additional data added during the upload of the image.
   */
  additionalData?: ImageAdditionalData;
}
