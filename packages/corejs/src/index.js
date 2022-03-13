import config from './config';
import * as entity from './entities';
import * as slices from './slices';

const reducers = {};
const actions = {};
const selectors = {};

Object.values(slices).forEach((slice) => {
  const { name } = slice;

  reducers[name] = slice.reducer;
  actions[name] = slice.actions;
  selectors[name] = slice.selectors;
});

export default {
  actions,
  config,
  entity,
  reducers,
  selectors,
};
