import { DamageArea } from '../damageAreas/entityTypes';
import { ProgressStatus } from '../sharedTypes/progressStatus';
import { RenderedOutput, View } from '../views/entityTypes';
import { LabelPrediction, WheelAnalysis } from '../wheelAnalysis/entityTypes';

interface ImageEntityWithoutRelations {
  /**
   * The id (uuid) of the image entity.
   */
  id: string;
  /**
   * The path (cloud url) to fetch the image.
   */
  path: string;
  /**
   * The MIME Type of the image.
   */
  mimetype: string;
  /**
   * The name of the image.
   */
  name?: string;
  /**
   * The height of the image (integer, in pixels).
   */
  imageHeight?: number;
  /**
   * The width of the image (integer, in pixels).
   */
  imageWidth?: number;
  /**
   * The size of the image (integer, in bytes).
   */
  binarySize?: number;
  /**
   * The result of the compliance test made to verify if the image respects certain rules like blurriness etc...
   */
  compliances?: ComplianceResults;
  /**
   * The view point prediction of the image.
   */
  viewpoint?: LabelPrediction;
  /**
   * The rendered outputs of the image.
   */
  renderedOutputs?: RenderedOutput[];
  /**
   * Boolean indicating whether this image has a vehicle in it or not.
   */
  hasVehicle?: boolean;
  /**
   * The wheel analysis of the image if there is one.
   * Note : This is NOT a relation stored in the redux state.
   */
  wheelAnalsis?: WheelAnalysis;
  /**
   * Additional data attached to the image.
   */
  additionalData?: unknown;
}

/**
 * Application entity representing an image submitted to an inspection.
 */
export interface Image extends ImageEntityWithoutRelations {
  /**
   * The view(s) of the damage present in this image.
   */
  views: View[],
  /**
   * The area(s) present in this image and containing visible damage.
   */
  damageArea?: DamageArea,
}

/**
 * Normalized application entity representing an image submitted to an inspection.
 */
export interface NormalizedImage extends ImageEntityWithoutRelations {
  /**
   * The ids (uuids) of the view(s) of the damage present in this image.
   */
  views: string[],
  /**
   * The id (uuid) of the area present in this image and containing visible damage.
   */
  damageArea?: string,
}

/**
 * Results of the compliance test made to verify if the image respects certain rules like blurriness etc...
 *
 * *Swagger Schema Reference :* `ComplianceResults`
 */
export interface ComplianceResults {
  /**
   * Results indicating if the image is compliant towards the image quality standards (blurriness, exposure etc...).
   */
  imageQualityAssessment?: IQAComplianceResult;
  /**
   * Results indicating if the image is compliant towards the coverage360 standards (ex : are all the car parts that
   * should be displayed in the picture actually visible in the picture ?).
   */
  coverage360?: ComplianceResult;
}

/**
 * Results indicating if the image is compliant towards the image quality standards (blurriness, exposure etc...).
 *
 * *Swagger Schema Reference :* `IQAComplianceResult`
 */
export interface IQAComplianceResult {
  /**
   * Indicates if the image is compliant or not.
   */
  isCompliant?: boolean;
  /**
   * The current status of the compliance test.
   */
  status?: ProgressStatus;
  /**
   * The precise score obtained by an image during the image quality compliance test.
   */
  details?: ComplianceDetails;
  /**
   * TODO : Label this field (and define its type ?).
   */
  reasons?: unknown;
  /**
   * TODO : Label this field (and define its type ?).
   */
  parameters?: unknown;
}

/**
 * The precise score obtained by an image during the image quality compliance test.
 *
 * *Swagger Schema Reference :* `ComplianceDetails`
 */
export interface ComplianceDetails {
  /**
   * Blurriness value between 0 and 1
   */
  blurrinessScore?: number;
  /**
   * Underexposure value between 0 and 1
   */
  underexposureScore?: number;
  /**
   * Overexposure value between 0 and 1
   */
  overexposureScore?: number;
}

/**
 * Results indicating if the image is compliant towards the coverage360 standards (ex : are all the car parts that
 * should be displayed in the picture actually visible in the picture ?).
 *
 * *Swagger Schema Reference :* `ComplianceResult`
 */
export interface ComplianceResult {
  /**
   * The current status of the compliance test.
   */
  status: ProgressStatus;
  /**
   * Indicates if the image is compliant or not.
   */
  isCompliant?: boolean;
  /**
   * TODO : Label this field (and define its type ?).
   */
  reasons?: unknown;
  /**
   * TODO : Label this field (and define its type ?).
   */
  parameters?: unknown;
}
