import {
  Damage,
  Image,
  Inspection,
  MonkEntity,
  MonkEntityType,
  Part,
  PartOperation,
  SeverityResult,
  Task,
  Vehicle,
  WheelAnalysis,
} from '@monkvision/types';

/* eslint-disable prettier/prettier */
/**
 * This type is for internal use only. Do not export it in the SDK.
 *
 * This type is a generic type used to map an entity type to its enum object value. It is used to enforce the proper
 * typings when using generic actions that have an EntityType on them.
 */
type MonkGenericEntityType<E extends MonkEntity> = E extends Damage
  ? MonkEntityType.DAMAGE
  : E extends Image
  ? MonkEntityType.IMAGE
  : E extends Inspection
  ? MonkEntityType.INSPECTION
  : E extends Part
  ? MonkEntityType.PART
  : E extends PartOperation
  ? MonkEntityType.PART_OPERATION
  : E extends SeverityResult
  ? MonkEntityType.SEVERITY_RESULT
  : E extends Task
  ? MonkEntityType.TASK
  : E extends Vehicle
  ? MonkEntityType.VEHICLE
  : E extends WheelAnalysis
  ? MonkEntityType.WHEEL_ANALYSIS
  : never;
/* eslint-enable prettier/prettier */

/**
 * Enumeration of the types of action that can be dispatched in the Monk state.
 */
export enum MonkActionType {
  /**
   * Got one entity : if an entity with this ID already exists, update it, if not create it.
   */
  GOT_ONE_ENTITY = 'got_one_entity',
  /**
   * Got multiple entities : for each entity, if an entity with this ID already exists, update it, if not create it.
   */
  GOT_MANY_ENTITIES = 'got_many_entities',
  /**
   * Deleted an entity : if an entity with this ID exists, delete it.
   */
  DELETED_ONE_ENTITY = 'deleted_one_entity',
  /**
   * Deleted multiple entities. For each entity, if an entity with this ID exists, delete it.
   */
  DELETED_MANY_ENTITIES = 'deleted_many_entities',
}

/**
 * Type definition for a generic action dispatched in the Monk state.
 */
export interface MonkAction {
  /**
   * The type of the action.
   */
  type: MonkActionType;
  /**
   * The type of entity affected by this action.
   */
  entityType: MonkEntityType;
}

/**
 * Action dispatched when a Monk entity has been fetched.
 *
 * @typeParam E - The type of entity affected by this action.
 */
export interface MonkGotOneAction<E extends MonkEntity> extends MonkAction {
  /**
   * The type of the action : `MonkActionType.GOT_ONE_ENTITY`.
   */
  type: MonkActionType.GOT_ONE_ENTITY;
  /**
   * The type of entity affected by this action. Note : in TypeScript, it has to correspond to the type of the entity
   * given in the `entity` field of this object.
   */
  entityType: MonkGenericEntityType<E>;
  /**
   * The entity that has been fetched.
   */
  entity: E;
}

/**
 * Matcher function that matches a MonkGotOneAction while also inferring its type using TypeScript's type predicate
 * feature. The EntityType can be specified in order to cast the Entity manually in the reducer.
 *
 * @typeParam E - Generic type of the entity that can be used to cast the entity.
 * @param action - The action to match.
 * @return `true` if the action is a MonkGotOneAction and infer its type in the scope.
 */
export function isGotOneAction<E extends MonkEntity>(
  action: MonkAction,
): action is MonkGotOneAction<E> {
  return action.type === MonkActionType.GOT_ONE_ENTITY;
}

/**
 * Action dispatched when multiple Monk entities have been fetched.
 *
 * @typeParam E - The type of entity affected by this action.
 */
export interface MonkGotManyAction<E extends MonkEntity> extends MonkAction {
  /**
   * The type of the action : `MonkActionType.GOT_MANY_ENTITIES`.
   */
  type: MonkActionType.GOT_MANY_ENTITIES;
  /**
   * The type of entities affected by this action. Note : in TypeScript, it has to correspond to the type of the
   * entities given in the `entities` field of this object.
   */
  entityType: MonkGenericEntityType<E>;
  /**
   * The entities that have been fetched.
   */
  entities: E[];
}

/**
 * Matcher function that matches a MonkGotManyAction while also inferring its type using TypeScript's type predicate
 * feature. The EntityType can be specified in order to cast the Entity manually in the reducer.
 *
 * @typeParam E - Generic type of the entity that can be used to cast the entity.
 * @param action - The action to match.
 * @return `true` if the action is a MonkGotManyAction and infer its type in the scope.
 */
export function isGotManyAction<E extends MonkEntity>(
  action: MonkAction,
): action is MonkGotManyAction<E> {
  return action.type === MonkActionType.GOT_MANY_ENTITIES;
}

/**
 * Action dispatched when a Monk entity has been deleted.
 */
export interface MonkDeletedOneAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.DELETED_ONE_ENTITY`.
   */
  type: MonkActionType.DELETED_ONE_ENTITY;
  /**
   * The ID of the entity that has been deleted.
   */
  id: string;
}

/**
 * Matcher function that matches a MonkDeletedOneAction while also inferring its type using TypeScript's type predicate
 * feature. The EntityType can be specified in order to cast the Entity manually in the reducer.
 *
 * @typeParam E - Generic type of the entity that can be used to cast the entity.
 * @param action - The action to match.
 * @return `true` if the action is a MonkDeletedOneAction and infer its type in the scope.
 */
export function isDeletedOneAction(action: MonkAction): action is MonkDeletedOneAction {
  return action.type === MonkActionType.DELETED_ONE_ENTITY;
}

/**
 * Action dispatched when multiple Monk entities have been deleted.
 */
export interface MonkDeletedManyAction extends MonkAction {
  /**
   * The type of the action : `MonkActionType.DELETED_MANY_ENTITIES`.
   */
  type: MonkActionType.DELETED_MANY_ENTITIES;
  /**
   * The IDs of the entities that have been deleted.
   */
  ids: string[];
}

/**
 * Matcher function that matches a MonkDeletedManyAction while also inferring its type using TypeScript's type predicate
 * feature. The EntityType can be specified in order to cast the Entity manually in the reducer.
 *
 * @typeParam E - Generic type of the entity that can be used to cast the entity.
 * @param action - The action to match.
 * @return `true` if the action is a MonkDeletedManyAction and infer its type in the scope.
 */
export function isDeletedManyAction(action: MonkAction): action is MonkDeletedManyAction {
  return action.type === MonkActionType.DELETED_MANY_ENTITIES;
}
