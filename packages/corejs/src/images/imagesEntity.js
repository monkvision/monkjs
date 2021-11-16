import { schema } from 'normalizr';

import entities from '../entities';

import { entityCollection as views } from '../views/viewsEntity';

export const KEY = 'images';

export const entity = new schema.Entity(KEY, {
  views,
}, entities.options);

export const entityCollection = [entity];
