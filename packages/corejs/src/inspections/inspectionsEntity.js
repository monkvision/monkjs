import { schema } from 'normalizr';

import entities from '../entities';

import { entityCollection as images } from '../images/imagesEntity';
import { entityCollection as damages } from '../damages/damagesEntity';
import { entityCollection as parts } from '../parts/partsEntity';
import { entity as vehicle } from '../vehicles/vehiclesEntity';
import { entityCollection as documents } from '../documents/documentsEntity';
import { entityCollection as tasks } from '../tasks/tasksEntity';

export const KEY = 'inspections';
export const entity = new schema.Entity(KEY, {
  images,
  damages,
  parts,
  vehicle,
  documents,
  tasks,
}, entities.options);
