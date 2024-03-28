import { AdditionalData, LabelPrediction } from './common';
import { MonkEntity, MonkEntityType } from './entity';
import { VehiclePart } from './part';
import { TranslationObject } from '../i18n';

/**
 * Additional data that can be added to an image when it has been uploaded.
 */
export interface ImageAdditionalData extends AdditionalData {
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
  NOT_COMPLIANT = ' not_compliant',
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
   * If compliance checks are enable, this property can be used to select a list of compliance issues to check. If an
   * image is not compliant only because of issues that are not present in this array, the image will be considered
   * compliant. If `enableCompliance` is set to `false`, this property is ignored.
   *
   * @default The default compliance issues that are checked by the MonkJs SDK are listed in the README of
   * the @monkvision/network package.
   * @see [Network README documentation](https://github.com/monkvision/monkjs/blob/main/packages/network/README.md)
   */
  complianceIssues?: ComplianceIssue[];
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
