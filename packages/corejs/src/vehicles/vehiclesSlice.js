import { createEntityAdapter, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { normalize } from 'normalizr';

import { getOneInspectionById } from '../asyncThunks';
import { entity } from './vehiclesEntity';
import * as api from './vehiclesApi';

export const vehiclesAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  const { vehicles } = action.payload.entities;
  if (vehicles) {
    vehiclesAdapter.upsertMany(state, vehicles);
  }
}

export const updateOneInspectionVehicle = createAsyncThunk(
  'vehicles/updateOne',
  async (arg) => {
    const { data } = await api.updateOne({ ...arg });
    return normalize(data, entity);
  },
);

export const slice = createSlice({
  name: 'vehicles',
  initialState: vehiclesAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);

    builder.addCase(updateOneInspectionVehicle.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
