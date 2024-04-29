/**
 * Enumeration of the names of the tasks available in the Monk API.
 */
import { ProgressStatus } from './common';
import { MonkEntity, MonkEntityType } from './entity';

export enum TaskName {
  /**
   * Vehicle pictures analysis executed in order to detect damages on the vehicle.
   */
  DAMAGE_DETECTION = 'damage_detection',
  /**
   * Wheel pictures analysis executed in order to output information on the wheel.
   */
  WHEEL_ANALYSIS = 'wheel_analysis',
  /**
   * Estimation of the types of reparations needed to repair damages on a vehicle.
   */
  REPAIR_ESTIMATE = 'repair_estimate',
  /**
   * Optical character recognition performed on inspection images in order to output text written on the pictures.
   */
  IMAGES_OCR = 'images_ocr',
  /**
   * Image editing (background removal etc.).
   */
  IMAGE_EDITING = 'image_editing',
  /**
   * Generation of an inspection report as a PDF file.
   */
  INSPECTION_PDF = 'inspection_pdf',
  /**
   * Estimation of the cost of reparations needed to repair damages on a vehicle.
   */
  PRICING = 'pricing',
  /**
   * Optical character recognition performed on images of vehicle dashboards in order to output information available on
   * the dashboard (car mileage etc.)
   */
  DASHBOARD_OCR = 'dashboard_ocr',
  /**
   * Compliance checks like image quality, car coverage etc. You don't have to add this task to your inspection or to
   * your images, it is added by default when adding the dammage detection task. However, you can specify this task if
   * you want to specify additional options used to configure how the compliance is executed (like specifying the
   * sight_id of the image for instance).
   */
  COMPLIANCES = 'compliances',
}

/**
 * A task executed by the Monk backend during an inspection.
 */
export interface Task extends MonkEntity {
  /**
   * The type of the entity.
   */
  entityType: MonkEntityType.TASK;
  /**
   * The ID of the inspection associated with this task.
   */
  inspectionId: string;
  /**
   * The name of the tasl.
   */
  name: TaskName;
  /**
   * The progress status of the task.
   */
  status: ProgressStatus;
  /**
   * The IDs of the images on which the task is being performed.
   */
  images: string[];
}
