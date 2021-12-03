import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';
import { getOneInspectionById } from '../asyncThunks';
import * as api from './tasksApi';
import { entity, entityCollection } from './tasksEntity';

export { default as taskStatuses } from './constants';
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

function upsertReducer(state, action) {
  state.history.push(action);

  const { tasks } = action.payload.entities;
  tasksAdapter.upsertMany(state, tasks);
}

export const slice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    entities: {},
    history: [],
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateOneTaskOfInspection.fulfilled, upsertReducer);

    builder.addCase(getOneInspectionTask.fulfilled, upsertReducer);

    builder.addCase(getAllInspectionTasks.fulfilled, upsertReducer);

    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
