import * as inspectionsSlice from './inspections/inspectionsSlice';
import * as imagesSlice from './images/imagesSlice';
import * as tasksSlice from './tasks/tasksSlice';
import * as vehiclesSlice from './vehicles/vehiclesSlice';

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

// TASKS

export const {
  default: tasks,
  tasksAdapter,
  updateOneTaskOfInspection,
} = tasksSlice;

export const {
  selectById: selectTaskById,
  selectIds: selectTaskIds,
  selectEntities: selectTaskEntities,
  selectAll: selectAllTasks,
  selectTotal: selectTotalTasks,
} = tasksAdapter.getSelectors((state) => state.tasks);

// VEHICLES

export const {
  default: vehicles,
  vehiclesAdapter,
  getOneVehicle,
  getAllVehicles,
  updateOneVehicle,
} = vehiclesSlice;

export const {
  selectById: selectVehicleById,
  selectIds: selectVehicleIds,
  selectEntities: selectVehicleEntities,
  selectAll: selectAllVehicles,
  selectTotal: selectTotalVehicles,
} = vehiclesAdapter.getSelectors((state) => state.vehicles);

export { default as config } from './config';
