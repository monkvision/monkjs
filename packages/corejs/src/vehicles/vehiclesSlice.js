import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../asyncThunks';

export const vehiclesAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  const { vehicles } = action.payload.entities;
  if (vehicles) {
    vehiclesAdapter.upsertMany(state, vehicles);
  }
}

export const slice = createSlice({
  name: 'vehicles',
  initialState: vehiclesAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
