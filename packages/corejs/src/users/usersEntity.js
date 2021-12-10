import { schema } from 'normalizr';

export const KEY = 'users';

export const entity = new schema.Entity(KEY);

export const entityCollection = [entity];

export default entity;
