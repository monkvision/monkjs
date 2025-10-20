import {
  getInspection,
  createInspection,
  updateAdditionalData,
  getAllInspections,
  getAllInspectionsCount,
} from './inspection';
import { addImage, deleteImage } from './image';
import { startInspectionTasks, updateTaskStatus } from './task';
import { getLiveConfig } from './liveConfigs';
import { updateInspectionVehicle } from './vehicle';
import { createPricing, deletePricing, updatePricing } from './pricing';
import { createDamage, deleteDamage } from './damage';
import { getPdf, uploadPdf } from './pdf';

/**
 * Object regrouping the different API requests available to communicate with the API using the `@monkvision/network`
 * package.
 */
export const MonkApi = {
  getInspection,
  getAllInspections,
  getAllInspectionsCount,
  createInspection,
  addImage,
  deleteImage,
  updateTaskStatus,
  startInspectionTasks,
  getLiveConfig,
  updateInspectionVehicle,
  updateAdditionalData,
  createPricing,
  deletePricing,
  updatePricing,
  createDamage,
  deleteDamage,
  uploadPdf,
  getPdf,
};
