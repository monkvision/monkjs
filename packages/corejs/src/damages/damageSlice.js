import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../inspections/inspectionsSlice';

export const damagesAdapter = createEntityAdapter();

export const slice = createSlice({
  name: 'damages',
  initialState: damagesAdapter.getInitialState({
    error: false,
    loading: 'idle',
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, (state, action) => {
      damagesAdapter.upsertMany(state, action.payload.entities.damages);
    });
  },
});

export default slice.reducer;
