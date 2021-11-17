import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import config from '../config';

import * as api from './tasksApi';
import { entity } from './tasksEntity';

export const tasksAdapter = createEntityAdapter();

export const updateOneTask = createAsyncThunk(
  'tasks/updateOne',
  async (arg, { getState }) => {
    const { data } = await api.updateOne(config(arg, getState));
    return normalize(data, entity);
  },
);

const handlePending = (state) => { state.loading = 'pending'; };
const handleRejected = (state) => { state.loading = 'idle'; };
const handleFulfilled = (state, action) => {
  state.loading = 'idle';
  state.freshlyCreated = action.payload.result;
  tasksAdapter.upsertMany(state, action.payload.entities.tasks);
};

export const slice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState({
    loading: 'idle',
    freshlyCreated: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    // updateOneTask
    builder.addCase(updateOneTask.pending, handlePending);
    builder.addCase(updateOneTask.rejected, handleRejected);
    builder.addCase(updateOneTask.fulfilled, handleFulfilled);
  },
});

export default slice.reducer;
