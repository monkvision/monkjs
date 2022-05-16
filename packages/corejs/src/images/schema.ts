import { camelCase } from 'lodash';
import mapKeysDeep from 'map-keys-deep-lodash';
import { schema } from 'normalizr';

import damageArea from '../damageAreas/schema';
import { EntityKey } from '../sharedTypes';
import view from '../views/schema';

export const key = EntityKey.IMAGES;
export const idAttribute = 'id';

const processStrategy = (obj) => mapKeysDeep(obj, (v, k) => camelCase(k));

export default new schema.Entity(key, {
  damageArea,
  views: [view],
}, { idAttribute, processStrategy });
