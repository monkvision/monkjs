import { useCallback, useEffect, useRef, useState } from 'react';
import { useObjectMemo } from './useObjectMemo';

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
   * Boolean indicating if the request failed because of a network error (offline, timeout...). Requests failing for
   * other reasons (4xx errors etc.) should not be reported as failed samples.
   */
  failed?: boolean;
}

/**
 * Options accepted by the `useNetworkStatus` hook.
 */
export interface NetworkStatusOptions {
  /**
   * The upload throughput (in kilobits per second) under which the connection is considered poor.
   *
   * @default 150
   */
  poorThroughputKbps?: number;
  /**
   * The number of consecutive failed samples after which the connection is considered poor.
   *
   * @default 2
   */
  poorFailureStreak?: number;
  /**
   * The amount of time (in milliseconds) the connection must stay stable before the quality is upgraded (e.g. from
   * `OFFLINE` to `GOOD`). This prevents the quality from flapping on unstable connections.
   *
   * @default 3000
   */
  recoveryStableMs?: number;
  /**
   * Since network quality is evaluated passively (using the reported samples), a `POOR` connection can only be
   * detected as better once a new sample is reported. To avoid staying stuck in the `POOR` state, the poor status is
   * automatically lifted after this delay (in milliseconds), giving the app a chance to try again. This delay is
   * doubled every time the connection is detected as poor again, up to 5 minutes, and is reset after a successful
   * sample.
   *
   * @default 30000
   */
  poorRecoveryDelayMs?: number;
}

/**
 * Handle returned by the `useNetworkStatus` hook.
 */
export interface NetworkStatusHandle {
  /**
   * Boolean indicating if the browser reports the device as online. Note that this value being `true` does not
   * guarantee that the internet is reachable (captive portals, Wi-Fi without internet...).
   */
  isOnline: boolean;
  /**
   * The current network quality.
   */
  quality: NetworkQuality;
  /**
   * The effective connection type (`slow-2g`, `2g`, `3g` or `4g`) reported by the Network Information API. This value
   * is only available on browsers supporting this API (it is not available on Safari for instance).
   */
  effectiveType?: string;
  /**
   * The estimated round-trip time in milliseconds reported by the Network Information API. This value is only
   * available on browsers supporting this API (it is not available on Safari for instance).
   */
  rttMs?: number;
  /**
   * Callback used to report a network sample (usually after an upload) in order to evaluate the network quality.
   */
  reportSample: (sample: NetworkSample) => void;
}

interface NetworkInformationLike extends EventTarget {
  effectiveType?: string;
  rtt?: number;
}

const MAX_POOR_RECOVERY_DELAY_MS = 5 * 60 * 1000;
const SLOW_EFFECTIVE_TYPES = ['slow-2g', '2g'];
const QUALITY_RANK: Record<NetworkQuality, number> = {
  [NetworkQuality.OFFLINE]: 0,
  [NetworkQuality.POOR]: 1,
  [NetworkQuality.GOOD]: 2,
};

function getConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === 'undefined') {
    return undefined;
  }
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

function getIsOnline(): boolean {
  return typeof navigator === 'undefined' || navigator.onLine !== false;
}

/**
 * Custom hook used to monitor the network availability and quality of the device.
 *
 * Network availability is detected using the browser's `online` / `offline` events. Since there is no reliable way to
 * measure the network quality on every browser (the Network Information API is not available on Safari), the quality
 * is evaluated passively using the samples reported via the `reportSample` callback (usually after each upload), and
 * using the Network Information API as a hint when available.
 *
 * @see NetworkQuality
 * @see NetworkStatusOptions
 */
export function useNetworkStatus({
  poorThroughputKbps = 150,
  poorFailureStreak = 2,
  recoveryStableMs = 3000,
  poorRecoveryDelayMs = 30000,
}: NetworkStatusOptions = {}): NetworkStatusHandle {
  const [isOnline, setIsOnline] = useState(getIsOnline);
  const [isDegraded, setIsDegraded] = useState(false);
  const [connectionInfo, setConnectionInfo] = useState(() => ({
    effectiveType: getConnection()?.effectiveType,
    rttMs: getConnection()?.rtt,
  }));
  const failureStreakRef = useRef(0);
  const poorRecoveryDelayRef = useRef(poorRecoveryDelayMs);

  const resetDegradation = useCallback(() => {
    failureStreakRef.current = 0;
    setIsDegraded(false);
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      resetDegradation();
    };
    const handleOffline = () => setIsOnline(false);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsOnline(getIsOnline());
        resetDegradation();
      }
    };
    const connection = getConnection();
    const handleConnectionChange = () =>
      setConnectionInfo({ effectiveType: connection?.effectiveType, rttMs: connection?.rtt });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    connection?.addEventListener?.('change', handleConnectionChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      connection?.removeEventListener?.('change', handleConnectionChange);
    };
  }, [resetDegradation]);

  const reportSample = useCallback(
    ({ bytes, durationMs, failed }: NetworkSample) => {
      if (failed) {
        failureStreakRef.current += 1;
        if (failureStreakRef.current >= poorFailureStreak) {
          setIsDegraded(true);
        }
        return;
      }
      failureStreakRef.current = 0;
      if (bytes && durationMs && durationMs > 0) {
        const throughputKbps = (bytes * 8) / durationMs;
        const isSlow = throughputKbps < poorThroughputKbps;
        if (!isSlow) {
          poorRecoveryDelayRef.current = poorRecoveryDelayMs;
        }
        setIsDegraded(isSlow);
        return;
      }
      poorRecoveryDelayRef.current = poorRecoveryDelayMs;
      setIsDegraded(false);
    },
    [poorThroughputKbps, poorFailureStreak, poorRecoveryDelayMs],
  );

  useEffect(() => {
    if (!isDegraded) {
      return undefined;
    }
    const delay = poorRecoveryDelayRef.current;
    poorRecoveryDelayRef.current = Math.min(delay * 2, MAX_POOR_RECOVERY_DELAY_MS);
    const timeout = setTimeout(resetDegradation, delay);
    return () => clearTimeout(timeout);
  }, [isDegraded, resetDegradation]);

  const isSlowConnectionType =
    !!connectionInfo.effectiveType && SLOW_EFFECTIVE_TYPES.includes(connectionInfo.effectiveType);
  let rawQuality = NetworkQuality.GOOD;
  if (!isOnline) {
    rawQuality = NetworkQuality.OFFLINE;
  } else if (isDegraded || isSlowConnectionType) {
    rawQuality = NetworkQuality.POOR;
  }

  const [quality, setQuality] = useState(rawQuality);

  useEffect(() => {
    if (QUALITY_RANK[rawQuality] <= QUALITY_RANK[quality]) {
      setQuality(rawQuality);
      return undefined;
    }
    const timeout = setTimeout(() => setQuality(rawQuality), recoveryStableMs);
    return () => clearTimeout(timeout);
  }, [rawQuality, quality, recoveryStableMs]);

  return useObjectMemo({
    isOnline,
    quality,
    effectiveType: connectionInfo.effectiveType,
    rttMs: connectionInfo.rttMs,
    reportSample,
  });
}
