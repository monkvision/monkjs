import config from './config';
import * as entity from './entities';
import * as schemas from './schemas';
import * as slices from './slices';

const reducers = {};
const actions = {};

Object.values(slices).forEach((slice) => {
  const { name } = slice;

  reducers[name] = slice.reducer;
  actions[name] = slice.actions;
});

export default {
  actions,
  config,
  entity,
  reducers,
  schemas,
  slices,
};
