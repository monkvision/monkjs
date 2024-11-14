import {
  getInspection,
  createInspection,
  updateAdditionalData,
  getInspections,
} from './inspection';
import { addImage } from './image';
import { startInspectionTasks, updateTaskStatus } from './task';
import { getLiveConfig } from './liveConfigs';
import { updateInspectionVehicle } from './vehicle';
import { createPricing, deletePricing, updatePricing } from './pricing';
import { createDamage, deleteDamage } from './damage';

/**
 * Object regrouping the different API requests available to communicate with the API using the `@monkvision/network`
 * package.
 */
export const MonkApi = {
  getInspection,
  getInspections,
  createInspection,
  addImage,
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
};
