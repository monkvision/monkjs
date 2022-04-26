import { PartType } from '../parts/entityTypes';
import { CoreJsResponseWithId, IdResponse } from '../sharedTypes';
import { Damage, DamageType } from './entityTypes';

/**
 * The information given to the API when creating a new damage entity.
 *
 * *Swagger Schema Reference :* `DamagePost`
 */
export interface CreateDamage {
  /**
   * The type of damage
   */
  damageType: DamageType;
  /**
   * The type of the car part the damage is located on.
   */
  partType: PartType;
}

/**
 * The details of a damage entity returned after creating it.
 */
export type CreatedDamage = Pick<Damage, 'id' | 'damageType'>;

/**
 * The type returned by the createOneDamage method.
 */
export type CreateOneDamageResponse = CoreJsResponseWithId<IdResponse<'id'>, CreatedDamage, 'id'>;

/**
 * The type returned by the deleteOneDamage method.
 */
export type DeleteOneDamageResponse = CoreJsResponseWithId<IdResponse<'id'>, IdResponse<'id'>, 'id'>;
