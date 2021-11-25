import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './tasksApi';
import { entity, entityCollection } from './tasksEntity';

export const tasksAdapter = createEntityAdapter();

export const updateOneTaskOfInspection = createAsyncThunk(
  'tasks/updateOne',
  async (arg) => {
    const { data } = await api.updateOne({ ...arg });
    return normalize(data, entity);
  },
);

export const getOneInspectionTask = createAsyncThunk(
  'tasks/getOne',
  async (arg) => {
    const { data } = await api.getOne({ ...arg });
    return normalize(data, entity);
  },
);

export const getAllInspectionTasks = createAsyncThunk(
  'tasks/getAll',
  async (arg) => {
    const { data } = await api.getAll({ ...arg });
    return normalize(data, entityCollection);
  },
);

const handlePending = (state) => {
  state.error = false;
  state.loading = 'pending';
};

const handleRejected = (state, action) => {
  state.loading = 'idle';
  state.error = action.error;
};

const handleFulfilled = (state, action) => {
  state.error = false;
  state.loading = 'idle';
  state.freshlyCreated = action.payload.result;
  tasksAdapter.upsertMany(state, action.payload.entities.tasks);
};

export const slice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    error: false,
    loading: 'idle',
    freshlyCreated: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    // updateOneTaskOfInspection
    builder.addCase(updateOneTaskOfInspection.pending, handlePending);
    builder.addCase(updateOneTaskOfInspection.rejected, handleRejected);
    builder.addCase(updateOneTaskOfInspection.fulfilled, handleFulfilled);

    // getOneInspectionTask
    builder.addCase(getOneInspectionTask.pending, handlePending);
    builder.addCase(getOneInspectionTask.rejected, handleRejected);
    builder.addCase(getOneInspectionTask.fulfilled, handleFulfilled);

    // getAllInspectionTasks
    builder.addCase(getAllInspectionTasks.pending, handlePending);
    builder.addCase(getAllInspectionTasks.rejected, handleRejected);
    builder.addCase(getAllInspectionTasks.fulfilled, handleFulfilled);
  },
});

export default slice.reducer;
