import { EntityState } from '@reduxjs/toolkit';
import { NormalizedDamageArea } from '../damageAreas/entityTypes';
import { NormalizedDamage } from '../damages/entityTypes';
import { NormalizedImage } from '../images/entityTypes';
import { NormalizedInspection } from '../inspections/entityTypes';
import { NormalizedPart } from '../parts/entityTypes';
import { NormalizedTask } from '../tasks/entityTypes';
import { NormalizedVehicle } from '../vehicles/entityTypes';
import { NormalizedView } from '../views/entityTypes';
import { NormalizedWheelAnalysis } from '../wheelAnalysis/entityTypes';
import { EntityKey } from './entities';

/**
 * The basic root state of the redux tree.
 */
export interface RootState {
  /**
   * The state related to the damage area entity.
   */
  [EntityKey.DAMAGE_AREAS]: EntityState<NormalizedDamageArea>,
  /**
   * The state related to the damage entity.
   */
  [EntityKey.DAMAGES]: EntityState<NormalizedDamage>,
  /**
   * The state related to the image entity.
   */
  [EntityKey.IMAGES]: EntityState<NormalizedImage>,
  /**
   * The state related to the inspection entity.
   */
  [EntityKey.INSPECTIONS]: EntityState<NormalizedInspection>,
  /**
   * The state related to the part entity.
   */
  [EntityKey.PARTS]: EntityState<NormalizedPart>,
  /**
   * The state related to the task entity.
   */
  [EntityKey.TASKS]: EntityState<NormalizedTask>,
  /**
   * The state related to the vehicle entity.
   */
  [EntityKey.VEHICLES]: EntityState<NormalizedVehicle>,
  /**
   * The state related to the view entity.
   */
  [EntityKey.VIEWS]: EntityState<NormalizedView>,
  /**
   * The state related to the wheel analysis entity.
   */
  [EntityKey.WHEEL_ANALYSIS]: EntityState<NormalizedWheelAnalysis>,
}
