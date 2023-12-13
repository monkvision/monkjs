import { AdditionalData, ProgressStatus, LabelPrediction } from './common';
import { MonkEntity, MonkEntityType } from './entity';
import { VehiclePart } from './part';

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
 * Generic result of the assessment of the quality of an image for a specific metric.
 */
export interface ComplianceResult {
  /**
   * The progress status of the compliance assessment.
   */
  status: ProgressStatus;
  /**
   * Indicates if the image is compliant or not for this metric.
   */
  isCompliant?: boolean;
  /**
   * An array of codes indicating the reasons why the image is not compliant (if it is not).
   */
  reasons?: string[];
}

/**
 * The detailed results of the assessment of an image quality based on its bluriness and exposure scores.
 */
export interface IQAComplianceDetails {
  /**
   * The image score for the bluriness metric. This score goes from 0 (very blurry) to 1 (not blurry).
   */
  blurrinessScore?: number;
  /**
   * The image score for the underexposure metric. This score goes from 0 (underexposed) to 1 (not underexposed).
   */
  underexposureScore?: number;
  /**
   * The image score for the overexposure metric. This score goes from 0 (overexposed) to 1 (not overexposed).
   */
  overexposureScore?: number;
}

/**
 * The result of the assessment of an image quality based on its bluriness and exposure scores.
 */
export interface IQAComplianceResult extends ComplianceResult {
  /**
   * The details of the image bluriness and exposure scores.
   */
  details?: IQAComplianceDetails;
}

/**
 * The detailed results of the assessment of an image quality based on its zoom level score.
 */
export interface ZoomLevelComplianceDetails {
  /**
   * The image score for the zoom level metric. This score goes from 0 (bad zoom) to 1 (perfect zoom).
   */
  zoomScore?: number;
}

/**
 * The result of the assessment of an image quality based on its zoom level score.
 */
export interface ZoomLevelComplianceResult extends ComplianceResult {
  /**
   * The details of the image zoom level score.
   */
  details?: ZoomLevelComplianceDetails;
}

/**
 * Results of the assessment of the quality of an image.
 */
export interface ComplianceResults {
  /**
   * The results of image's quality assessment based on its bluriness and exposure scores.
   */
  imageQualityAssessment?: IQAComplianceResult;
  /**
   * The results of image's quality assessment based on its car coverage score.
   */
  coverage360?: ComplianceResult;
  /**
   * The results of image's quality assessment based on its zoom level scores.
   */
  zoomLevel?: ZoomLevelComplianceResult;
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
   * The results of the image quality assessments.
   */
  compliances?: ComplianceResults;
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
  additionalData?: AdditionalData;
}
