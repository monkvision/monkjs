import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../asyncThunks';

export const partsAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  const { parts } = action.payload.entities;
  if (parts) {
    partsAdapter.upsertMany(state, parts);
  }
}

export const slice = createSlice({
  name: 'parts',
  initialState: partsAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
