/**
 * Enumeration of the different network quality levels detected by the `useNetworkStatus` hook.
 */
export enum NetworkQuality {
  /**
   * The device has no network connection at all.
   */
  OFFLINE = 'offline',
  /**
   * The device is connected but the connection is too poor for uploads to reliably go through (repeated network
   * failures, very low upload throughput...).
   */
  POOR = 'poor',
  /**
   * The connection is good enough for uploads to go through.
   */
  GOOD = 'good',
}

/**
 * A network sample reported to the `useNetworkStatus` hook, usually after an upload completes or fails.
 */
export interface NetworkSample {
  /**
   * The size in bytes of the payload that was sent.
   */
  bytes?: number;
  /**
   * The total duration of the request in milliseconds.
   */
  durationMs?: number;
  /**
   * Boolean indicating if the request failed because of a network error (offline, timeout...), not for other reasons.
   */
  failed?: boolean;
}

/**
 * Subset of the Network Information API used by the `useNetworkStatus` hook.
 */
export interface NetworkInformationLike extends EventTarget {
  /**
   * The effective connection type (`slow-2g`, `2g`, `3g` or `4g`).
   */
  effectiveType?: string;
  /**
   * The estimated round-trip time in milliseconds.
   */
  rtt?: number;
}
