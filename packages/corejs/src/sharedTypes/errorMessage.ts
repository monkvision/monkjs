/**
 * An error message created by the back-end.
 *
 * *Swagger Schema Reference :* `ErrorMessage`
 */
export interface ErrorMessage {
  /**
   * The id (uuid) of the error message entity.
   */
  id: string;
  /**
   * The error message.
   */
  message: string;
  /**
   * Creation date of the part error message, in the ISO 8601 format.
   */
  createdAt?: string;
  /**
   * The error code as an integer.
   */
  errorCode?: number;
  /**
   * The id of the error trace.
   */
  traceId?: string;
}
