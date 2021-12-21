import { schema } from 'normalizr';

import entities from '../entities';

export const KEY = 'views';

export const entity = new schema.Entity(KEY, {}, entities.options);

export const entityCollection = [entity];

export default entity;
