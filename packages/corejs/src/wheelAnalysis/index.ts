import { createEntityAdapter, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';

import createEntityReducer from '../createEntityReducer';
import { InspectionPayloadTypes } from '../inspections/reduxTypes';
import { RootState } from '../sharedTypes';
import { NormalizedView } from '../views/entityTypes';
import { NormalizedWheelAnalysis } from './entityTypes';
import { WheelAnalysisPayloadTypes } from './reduxTypes';

import { key } from './schema';

export const entityAdapter = createEntityAdapter<NormalizedWheelAnalysis>({});
export const entityReducer = createEntityReducer<NormalizedWheelAnalysis, WheelAnalysisPayloadTypes>(
  key,
  entityAdapter,
);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder.addCase('inspections/gotOne', (
      state: EntityState<NormalizedView>,
      action: PayloadAction<InspectionPayloadTypes['GotOne'], 'inspections/gotOne'>,
    ) => {
      const { entities } = action.payload;
      const wheelAnalysis = entities[key];
      if (!isEmpty(wheelAnalysis)) { entityAdapter.upsertMany(state, wheelAnalysis); }
    }).addCase('inspections/gotMany', (
      state: EntityState<NormalizedView>,
      action: PayloadAction<InspectionPayloadTypes['GotMany'], 'inspections/gotMany'>,
    ) => {
      const { entities } = action.payload;
      const wheelAnalysis = entities[key];
      if (!isEmpty(wheelAnalysis)) { entityAdapter.upsertMany(state, wheelAnalysis); }
    });
  },
});
