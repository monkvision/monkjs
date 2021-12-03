import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { getOneInspectionById } from '../asyncThunks';

export const vehiclesAdapter = createEntityAdapter();

function upsertReducer(state, action) {
  state.history.push(action);

  const { vehicles } = action.payload.entities;
  vehiclesAdapter.upsertMany(state, vehicles);
}

export const slice = createSlice({
  name: 'vehicles',
  initialState: vehiclesAdapter.getInitialState({
    entities: {},
    history: [],
    ids: [],
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOneInspectionById.fulfilled, upsertReducer);
  },
});

export default slice.reducer;
