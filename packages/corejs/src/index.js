import { inspectionsAdapter } from './inspections/inspectionsSlice';
import { imagesAdapter } from './images/imagesSlice';

export { default as values } from './values';
export { default as Sight } from './sights/Sight';

export const {
  selectById: selectInspectionById,
  selectIds: selectInspectionIds,
  selectEntities: selectInspectionEntities,
  selectAll: selectAllInspections,
  selectTotal: selectTotalInspections,
} = inspectionsAdapter.getSelectors((state) => state.inspections);

export const {
  selectById: selectImageById,
  selectIds: selectImageIds,
  selectEntities: selectImageEntities,
  selectAll: selectAllImages,
  selectTotal: selectTotalImages,
} = imagesAdapter.getSelectors((state) => state.images);

export {
  default as inspections,
  getOneInspectionById,
  getAllInspections,
  createOneInspection,
} from './inspections/inspectionsSlice';

export {
  default as images,
  createOneImage,
} from './images/imagesSlice';

export { default as config } from './config';
