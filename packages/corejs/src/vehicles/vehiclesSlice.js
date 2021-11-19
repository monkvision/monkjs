import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import * as api from './vehiclesApi';
import { entity } from './vehiclesEntity';

export const vehiclesAdapter = createEntityAdapter();

export const getOneVehicle = createAsyncThunk(
  'vehicles/getOne',
  async (arg) => {
    const { data } = await api.getOne({ ...arg });
    return normalize(data, entity);
  },
);

export const getAllVehicles = createAsyncThunk(
  'vehicles/getAll',
  async (arg) => {
    const { data } = await api.getAll({ ...arg });
    return normalize(data, entity);
  },
);

export const updateOneVehicle = createAsyncThunk(
  'vehicles/updateOne',
  async (arg) => {
    const { data } = await api.updateOne({ ...arg });
    return normalize(data, entity);
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
  vehiclesAdapter.upsertMany(state, action.payload.entities.vehicles);
};

export const slice = createSlice({
  name: 'vehicles',
  initialState: vehiclesAdapter.getInitialState({
    error: false,
    loading: 'idle',
    freshlyCreated: null,
  }),
  reducers: {},
  extraReducers: (builder) => {
    // getOneVehicle
    builder.addCase(getOneVehicle.pending, handlePending);
    builder.addCase(getOneVehicle.rejected, handleRejected);
    builder.addCase(getOneVehicle.fulfilled, handleFulfilled);

    // getAllVehicles
    builder.addCase(getAllVehicles.pending, handlePending);
    builder.addCase(getAllVehicles.rejected, handleRejected);
    builder.addCase(getAllVehicles.fulfilled, handleFulfilled);

    // updateOneVehicle
    builder.addCase(updateOneVehicle.pending, handlePending);
    builder.addCase(updateOneVehicle.rejected, handleRejected);
    builder.addCase(updateOneVehicle.fulfilled, handleFulfilled);
  },
});

export default slice.reducer;
