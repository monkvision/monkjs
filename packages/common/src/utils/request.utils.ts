/**
 * Checks if an error is a timeout error (request timed out or failed to reach the server).
 */
export function isTimeoutError(err: unknown): boolean {
  return err instanceof Error && (err.name === 'TimeoutError' || err.message === 'Failed to fetch');
}

/**
 * Checks if an error is a server error (HTTP status code 5xx).
 */
export function isInternalServerError(err: unknown): boolean {
  if (err && typeof err === 'object' && 'response' in err) {
    const { response } = err as { response?: { status?: number } };
    if (response && typeof response.status === 'number' && response.status >= 500) {
      return true;
    }
  }
  return false;
}
