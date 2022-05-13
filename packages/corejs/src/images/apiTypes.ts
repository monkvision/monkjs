import { CenterOnElement, DamageArea } from '../damageAreas/entityTypes';
import {
  CoreJsResponse,
  CoreJsResponseWithId,
  IdResponse,
  PaginatedResponse,
  PaginationParams,
  ReponseWithInspectionId,
} from '../sharedTypes';
import {
  DamageDetectionTaskImageDetails,
  ImageOCRTaskImageDetails,
  TaskName,
  WheelAnalysisDetails,
} from '../tasks/entityTypes';
import { Image } from './entityTypes';

/**
 * The details of an image when fetching it by its id.
 *
 * *Swagger Schema Reference :* `ImageGetSingle`
 */
export type ImageDetails = Pick<
Image,
'id' | 'path' | 'name' | 'imageHeight' | 'imageWidth' | 'binarySize' | 'mimetype' | 'compliances'
>;

/**
 * Options used when fetching a single image.
 */
export interface GetOneImageOptions {
  /**
   * Set to `true` to include deleted data about the image.
   * @default false
   */
  showDeletedObjects?: boolean;
}

/**
 * The type returned by the getOneImage method.
 */
export type GetOneImageResponse = CoreJsResponseWithId<ImageDetails, string, 'id'> & ReponseWithInspectionId;

/**
 * Options used when fetching multiple images.
 */
export type GetManyImagesOptions = PaginationParams;

/**
 * The type returned by the getManyImages method.
 */
export type GetManyImagesResponse = CoreJsResponse<PaginatedResponse<ImageDetails>, string[]> & ReponseWithInspectionId;

/**
 * The details of an image returned after creating it.
 */
export type CreatedImage = Pick<Image, 'id' | 'name'>;

/**
 * The type returned by the addOneImage method.
 */
export type AddOneImageResponse = CoreJsResponseWithId<IdResponse<'id'>, string, 'id'> & ReponseWithInspectionId;

/**
 * The model used to create a new image, whether it is at the creation of the inspection or later, by adding an new
 * image to an inspection already created.
 *
 * *Swagger Schema References :* `ImagePost` & `ImagePostSingle`
 */
export interface CreateImage {
  /**
   * The tasks to execute on this image and how to execute them.
   */
  tasks: CreateImageTask[];
  /**
   * The method that can be used to acquire the image.
   */
  acquisition: ImageAcquisition;
  /**
   * The name of the image.
   */
  name?: string;
  /**
   * An optional image rotation applied before retreiving it.
   */
  rotateImageBeforeUpload?: ImageRotation;
  /**
   * The view point at which the image has been taken.
   */
  detailedViewpoint?: string | Viewpoint;
  /**
   * The damage area of the image.
   */
  damageArea?: number | string | DamageArea;
  /**
   * The compliance parameters used when evaluating the image compliance.
   */
  compliances?: Compliance;
  /**
   * Additional data attached to the image.
   */
  additionalData?: unknown;
}

/**
 * This type represent a task that can be attached to an image when creating it to indicate that this task should be
 * run on this image.
 *
 * *Swagger Schema References :* `ImageDamageTaskPost` & `ImageOcrTaskPost` & `WheelAnalysisPost`
 * & `NoParametersTaskName`
 */
export type CreateImageTask = NoParametersImageTaskName | CreateImageTaskWithParams;

/**
 * The name of the tasks that can be attached ot an image without any parameter.
 *
 * *Swagger Schema Reference :* `NoParametersTaskName`
 */
export type NoParametersImageTaskName = TaskName.WHEEL_ANALYSIS | TaskName.DAMAGE_DETECTION | TaskName.REPAIR_ESTIMATE;

/**
 * An object describing a task and its parameters attached to an image to be executed.
 *
 * *Swagger Schema References :* `ImageDamageTaskPost` & `ImageOcrTaskPost` & `WheelAnalysisPost`
 */
export type CreateImageTaskWithParams
  = CreateImageWheelTaskWithParams | CreateImageOcrTaskWithParams | CreateImageDamageTaskWithParams;

/**
 * The task wheel analysis and its parameters attached to an image when creating it.
 *
 * *Swagger Schema Reference :* `WheelAnalysisPost`
 */
export interface CreateImageWheelTaskWithParams {
  /**
   * The name of the task.
   */
  name: TaskName.WHEEL_ANALYSIS,
  /**
   * The details of the wheel analysis task and how it must be executed.
   */
  imageDetails?: WheelAnalysisDetails,
}

/**
 * The task image OCR and its parameters attached to an image when creating it.
 *
 * *Swagger Schema Reference :* `ImageOcrTaskPost`
 */
export interface CreateImageOcrTaskWithParams {
  /**
   * The name of the task.
   */
  name: TaskName.IMAGES_OCR,
  /**
   * The details of the image OCR task and how it must be executed.
   */
  imageDetails?: ImageOCRTaskImageDetails,
}

/**
 * The task damage detection and its parameters attached to an image when creating it.
 *
 * *Swagger Schema Reference :* `ImageDamageTaskPost`
 */
export interface CreateImageDamageTaskWithParams {
  /**
   * The name of the task.
   */
  name: TaskName.DAMAGE_DETECTION,
  /**
   * The details of the damage detection task and how it must be executed.
   */
  imageDetails?: DamageDetectionTaskImageDetails,
}

/**
 * Object describing the details on how an image can be acquired.
 *
 * *Swagger Schema References :* `AcquisitionUrl` & `AcquisitionForm`
 */
export type ImageAcquisition = ImageAcquisitionUrl | ImageAcquisitionForm;

/**
 * The different ways an image can be acquired.
 */
export enum ImageAcquisitionStrategy {
  /**
   * The image can be downloaded from a given URL.
   */
  DOWNLOAD_FROM_URL = 'download_from_url',
  /**
   * The image has been uploaded as a multipart form keys.
   */
  UPLOAD_MULTIPART_FORM_KEYS = 'upload_multipart_form_keys',
}

/**
 * Object describing the details on how an image can be acquired. This type is for when an image can be downloaded from
 * a given URL.
 *
 * *Swagger Schema Reference :* `AcquisitionUrl`
 */
export interface ImageAcquisitionUrl {
  /**
   * The strategy needed to acquire the image. In this case it is via a URL download.
   */
  strategy: ImageAcquisitionStrategy.DOWNLOAD_FROM_URL;
  /**
   * The URL at which the image can be downloaded.
   */
  url: string;
}

/**
 * Object describing the details on how an image can be acquired. This type is for when an image has been uploaded as a
 * multipart form keys.
 *
 * *Swagger Schema Reference :* `AcquisitionForm`
 */
export interface ImageAcquisitionForm {
  /**
   * The strategy needed to acquire the image. In this case it is as a multipart form keys/
   */
  strategy: ImageAcquisitionStrategy.UPLOAD_MULTIPART_FORM_KEYS;
  /**
   * The form key with which the image can be retreived.
   */
  fileKey?: string;
}

/**
 * The different rotations that can be applied to an image when acquiring it.
 *
 * *Swagger Schema Reference :* `ImageRotation`
 */
export enum ImageRotation {
  /**
   * Apply no rotation to the image.
   */
  NO_ROTATION = 'NO_ROTATION',
  /**
   * Apply a 90 degrees clockwise rotation to the image.
   */
  CLOCKWISE_90 = 'CLOCKWISE_90',
  /**
   * Apply a 180 degrees clockwise rotation to the image.
   */
  CLOCKWISE_180 = 'CLOCKWISE_180',
  /**
   * Apply a 270 degrees clockwise rotation to the image.
   */
  CLOCKWISE_270 = 'CLOCKWISE_270',
}

/**
 * The viewpoint of an image.
 *
 * *Swagger Schema Reference :* `Viewpoint`
 */
export interface Viewpoint {
  /**
   * Boolean indicating if the viewpoint is located at the exterior of the car.
   */
  isExterior?: boolean;
  /**
   * The car part displayed at the center of the viewpoint.
   */
  centersOn?: CenterOnElement;
  /**
   * The distance from the car.
   */
  distance?: string;
}

/**
 * The compliance parameters used when evaluating the image compliance.
 *
 * *Swagger Schema Reference :* `Compliance`
 */
export interface Compliance {
  imageQualityAssessment?: ComplianceParameters;
  coverage360?: Coverage360Parameters;
}

/**
 * The compliance parameters used when evaluating the image compliance to the image quality standards.
 *
 * TODO : Define this type.
 *
 * *Swagger Schema Reference :* `ComplianceParameters`
 */
export type ComplianceParameters = unknown;

/**
 * The compliance parameters used for the coverage 360.
 *
 * *Swagger Schema Reference :* `Coverage360Parameters`
 */
export interface Coverage360Parameters {
  sightId?: Coverage360SightId;
}

/**
 * The different ids for the coverage 360 sights.
 */
export type Coverage360SightId = 'IqwSM3'
| 'rSvk2C'
| 'rj5mhm'
| 'qhKA2z'
| 'sLu0CfOt'
| 'xsuH1g5T'
| 'IzMR_OzQ'
| 'AEc967h1'
| '3vKXafwc'
| '3a3OheoD'
| 'ClEZSucK'
| 'zjAIjUgU'
| 'vLcBGkeh'
| 'PLh198NC'
| 'LE9h1xh0'
| 'IVcF1dOP'
| 'GvCtVnoD'
| 'GHbWVnMB'
| 'XyeyZlaU'
| 'oIk8RQ3w'
| 'm1rhrZ88'
| '36qmcrgr'
| 'eOkUJUBk'
| 'RMeCZRbd'
| 'dQOmxo13'
| 'xfbBpq3Q'
| 'j8YHvnDP'
| '8_W2PO8L'
| 'xQKQ0bXS'
| 'UHZkpCuK'
| 'VmFL3v2A'
| '1-gwCM0m'
| 'T24v9XS8'
| 'GOQq1-nN'
| 'D4r9OKHt'
| 'OOJDJ7go'
| 'Fh972HlF'
| 'jgB-cu5G'
| '0U14gFyk'
| 'Cce1KCd3'
| 'QqBpHiVP'
| 'Pzgw0WGe'
| 'jqJOb6Ov'
| 'EqLDVYj3'
| 'j3E2UHFc'
| 'AoO-nOoM'
| 'WWZsroCu'
| 'CELBsvYD'
| 'PuIw17h0'
| 'LDRoAPnk'
| 'rN39Y3HR'
| 'B5s1CWT-'
| 'eWZsEThb'
| 'au5yyzOT'
| '2RFF3Uf8'
| 'TDLex8-D'
| '6MR5C13s'
| 'QJ_yOnBl'
| '2wVqenwP'
| 'enHQTFae'
| 'vxRr9chD'
| 'g30kyiVH'
| 'cDe2q69X'
| 'WKJlxkiF'
| '5CFsFvj7'
| 'I0cOpT1e'
| 'R_f4g8MN'
| 'fDKWkHHp'
| 'vedHBC2n'
| '7bTC-nGS'
| 'hhCBI9oZ'
| 'e_QIW30o'
| 'McR3TJK0'
| 'fDo5M0Fp';
