import { inspectionsAdapter } from './inspections/inspectionsSlice';

export { default as values } from './values';
export { default as Sight } from './sights/Sight';

export const {
  selectById: selectInspectionById,
  selectIds: selectInspectionIds,
  selectEntities: selectInspectionEntities,
  selectAll: selectAllInspections,
  selectTotal: selectTotalInspections,
} = inspectionsAdapter.getSelectors((state) => state.inspections);

export {
  default as inspections,
  getOneInspectionById,
  getAllInspections,
  createOneInspection,
} from './inspections/inspectionsSlice';
