/**
 * A callback called when an inspection task is done (or has crashed due to an error). The API will make a post at $urf,
 * with headers $headers and query params $params. You can specify up to 16 callback endpoints.
 *
 * *Swagger Schema Reference :* `Callback`
 */
export interface Callback {
  /**
   * The url at which the API will make a POST call at the end of the task.
   */
  url: string;
  /**
   * The headers added to the POST call.
   */
  headers: {
    [k: string]: unknown;
  };
  /**
   * The query params added to the POST call.
   */
  params?: {
    [k: string]: unknown;
  };
  /**
   * The types of events that can trigger this callback.
   */
  callbackEvent?: CallbackEvent | CallbackEvent[];
}

/**
 * The types of events that can trigger a callback.
 *
 * *Swagger Schema Reference :* `CallbackEvent`
 */
export enum CallbackEvent {
  /**
   * The status of the task has been set to "done".
   */
  STATUS_SET_TO_DONE = 'STATUS_SET_TO_DONE',
  /**
   * The status of the task has been set to "error".
   */
  STATUS_SET_TO_ERROR = 'STATUS_SET_TO_ERROR',
}
