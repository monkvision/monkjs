import entities from 'entities';
import { schema } from 'normalizr';

export const entity = new schema.Entity('damages', {}, entities.options);

export const entityCollection = [entity];
