import entities from 'entities';
import { schema } from 'normalizr';

export const entity = new schema.Entity('parts', {}, entities.options);

export const entityCollection = [entity];
