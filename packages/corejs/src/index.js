import config from './config';
import * as actions from './actions';
import * as entity from './entities';
import * as schemas from './schemas';
import * as slices from './slices';

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
};
