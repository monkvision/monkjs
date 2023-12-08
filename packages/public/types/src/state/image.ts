import { AdditionalData, ProgressStatus } from './common';
import { MonkEntity, MonkEntityType } from './entity';
import { VehiclePart } from './part';
import { LabelPrediction } from './wheelAnalysis';

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
 * Type definition for a polygon drawn on an image, usually used to mark a damage on an image view. Polygons are
 * represented by an array of N points, each point being defined as an array of exactly 2 integers representing
 * respectively the X and Y coordinates (in pixels) of the point in the image.
 */
export type Polygon = number[][];

/**
 * This object defines the coordinates of an element (a part, a damage, a sub image etc.) on an image.
 */
export interface BoundingBox {
  /**
   * The smallest X coordinate of the BoundingBox's rectangle.
   */
  xMin: number;
  /**
   * The smallest Y coordinate of the BoundingBox's rectangle.
   */
  yMin: number;
  /**
   * The width of the BoundingBox's rectangle.
   */
  width: number;
  /**
   * The height of the BoundingBox's rectangle.
   */
  height: number;
}

/**
 * The image details of a View. See the View interface for more details.
 *
 * @see View
 */
export interface ViewImage {
  /**
   * The type of the image.
   */
  type?: ImageType;
  /**
   * The subtype of the image.
   */
  subtype?: ImageSubtype;
  /**
   * Additional data added during the upload of the image.
   */
  additionalData?: AdditionalData;
}

/**
 * A view associated with an image in an inspection. A view is defined as a transformation, annotation or crop of an
 * inspection image which provides more information on the algorithms detections. For instance, a view can be a zoomed
 * and cropped version of an inspection image that focuses on a detected scratch.
 */
export interface View {
  /**
   * The ID of the damage associated with this View.
   */
  damageId: string;
  /**
   * The image details of the new image represented by this View.
   */
  newImage?: ViewImage;
  /**
   * The ID of the image this View was created from.
   */
  imageId?: string;
  /**
   * Polygons drawn on the image if there are any.
   */
  polygons?: Polygon[];
  /**
   * The bounding box of the View, corresponding to the coordinates of the new image in the original image.
   */
  boundingBox?: BoundingBox;
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
  distance?: number;
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
   * The ID of the inspection associated with this image.
   */
  inspectionId: string;
  /**
   * The URL at which the image can be downloaded.
   */
  url: string;
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
   * The views created using this image.
   */
  views: View[];
  /**
   * The type of the image.
   */
  type?: ImageType;
  /**
   * The subtype of the image.
   */
  subtype?: ImageSubtype;
  /**
   * The ID of the results of the wheel analysis performed on this image if there was one.
   */
  wheelAnalysis?: string;
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
   * Additional data added during the upload of the image.
   */
  additionalData?: AdditionalData;
}
