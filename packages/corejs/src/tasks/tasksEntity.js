import { schema } from 'normalizr';

export const KEY = 'tasks';

export const entity = new schema.Entity(KEY);

export const entityCollection = [entity];
