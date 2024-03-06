/**
 * Enumeration of the types of action that can be dispatched in the Monk state.
 */
export enum MonkActionType {
  /**
   * An inspection has been fetched from the API.
   */
  GOT_ONE_INSPECTION = 'got_one_inspection',
  /**
   * An image has been uploaded to the API.
   */
  CREATED_ONE_IMAGE = 'created_one_image',
  /**
   * One or more tasks have been updated.
   */
  UPDATED_MANY_TASKS = 'updated_many_tasks',
  /**
   * Clear and reset the state.
   */
  RESET_STATE = 'reset_state',
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
