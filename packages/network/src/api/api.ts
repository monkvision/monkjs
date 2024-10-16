import { getInspection, createInspection, updateAdditionalData } from './inspection';
import { addImage } from './image';
import { startInspectionTasks, updateTaskStatus } from './task';
import { getLiveConfig } from './liveConfigs';
import { updateInspectionVehicle } from './vehicle';
import { createPricing, deletePricing, updatePricing } from './pricing';

/**
 * Object regrouping the different API requests available to communicate with the API using the `@monkvision/network`
 * package.
 */
export const MonkApi = {
  getInspection,
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
};
