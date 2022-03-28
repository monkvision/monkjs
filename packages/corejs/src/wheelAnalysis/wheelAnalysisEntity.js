import { schema } from 'normalizr';
import entities from '../entities';

export const entity = new schema.Entity('wheelAnalysis', {}, entities.options);

export const entityCollection = [entity];

export default entity;
