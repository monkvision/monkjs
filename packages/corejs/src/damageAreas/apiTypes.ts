import { CoreJsResponseWithId } from '../sharedTypes';
import { DamageArea } from './entityTypes';

/**
 * The information given to the API when upserting a damage area entity.
 *
 * *Swagger Schema Reference :* `DamageAreaPost`
 */
export type UpsertDamageArea = Partial<DamageArea>;

/**
 * The type returned by the upsertOneDamageArea method.
 */
export type UpsertOneDamageAreaResponse = CoreJsResponseWithId<DamageArea, string, 'id'>;
