import { schema } from 'normalizr';

export const entity = new schema.Entity('tasks');

export const entityCollection = [entity];
