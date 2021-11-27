import entities from 'entities';
import { schema } from 'normalizr';

export const entity = new schema.Entity('vehicles', {}, entities.options);

export const entityCollection = [entity];
