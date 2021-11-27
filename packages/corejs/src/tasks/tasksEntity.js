import entities from 'entities';
import { schema } from 'normalizr';

export const KEY = 'tasks';

export const entity = new schema.Entity(KEY, {}, entities.options);

export const entityCollection = [entity];
