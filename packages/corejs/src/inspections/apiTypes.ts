import { DamageArea } from '../damageAreas/entityTypes';
import { CreateImage } from '../images/apiTypes';
import {
  Callback,
  CoreJsResponse,
  CoreJsResponseWithId,
  IdResponse,
  OwnershipFilter,
  PaginatedResponse,
  PaginationParams,
  ProgressStatusUpdate,
} from '../sharedTypes';
import { CreateUpdateVehicle } from '../vehicles/apiTypes';
import { Inspection, InspectionAdditionalData, InspectionStatus, InspectionType } from './entityTypes';

/**
 * Options used when fetching one inspection.
 */
export interface GetOneInspectionOptions {
  /**
   * Set to `true` to include deleted data about the inspection (such as deleted tasks).
   * @default false
   */
  showDeletedObjects?: boolean;
}

/**
 * The type returned by the getOneInspection method.
 */
export type GetOneInspectionResponse = CoreJsResponseWithId<Inspection, string, 'id'>;

/**
 * Options used when fetching multiple inspections.
 */
export interface GetManyInspectionsOptions extends PaginationParams {
  /**
   * Filter by the inspections ownership,
   * @default OwnershipFilter.OWN_RESOURCES
   */
  ownershipFilter?: OwnershipFilter,
  /**
   * Filter by the inspections status,
   */
  inspectionStatus?: InspectionStatus,
  /**
   * Set to `true` to include deleted inspections.
   * @default true
   */
  showDeleted?: boolean,
  /**
   * The amount of detailed returned by the API call.
   * @default 0
   */
  verbose?: number,
}

/**
 * The type returned by the getManyInspections method.
 */
export type GetManyInspectionsResponse = CoreJsResponse<InspectionPaginatedResponse, string[]>;

/**
 * The paginated response containing a list of inspections that is returned when calling the getManyInspections method.
 *
 * *Swagger Schema Reference :* `PaginatedResponse[Union[InspectionSummaryVerbose, InspectionSummaryBase]]`
 */
export type InspectionPaginatedResponse = PaginatedResponse<InspectionSummary | InspectionSummaryVerbose>;

/**
 * The type of each element fetched by the getManyInspection method.
 *
 * *Swagger Schema Reference :* `InspectionSummaryBase`
 */
export type InspectionSummary = Pick<
Inspection,
'id' | 'additionalData' | 'createdAt' | 'deletedAt' | 'images' | 'ownerId' | 'creatorId'
>;

/**
 * The type of each element fetched by the getManyInspection method when using the verbose option.
 *
 * *Swagger Schema Reference :* `InspectionSummaryVerbose`
 */
export type InspectionSummaryVerbose = InspectionSummary & Pick<
Inspection,
'damages' | 'vehicle'
>;

/**
 * The model used to create a new inspection.
 *
 * *Swagger Schema Reference :* `InspectionPost`
 */
export interface CreateInspection {
  /**
   * The tasks to add to the inspection.
   */
  tasks: CreateInspectionTasksOptions;
  /**
   * Information about the vehicle inspected.
   */
  vehicle?: CreateUpdateVehicle;
  /**
   * Images to add to the inspection.
   */
  images?: CreateImage[];
  /**
   * Damage areas to add at the start of the inspection.
   */
  damageAreas?: DamageArea[];
  /**
   * The type of inspection to create.
   */
  inspectionType?: InspectionType;
  /**
   * Additional data about the inspection.
   */
  additionalData?: InspectionAdditionalData;
  /**
   * The nature of the accident (if known).
   */
  accidentNature?: string;
  /**
   * The id (uuid) of the related inspection entity if there is one.
   */
  relatedInspectionId?: string;
  /**
   * TODO : Label this field.
   */
  usageDuration?: number;
}

/**
 * The model used to describe the tasks to add to an inspection when creating a new one with the API.
 *
 * *Swagger Schema Reference :* `TasksPost`
 */
export interface CreateInspectionTasksOptions {
  /**
   * Options used to add a wheel analysis task to the new inspection.
   */
  wheelAnalysis?: WheelAnalysisTaskOptions;
  /**
   * Options used to add a repair estimate task to the new inspection.
   */
  repairEstimate?: RepairEstimateTaskOptions;
  /**
   * Options used to add an image OCR task to the new inspection.
   */
  imagesOcr?: ImagesOCRTaskOptions;
  /**
   * Options used to add a damage detection task to the new inspection.
   */
  damageDetection?: DamageDetectionTaskOptions;
}

/**
 * The model used to describe a wheel analysis task to add to an inspection when creating a new one with the API. The
 * wheel analysis task will perform a specialized damage detection task on wheels.
 *
 * *Swagger Schema Reference :* `WheelAnalysisTaskPost`
 */
export interface WheelAnalysisTaskOptions {
  /**
   * The status of the wheel analysis task at the creation of the inspection.
   */
  status?: ProgressStatusUpdate;
  /**
   * Callbacks made when the wheel analysis task will be complete (or will crash with an error).
   */
  callbacks?: Callback[];
}

/**
 * The model used to describe a repair estimate task to add to an inspection when creating a new one with the API. The
 * repair estimate task will analyze the damaged parts of the car and estimate and breakdown the cost for repairing the
 * vehicle.
 *
 * *Swagger Schema Reference :* `RepairEstimateTaskPost`
 */
export interface RepairEstimateTaskOptions {
  /**
   * The status of the repair estimate task at the creation of the inspection.
   */
  status?: ProgressStatusUpdate;
  /**
   * Callbacks made when the repair estimate task will be complete (or will crash with an error).
   */
  callbacks?: Callback[];
  /**
   * TODO : Label this field.
   */
  usePricingMatrix?: unknown;
}

/**
 * The model used to describe a wheel analysis task to add to an inspection when creating a new one with the API. The
 * OCR task will do OCR on the document to extract useful data.
 *
 * *Swagger Schema Reference :* `ImagesOCRTaskPost`
 */
export interface ImagesOCRTaskOptions {
  /**
   * The status of the image OCR task at the creation of the inspection.
   */
  status?: ProgressStatusUpdate;
  /**
   * Callbacks made when the image OCR task will be complete (or will crash with an error).
   */
  callbacks?: Callback[];
}

/**
 * The model used to describe a damage detection task to add to an inspection when creating a new one with the API. The
 * main damage detection task will detect damages and localize them on parts of the vehicle.
 *
 * *Swagger Schema Reference :* `DamageDetectionTaskPost`
 */
export interface DamageDetectionTaskOptions {
  /**
   * The status of the task at the creation of the inspection.
   */
  status?: ProgressStatusUpdate;
  /**
   * The threshold for the damage score value above which the inspection will consider it as a damage.
   */
  damageScoreThreshold?: number;
  /**
   * Callbacks made when the damage inspection task will be complete (or will crash with an error).
   */
  callbacks?: Callback[];
  /**
   * Options to generate views (cropped images) of car parts.
   */
  generateSubimagesParts?: GenerateSubImages;
  /**
   * Options to generate views (cropped images) of detected damages.
   */
  generateSubimagesDamages?: GenerateSubImages;
  /**
   * Options to generate pictures with algorihm output (predicted parts or damages) rendered on it.
   */
  generateVisualOutput?: GenerateVisualOutput;
  /**
   * Options to specify how the damage severity will be displayed.
   */
  damageSeverity?: DamageSeverity;
  /**
   * @experimental
   *
   * Options to generate a score the state of the vehicle.
   */
  scoring?: Scoring;
}

/**
 * Options that can be specified when creating a new inspection with a damage detection task to generate views (cropped
 * images) of detected damage instances.
 *
 * *Swagger Schema Reference :* `GenerateSubImages`
 */
export interface GenerateSubImages {
  /**
   * TODO : label this field.
   */
  generateTight?: boolean;
  /**
   * TODO : label this field.
   */
  margin?: number;
  /**
   * TODO : label this field.
   */
  damageViewPartInterpolation?: number;
  /**
   * TODO : label this field.
   */
  ratio?: number;
  /**
   * TODO : label this field.
   */
  quality?: number;
}

/**
 * Options that can be specified when creating a new inspection with a damage detection task to generate pictures with
 * algorihm output (predicted parts or damages) rendered on it.
 *
 * *Swagger Schema Reference :* `GenerateVisualOutput`
 */
export interface GenerateVisualOutput {
  /**
   * Generate a visual output for the car parts.
   */
  generateParts?: boolean;
  /**
   * Generate a visual output for the detected damages.
   */
  generateDamages?: boolean;
}

/**
 * @experimental
 *
 * Options that can be specified when creating a new inspection with a damage detection task to generate a score the
 * state of the vehicle.
 *
 * TODO : Define this type.
 *
 * *Swagger Schema Reference :* `Scoring`
 */
export type Scoring = unknown;

/**
 * Options that can be specified when creating a new inspection with a damage detection task to specify how the damage
 * severity will be displayed.
 *
 * *Swagger Schema Reference :* `DamageSeverity`
 */
export interface DamageSeverity {
  /**
   * The format of the output of the damage severity.
   */
  outputFormat?: string;
}

/**
 * The type returned by the createOneInspection method.
 */
export type CreateOneInspectionResponse = CoreJsResponseWithId<IdResponse<'id'>, string, 'id'>;

/**
 * The details of an inspection returned after creating it.
 */
export type CreatedInspection = Pick<
Inspection,
'id' | 'createdAt' | 'inspectionType' | 'accidentNature' | 'relatedInspectionId' | 'additionalData' | 'usageDuration'
>;

/**
 * The type returned by the addAdditionalDataToOneInspection method.
 */
export type AddAdditionalInfoResponse = CoreJsResponseWithId<IdResponse<'id'>, string, 'id'>;

/**
 * The details of an inspection returned after adding additional data to it.
 */
export type AdditionalInfoAddedToInspection = Pick<Inspection, 'id' | 'additionalData'>;

/**
 * The type returned by the deleteOneInspection method.
 */
export type DeleteOneInspectionResponse = CoreJsResponseWithId<IdResponse<'id'>, string, 'id'>;
