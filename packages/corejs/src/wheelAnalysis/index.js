import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import isEmpty from 'lodash.isempty';

import createEntityReducer from '../createEntityReducer';

import { key } from './schema';

export const STATUSES = {
  aborted: 'ABORTED',
  done: 'DONE',
  error: 'ERROR',
  inProgress: 'IN_PROGRESS',
  notStarted: 'NOT_STARTED',
  todo: 'TODO',
  validated: 'VALIDATED',
};

export const entityAdapter = createEntityAdapter({});
export const entityReducer = createEntityReducer(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
  extraReducers: (builder) => {
    builder
      .addCase(`inspections/gotOne`, (state, action) => {
        const { entities } = action.payload;
        const wheelAnalysis = entities[key];
        if (!isEmpty(wheelAnalysis)) { entityAdapter.upsertMany(state, wheelAnalysis); }
      })
      .addCase(`inspections/gotMany`, (state, action) => {
        const { entities } = action.payload;
        const wheelAnalysis = entities[key];
        if (!isEmpty(wheelAnalysis)) { entityAdapter.upsertMany(state, wheelAnalysis); }
      });
  },
});
