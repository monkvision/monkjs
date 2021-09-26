import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import inspectionApi from '../services/inspection';

export const inspectionEntity = new schema.Entity('inspection');

export const fetchInspectionList = createAsyncThunk(
  'inspection/fetchInspectionList',
  async (arg) => {
    const { data } = await inspectionApi.getInspectionList(arg);

    const normalized = normalize(data, inspectionEntity);
    return normalized.entities;
  },
);

export const fetchInspectionById = createAsyncThunk(
  'inspection/fetchInspectionById',
  async (id) => {
    const { data } = await inspectionApi.getInspectionById(id);

    const normalized = normalize(data, inspectionEntity);
    return normalized.entities;
  },
);

export const fetchAllInspection = createAsyncThunk(
  'inspection/fetchAllInspection',
  async (args) => {
    const { data } = await inspectionApi.getAllInspections(args);

    const normalized = normalize(data, inspectionEntity);
    return normalized.entities;
  },
);

export const updateInspection = createAsyncThunk(
  'inspection/updateInspection',
  async (arg) => {
    const { data } = await inspectionApi.postOneInspection(arg);

    const normalized = normalize(data, inspectionEntity);
    return normalized.entities;
  },
);

export const inspectionsAdapter = createEntityAdapter();

const initialState = inspectionsAdapter.getInitialState();

export const slice = createSlice({
  name: 'inspection',
  initialState,
  reducers: {
    removeInspection: inspectionsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInspectionById.fulfilled, inspectionsAdapter.upsertOne);
    builder.addCase(fetchInspectionList.fulfilled, inspectionsAdapter.upsertMany);
    builder.addCase(fetchAllInspection.fulfilled, inspectionsAdapter.upsertMany);
    builder.addCase(updateInspection.fulfilled, (state, { payload }) => {
      const { id, ...changes } = payload;
      inspectionsAdapter.updateOne(state, { id, changes });
    });
  },
});

export default slice.reducer;

export const { removeInspection } = slice.actions;

export const {
  selectById: selectInspectionById,
  selectIds: selectInspectionIds,
  selectAll: selectAllInspections,
  selectTotal: selectTotalInspections,
} = inspectionsAdapter.getSelectors((state) => state.inspection);
