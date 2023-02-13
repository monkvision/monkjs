import * as actions from './actions';
import config from './config';
import * as entity from './entities';
import * as schemas from './schemas';
import * as slices from './slices';
import * as types from './types';

export * from './monitoring';

const reducers = {};
Object.values(slices).forEach((slice) => {
  const { name } = slice;
  reducers[name] = slice.reducer;
});

export default {
  actions,
  config,
  entity,
  reducers,
  schemas,
  slices,
  types,
};
