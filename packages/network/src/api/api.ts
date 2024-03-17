import { getInspection, createInspection } from './inspection';
import { addImage } from './image';
import { startInspectionTasks, updateTaskStatus } from './task';

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
};
