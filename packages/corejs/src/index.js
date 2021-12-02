import * as damagesSlice from './damages/damagesSlice';
import * as imagesSlice from './images/imagesSlice';
import * as partsSlice from './parts/partsSlice';
import * as inspectionsSlice from './inspections/inspectionsSlice';
import * as tasksSlice from './tasks/tasksSlice';

export { default as damagesEntity } from './damages/damagesEntity';
export { default as imagesEntity } from './images/imagesEntity';
export { default as partsEntity } from './parts/partsEntity';
export { default as inspectionsEntity } from './inspections/inspectionsEntity';
export { default as tasksEntity } from './tasks/tasksEntity';

export { default as config } from './config';
export { default as Sight } from './sights/Sight';
export { default as values } from './values';

export * as asyncThunks from './asyncThunks';

// INSPECTIONS

export const {
  default: inspections,
  inspectionsAdapter,
  getOneInspectionById,
  getAllInspections,
  createOneInspection,
  deleteOneInspection,
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

// PARTS

export const { default: parts, partsAdapter } = partsSlice;

export const {
  selectById: selectPartById,
  selectIds: selectPartIds,
  selectEntities: selectPartEntities,
  selectAll: selectAllParts,
  selectTotal: selectTotalParts,
} = partsAdapter.getSelectors((state) => state.parts);

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
