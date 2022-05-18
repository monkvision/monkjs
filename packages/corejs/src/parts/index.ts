import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import createEntityReducer from '../createEntityReducer';
import { RootState } from '../sharedTypes';
import { NormalizedPart } from './entityTypes';
import { PartPayloadTypes } from './reduxTypes';

import { key } from './schema';

export const entityAdapter = createEntityAdapter<NormalizedPart>({});
export const entityReducer = createEntityReducer<NormalizedPart, PartPayloadTypes>(key, entityAdapter);
export const selectors = entityAdapter.getSelectors((state: RootState) => state[key]);

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: entityReducer,
});
