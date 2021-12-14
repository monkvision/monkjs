import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../asyncThunks';

export const damagesAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  const { damages } = action.payload.entities;
  if (damages) {
    damagesAdapter.upsertMany(state, damages);
  }
}

export const slice = createSlice({
  name: 'damages',
  initialState: damagesAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
