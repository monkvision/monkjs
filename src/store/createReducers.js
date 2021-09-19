import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';

export default function createReducers(initialState = {}) {
  return {
    reset: (state, { payload }) => ({ ...initialState, ...payload }),
    set: (state, { payload }) => ({ ...payload }),
    update: (state, { payload }) => ({
      ...state,
      ...mapKeys(payload, (v, k) => camelCase(k)),
    }),
  };
}
