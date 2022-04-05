import camelCase from 'lodash.camelcase';
import mapKeysDeep from 'map-keys-deep-lodash';
import { schema } from 'normalizr';

import damage from '../damages/schema';
import image from '../images/schema';
import vehicle from '../vehicles/schema';

export const key = 'inspections';
export const idAttribute = 'id';

const processStrategy = (obj) => mapKeysDeep(obj, (v, k) => camelCase(k));

export default new schema.Entity(key, {
  images: [image],
  damages: [damage],
  vehicle,
}, { idAttribute, processStrategy });
