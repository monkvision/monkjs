import { EntityAdapter, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { EntityKey, NormalizedEntities, NormalizedEntity } from './sharedTypes';

export default function createEntityReducer<
  T extends NormalizedEntity,
  PayloadTypes extends EntityReducerPayloadTypes,
>(
  key: EntityKey,
  entityAdapter: EntityAdapter<T>,
) {
  return {
    gotOne: (state: EntityState<T>, action: PayloadAction<PayloadTypes['GotOne']>) => {
      const { entities, result } = action.payload;
      const entity = entities[key][result];
      entityAdapter.upsertOne(state, entity as T);
    },
    gotMany: (state: EntityState<T>, action: PayloadAction<PayloadTypes['GotMany']>) => {
      const { entities } = action.payload;
      entityAdapter.upsertMany(state, entities[key] as Record<string, T>);
    },
    updatedOne: (state: EntityState<T>, action: PayloadAction<PayloadTypes['UpdatedOne']>) => {
      const { entities, result } = action.payload;
      entityAdapter.updateOne(state, {
        id: result,
        changes: entities[key][result] as Partial<T>,
      });
    },
    updatedMany: (state: EntityState<T>, action: PayloadAction<PayloadTypes['UpdatedMany']>) => {
      const { entities } = action.payload;
      entityAdapter.upsertMany(state, entities[key] as Record<string, T>);
    },
    deletedOne: (state: EntityState<T>, action: PayloadAction<PayloadTypes['DeletedOne']>) => {
      const { result } = action.payload;
      entityAdapter.removeOne(state, result);
    },
    deleteMany: (state: EntityState<T>, action: PayloadAction<PayloadTypes['DeletedMany']>) => {
      const { result } = action.payload;
      entityAdapter.removeMany(state, result);
    },
    reset: (state: EntityState<T>) => entityAdapter.removeAll(state),
  };
}

/**
 * This interface is a generic type-mapping interface that only serves as a template to define the payload types for
 * basic entity adapter reducers.
 */
export interface EntityReducerPayloadTypes {
  /**
   * The payload type for a GotOne payload.
   */
  GotOne: GotOneEntityPayload,
  /**
   * The payload type for a GotMany payload.
   */
  GotMany: GotManyEntitiesPayload,
  /**
   * The payload type for an UpdatedOne payload.
   */
  UpdatedOne: UpdatedOneEntityPayload,
  /**
   * The payload type for an UpdatedMany payload.
   */
  UpdatedMany: UpdatedManyEntitiesPayload,
  /**
   * The payload type for a DeletedOne payload.
   */
  DeletedOne: DeletedOneEntityPayload,
  /**
   * The payload type for a DeletedMany payload.
   */
  DeletedMany: DeletedManyEntitiesPayload,
}

/**
 * The structure of the payload of a GotOne entity action.
 */
export interface GotOneEntityPayload {
  /**
   * The lookup table mapping entity IDs to the corresponding entity objects.
   */
  entities: NormalizedEntities,
  /**
   * The id of the entity retreived.
   */
  result: string,
}

/**
 * The structure of the payload of a GotMany entity action.
 */
export interface GotManyEntitiesPayload {
  /**
   * The lookup table mapping entity IDs to the corresponding entity objects.
   */
  entities: NormalizedEntities,
  /**
   * The IDs of the entities retreived.
   */
  result: string[],
}

/**
 * The structure of the payload of a UpdatedOne entity action.
 *
 * *T* - The normalized type of the entity.
 */
export interface UpdatedOneEntityPayload {
  /**
   * The lookup table mapping entity IDs to the corresponding entity objects.
   */
  entities: NormalizedEntities,
  /**
   * The id of the updated entity.
   */
  result: string,
}

/**
 * The structure of the payload of a UpdatedMany entity action.
 */
export interface UpdatedManyEntitiesPayload {
  /**
   * The lookup table mapping entity IDs to the corresponding entity objects.
   */
  entities: NormalizedEntities,
  /**
   * The IDs of the entities updated.
   */
  result: string[],
}

/**
 * The structure of the payload of a DeletedOne entity action.
 */
export interface DeletedOneEntityPayload {
  /**
   * The lookup table mapping entity IDs to the corresponding entity objects.
   */
  entities: NormalizedEntities,
  /**
   * The id of the entity deleted.
   */
  result: string,
}

/**
 * The structure of the payload of a DeletedMany entity action.
 *
 * *T* - The normalized type of the entity.
 */
export interface DeletedManyEntitiesPayload {
  /**
   * The lookup table mapping entity IDs to the corresponding entity objects.
   */
  entities: NormalizedEntities,
  /**
   * The IDs of the entities deleted.
   */
  result: string[],
}
