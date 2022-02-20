import camelCase from 'lodash.camelcase';
import mapKeys from 'lodash.mapkeys';
import { schema } from 'normalizr';

import damage from '../../damages/entity';
import image from '../../images/entity';
import part from '../../parts/entity';
import task from '../../tasks/entity';
import vehicle from '../../vehicles/entity';

const key = 'inspections';
const idAttribute = 'id';
const processStrategy = (obj) => mapKeys(obj, (v, k) => camelCase(k));

const entity = new schema.Entity(key, {
  images: [image],
  damages: [damage],
  parts: [part],
  vehicle,
  tasks: [task],
}, { idAttribute, processStrategy });

export default entity;
