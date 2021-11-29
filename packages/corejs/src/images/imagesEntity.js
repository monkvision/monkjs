import { schema } from 'normalizr';
import entities from '../entities';

export const KEY = 'images';

export const entity = new schema.Entity(KEY, {}, entities.options);

export const entityCollection = [entity];

export default entity;
