import * as damagesSlice from './damages/damageSlice';
import * as inspectionsSlice from './inspections/inspectionsSlice';
import * as imagesSlice from './images/imagesSlice';
import * as tasksSlice from './tasks/tasksSlice';

export { default as values } from './values';
export { default as Sight } from './sights/Sight';

// INSPECTIONS

export const {
  default: inspections,
  inspectionsAdapter,
  getOneInspectionById,
  getAllInspections,
  createOneInspection,
} = inspectionsSlice;

export const {
  selectById: selectInspectionById,
  selectIds: selectInspectionIds,
  selectEntities: selectInspectionEntities,
  selectAll: selectAllInspections,
  selectTotal: selectTotalInspections,
} = inspectionsAdapter.getSelectors((state) => state.inspections);

// IMAGES

export const {
  default: images,
  imagesAdapter,
  addOneImageToInspection,
} = imagesSlice;

export const {
  selectById: selectImageById,
  selectIds: selectImageIds,
  selectEntities: selectImageEntities,
  selectAll: selectAllImages,
  selectTotal: selectTotalImages,
} = imagesAdapter.getSelectors((state) => state.images);

// DAMAGES

export const { default: damages, damagesAdapter } = damagesSlice;

export const {
  selectById: selectDamageById,
  selectIds: selectDamageIds,
  selectEntities: selectDamageEntities,
  selectAll: selectAllDamages,
  selectTotal: selectTotalDamages,
} = damagesAdapter.getSelectors((state) => state.damages);

// TASKS

export const {
  default: tasks,
  tasksAdapter,
  updateOneTaskOfInspection,
  getOneInspectionTask,
  getAllInspectionTasks,
} = tasksSlice;

export const {
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
  selectAll: selectAllTasks,
  selectTotal: selectTotalTasks,
} = tasksAdapter.getSelectors((state) => state.tasks);

export { default as config } from './config';
