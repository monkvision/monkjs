import { Damage } from '../damages/entityTypes';
import { Image } from '../images/entityTypes';
import { Part } from '../parts/entityTypes';
import { ImageOcrType, Task } from '../tasks/entityTypes';
import { MarketValue, Mileage, Vehicle } from '../vehicles/entityTypes';
import { WheelAnalysis } from '../wheelAnalysis/entityTypes';

interface InspectionWithoutRelations {
  /**
   * The id (uuid) of the inspection entity.
   */
  id: string;
  /**
   * The id (uuid) of the user that this inspection belongs to.
   */
  ownerId?: string;
  /**
   * Creation date of the inspection entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the inspection entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The id (uuid) of the user that created this inspection.
   */
  creatorId?: string;
  /**
   * The date at which this inspection has been signed.
   */
  signatureDate?: string;
  /**
   * The type of inspection.
   */
  inspectionType?: InspectionType;
  /**
   * The nature of the accident.
   */
  accidentNature?: string;
  /**
   * The id (uuid) of the other inspection this one is related to (if there is one).
   */
  relatedInspectionId?: string;
  /**
   * The documents that have been scanned by OCR during this inspection.
   */
  documents: Document[];
  /**
   * The results of the damage severity analysis.
   */
  severityResults: SeverityResult[];
  /**
   * Optional additional data attached to the inspection entity.
   */
  additionalData?: InspectionAdditionalData;
  /**
   * TODO : Label this field.
   */
  usageDuration?: number;
}

/**
 * Application entity representing a vehicle condition inspection.
 */
export interface Inspection extends InspectionWithoutRelations {
  /**
   * The vehicle being inspected in this inspection.
   */
  vehicle?: Vehicle;
  /**
   * The images attached to the inspection.
   */
  images: Image[];
  /**
   * The damages detected during this inspection.
   */
  damages: Damage[];
  /**
   * The tasks executed in this inspection.
   */
  tasks: Task[];
  /**
   * The car parts recognized in this inspection.
   */
  parts: Part[];
  /**
   * The results of the analysis of the car wheels.
   */
  wheelAnalysis: WheelAnalysis[];
}

/**
 * Normalized application entity representing a vehicle condition inspection.
 */
export interface NormalizedInspection extends InspectionWithoutRelations {
  /**
   * The id (uuid) of the vehicle being inspected in this inspection.
   */
  vehicle?: string;
  /**
   * The ids (uuids) of the images attached to the inspection.
   */
  images: string[];
  /**
   * The ids (uuids) of the damages detected during this inspection.
   */
  damages: string[];
  /**
   * The ids (uuids) of the tasks executed in this inspection.
   */
  tasks: string[];
  /**
   * The ids (uuids) of the car parts recognized in this inspection.
   */
  parts: string[];
  /**
   * The ids (uuids) of the results of the analysis of the car wheels.
   */
  wheelAnalysis: string[];
}

/**
 * An official document, scanned via OCR and attached to an inspection.
 *
 * *Swagger Schema Reference :* `Document`
 */
export interface Document {
  /**
   * The id (uuid) of the document entity.
   */
  id: string;
  /**
   * Creation date of the document entity, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * Deletion date of the document entity (if it has been deleted), in the ISO 8601 format.
   */
  deletedAt?: string;
  /**
   * The id (uuid) of the inspection entity this document belongs to.
   */
  inspectionId?: string;
  /**
   * The type of document scanned by OCR.
   */
  type: ImageOcrType;
  /**
   * Optional additional data attached to the document entity.
   */
  additionalData?: unknown;
  /**
   * The content of the document.
   */
  content?: unknown;
}

/**
 * Status of an inspection.
 *
 * *Swagger Schema Reference :* `InspectionStatus`
 */
export enum InspectionStatus {
  /**
   * Indicates that the inspection has not been started by the server and is waiting for more data.
   */
  NOT_STARTED = 'NOT_STARTED',
  /**
   * Indicates that the server has started processing the inspection,
   */
  IN_PROGRESS = 'IN_PROGRESS',
  /**
   * Indicates that the server has successfully completed the inspection.
   */
  DONE = 'DONE',
  /**
   * Indicates that an error occurred during the inspection.
   */
  ERROR = 'ERROR',
  /**
   * Indicates that the server has successfully completed the inspection and that an external resource has validated the
   * inspection.
   */
  VALIDATED = 'VALIDATED',
}

/**
 * The different types of inspection.
 *
 * *Swagger Schema Reference :* `InspectionType`
 */
export enum InspectionType {
  /**
   * The claiming of a car.
   */
  CLAIM = 'claim',
  /**
   * Inspection of the car condition during a check in or check out (renting etc...).
   */
  CHECK_IN_CHECK_OUT = 'check_in_check_out',
}

/**
 * The results of a damage severity analysis.
 *
 * *Swagger Schema Reference :* `SeverityResult`
 */
export interface SeverityResult {
  /**
   * The id (uuid) of the element analysed.
   */
  elementUid?: string;
  /**
   * The type of element analysed.
   */
  elementType?: 'part' | 'damage';
  /**
   * TODO : Label this field (and define its type ?).
   */
  customSeverity?: unknown;
  /**
   * TODO : Label this field (and define its type ?).
   */
  severity?: unknown;
}

/**
 * Optional additional data attached to an inspection entity.
 *
 * *Swagger Schema Reference :* `InspectionAdditionalData`
 */
export interface InspectionAdditionalData {
  /**
   * Known properties added to the inspection pdf.
   */
  pdfData?: PdfInputData,
  /**
   * Additional info.
   */
  [k: string]: unknown,
}

/**
 * Input data used to add (or update) the data that is stored in the additional_data field of an inspection
 *
 * *Swagger Schema Reference :* `PdfInputData`
 */
export interface PdfInputData {
  /**
   * The mileage of the vehicle being inspected.
   */
  mileage?: Mileage;
  /**
   * The market value of the vehicle being inspected.
   */
  marketValue?: MarketValue;
  /**
   * The first name of the agent doing the inspection.
   */
  agentFirstName?: string;
  /**
   * The last name of the agent doing the inspection.
   */
  agentLastName?: string;
  /**
   * The name of the company of the agent doing the inspection.
   */
  agentCompany?: string;
  /**
   * The city name of the company of the agent doing the inspection.
   */
  agentCompanyCity?: string;
  /**
   * The first name of the vehicle owner.
   */
  vehicleOwnerFirstName?: string;
  /**
   * The last name of the vehicle owner.
   */
  vehicleOwnerLastName?: string;
  /**
   * The address of the vehicle owner.
   */
  vehicleOwnerAddress?: string;
  /**
   * The phone number of the vehicle owner.
   */
  vehicleOwnerPhone?: string;
  /**
   * The email address of the vehicle owner.
   */
  vehicleOwnerEmail?: string;
  /**
   * The start date of the inspection.
   */
  dateOfStart?: string;
  /**
   * The validation date of the inspection.
   */
  dateOfValidation?: string;
  /**
   * The VIN number of the vehicle being inspected or another identifier such as the registration plate.
   */
  vinOrRegistering?: string;
  /**
   * Additional comment.
   */
  comment?: string;
}
