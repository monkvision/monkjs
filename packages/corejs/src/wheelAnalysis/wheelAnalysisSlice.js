import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../asyncThunks';

export const wheelAnalysisAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  const { wheelAnalysis } = action.payload.entities;
  if (wheelAnalysis) {
    wheelAnalysisAdapter.upsertMany(state, wheelAnalysis);
  }
}

export const slice = createSlice({
  name: 'wheelAnalysis',
  initialState: wheelAnalysisAdapter.getInitialState({
    entities: {},
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
