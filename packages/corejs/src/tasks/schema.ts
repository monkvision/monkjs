import { camelCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';
import { schema } from 'normalizr';
import { EntityKey } from '../sharedTypes';

export const key = EntityKey.TASKS;
export const idAttribute = 'id';

const processStrategy = (obj) => mapKeysDeep(obj, (v, k) => camelCase(k));

export default new schema.Entity(key, {

}, { idAttribute, processStrategy });
