import { AdditionalData } from './common';
import { MonkEntity, MonkEntityType } from './entity';
import { WheelAnalysis } from './wheelAnalysis';

/**
 * A Monk inspection is an entity representing the status of a vehicle analysis. Users of the Monk SDK can take and send
 * pictures of a vehicle to Monk's API in order to analyse these pictures and run various tasks such as damage detection
 * etc.
 */
export interface Inspection extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.INSPECTION;
  /**
   * The IDs of the tasks executed in this inspection.
   */
  tasks: string[];
  /**
   * The IDs of the images taken and uploaded by the user in this inspection.
   */
  images: string[];
  /**
   * The IDs of the damages detected in this inspection.
   */
  damages: string[];
  /**
   * The IDs of the vehicle parts detected in this inspection.
   */
  parts: string[];
  /**
   * The ID of the vehicle of the inspection.
   */
  vehicle?: string;
  /**
   * The IDs of the results of the wheel analysis performed on the inspeciton images if the task was performed.
   */
  wheelAnalysis?: WheelAnalysis[];
  /**
   * The IDs of the severity results (= damparts) in the inspection if they were generated.
   */
  severityResults?: string[];
  /**
   * The details about the cost of the vehicle reparations using the PricingV2 API if it was requested.
   */
  pricings?: string[];
  /**
   * The URL of the PDF report generated for this inspection.
   */
  pdfUrl?: string;
  /**
   * The type of inspection to create.
   */
  type?: string;
  /**
   * Additional data added during the creation of the inspection.
   */
  additionalData?: AdditionalData;
}
