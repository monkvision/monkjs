/**
 * Error messages thrown by `fetch` when the request could not reach the server (offline, DNS failure, connection
 * dropped...). Each browser uses its own wording :
 * - Chrome / Edge : `Failed to fetch`
 * - Safari (macOS & iOS) : `Load failed`
 * - Firefox : `NetworkError when attempting to fetch resource.`
 */
const NETWORK_ERROR_MESSAGES = ['failed to fetch', 'load failed', 'networkerror'];

/**
 * Checks if an error is a network error, meaning that the request could not reach the server at all (no connection,
 * connection dropped, DNS failure...). This check is browser-agnostic (Chrome, Safari and Firefox).
 */
export function isNetworkError(err: unknown): boolean {
  if (!(err instanceof Error) || 'response' in err) {
    return false;
  }
  const message = err.message.toLowerCase();
  return NETWORK_ERROR_MESSAGES.some((networkMessage) => message.startsWith(networkMessage));
}

/**
 * Checks if an error is a timeout error (request timed out or failed to reach the server).
 */
export function isTimeoutError(err: unknown): boolean {
  return err instanceof Error && (err.name === 'TimeoutError' || isNetworkError(err));
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
