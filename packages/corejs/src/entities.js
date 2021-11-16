import mapKeys from 'lodash.mapkeys';
import camelCase from 'lodash.camelcase';

export const idAttribute = 'id';
export const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

export default {
  options: {
    idAttribute,
    processStrategy,
  },
};
