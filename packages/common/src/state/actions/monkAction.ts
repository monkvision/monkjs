/**
 * Enumeration of the types of action that can be dispatched in the Monk state.
 */
export enum MonkActionType {
  /**
   * An inspection has been fetched from the API.
   */
  GOT_ONE_INSPECTION = 'got_one_inspection',
  /**
   * An inspection additional data has been updated.
   */
  UPDATED_ONE_INSPECTION_ADDITIONAL_DATA = 'updated_one_inspection_additional_data',
  /**
   * An image has been uploaded to the API.
   */
  CREATED_ONE_IMAGE = 'created_one_image',
  /**
   * One or more tasks have been updated.
   */
  UPDATED_MANY_TASKS = 'updated_many_tasks',
  /**
   * A vehicle has been updated.
   */
  UPDATED_VEHICLE = 'updated_vehicle',
  /**
   * A pricing has been uploaded to the API.
   */
  CREATED_ONE_PRICING = 'created_one_pricing',
  /**
   * A pricing has been updated.
   */
  UPDATED_ONE_PRICING = 'updated_one_pricing',
  /**
   * A pricing has been deleted.
   */
  DELETED_ONE_PRICING = 'deleted_one_pricing',
  /**
   * A damage has been uploaded to the API.
   */
  CREATED_ONE_DAMAGE = 'created_one_damage',
  /**
   * A damage has been deleted.
   */
  DELETED_ONE_DAMAGE = 'deleted_one_damage',
  /**
   * Clear and reset the state.
   */
  RESET_STATE = 'reset_state',
  /**
   * An inspection PDF has been fetched from the API.
   */
  GOT_ONE_INSPECTION_PDF = 'got_one_inspection_pdf',
}

/**
 * Type definition for a generic action dispatched in the Monk state.
 */
export interface MonkAction {
  /**
   * The type of the action.
   */
  type: MonkActionType;
}
