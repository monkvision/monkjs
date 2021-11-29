import { schema } from 'normalizr';
import entities from '../entities';

export const entity = new schema.Entity('parts', {}, entities.options);

export const entityCollection = [entity];

export default entity;
