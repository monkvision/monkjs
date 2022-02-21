import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { key } from '../entity';

export const entityAdapter = createEntityAdapter({});

export default createSlice({
  name: key,
  initialState: entityAdapter.getInitialState({ entities: {}, ids: [] }),
  reducers: {
    [`${key}/gotOne`]: (state, action) => {
      const { entities, result } = action.payload;
      const entity = entities[key][result];
      entityAdapter.upsertOne(state, entity);
    },
    [`${key}/gotMany`]: (state, action) => {
      const { entities } = action.payload;
      entityAdapter.upsertMany(state, entities[key]);
    },
    [`${key}/updatedOne`]: (state, action) => {
      const { entities, result } = action.payload;
      const entity = entities[key][result];
      entityAdapter.updateOne(state, entity);
    },
    [`${key}/updatedMany`]: (state, action) => {
      const { entities } = action.payload;
      entityAdapter.upsertMany(state, entities[key]);
    },
    [`${key}/deletedOne`]: (state, action) => {
      const { result } = action.payload;
      entityAdapter.removeOne(state, result);
    },
    [`${key}/deleteMany`]: (state, action) => {
      const { result } = action.payload;
      entityAdapter.removeMany(state, result[key]);
    },
    [`${key}/reset`]: (state) => entityAdapter.removeAll(state),
  },
});
