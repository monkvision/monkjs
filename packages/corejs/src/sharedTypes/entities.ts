import { NormalizedDamageArea } from '../damageAreas/entityTypes';
import { NormalizedDamage } from '../damages/entityTypes';
import { NormalizedImage } from '../images/entityTypes';
import { NormalizedInspection } from '../inspections/entityTypes';
import { NormalizedPart } from '../parts/entityTypes';
import { NormalizedTask } from '../tasks/entityTypes';
import { NormalizedVehicle } from '../vehicles/entityTypes';
import { NormalizedView } from '../views/entityTypes';
import { NormalizedWheelAnalysis } from '../wheelAnalysis/entityTypes';

/**
 * The entity dictionary keys. This enum is needed to have type safe redux reducers.
 */
export enum EntityKey {
  /**
   * The key for the damage areas entities.
   */
  DAMAGE_AREAS = 'damageAreas',
  /**
   * The key for the damages entities.
   */
  DAMAGES = 'damages',
  /**
   * The key for the images entities.
   */
  IMAGES = 'images',
  /**
   * The key for the inspections entities.
   */
  INSPECTIONS = 'inspections',
  /**
   * The key for the parts entities.
   */
  PARTS = 'parts',
  /**
   * The key for the tasks entities.
   */
  TASKS = 'tasks',
  /**
   * The key for the vehicles entities.
   */
  VEHICLES = 'vehicles',
  /**
   * The key for the views entities.
   */
  VIEWS = 'views',
  /**
   * The key for the wheel analysis entities.
   */
  WHEEL_ANALYSIS = 'wheelAnalysis',
}

/**
 * This type is an alias describing a generic normalized entity.
 */
export type NormalizedEntity = NormalizedDamageArea
| NormalizedDamage
| NormalizedImage
| NormalizedInspection
| NormalizedPart
| NormalizedTask
| NormalizedVehicle
| NormalizedView
| NormalizedWheelAnalysis;

/**
 * The model of the entity collection, returned by normalizr when normalizing some of our entites.
 */
export interface NormalizedEntities {
  /**
   * The damage areas entities.
   */
  [EntityKey.DAMAGE_AREAS]?: {
    [id: string]: NormalizedDamageArea;
  },
  /**
   * The damages entities.
   */
  [EntityKey.DAMAGES]?: {
    [id: string]: NormalizedDamage;
  },
  /**
   * The images entities.
   */
  [EntityKey.IMAGES]?: {
    [id: string]: NormalizedImage;
  },
  /**
   * The inspections entities.
   */
  [EntityKey.INSPECTIONS]?: {
    [id: string]: NormalizedInspection;
  },
  /**
   * The parts entities.
   */
  [EntityKey.PARTS]?: {
    [id: string]: NormalizedPart;
  },
  /**
   * The tasks entities.
   */
  [EntityKey.TASKS]?: {
    [id: string]: NormalizedTask;
  },
  /**
   * The vehicles entities.
   */
  [EntityKey.VEHICLES]?: {
    [id: string]: NormalizedVehicle;
  },
  /**
   * The views entities.
   */
  [EntityKey.VIEWS]?: {
    [id: string]: NormalizedView;
  },
  /**
   * The wheel analysis entities.
   */
  [EntityKey.WHEEL_ANALYSIS]?: {
    [id: string]: NormalizedWheelAnalysis;
  },
}
