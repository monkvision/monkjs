import { NetworkStatusHandle, Queue } from '@monkvision/common';
import { NetworkQuality } from '@monkvision/types';
import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const MAX_CONCURRENT_DEFERRED_RETRIES = 2;
const MIN_DEFERRED_RETRY_DELAY_MS = 5000;
const MAX_DEFERRED_RETRY_DELAY_MS = 2 * 60 * 1000;
const MAX_AUTO_RETRY_FAILURES = 5;

/**
 * Retry flags that the useUploadRetryQueue hook reads and writes in the upload metadata.
 */
export interface DeferredRetryMetadata {
  /**
   * Whether the current attempt is a deferred retry.
   */
  isDeferredRetry: boolean;
  /**
   * Whether a newer item replaced this one: it is no longer retried.
   */
  isOutdated: boolean;
}

/**
 * Parameters of the useUploadRetryQueue hook.
 */
export interface UploadRetryQueueParams<T> {
  /**
   * Metadata of every upload, shared with the upload queue.
   */
  metadataRef: RefObject<Map<T, DeferredRetryMetadata>>;
  /**
   * The upload queue in which the retried uploads are pushed.
   */
  queueRef: RefObject<Queue<T> | null>;
  /**
   * The network status handle, used to auto retry once the connection is good again.
   */
  networkStatus?: NetworkStatusHandle;
  /**
   * Whether failed uploads are automatically retried once the connection is good again.
   */
  enableAutoRetry: boolean;
}

/**
 * Handle returned by the useUploadRetryQueue hook.
 */
export interface UploadRetryQueueHandle<T> {
  /**
   * The uploads waiting to be retried.
   */
  failedUploads: T[];
  /**
   * The number of failed uploads currently being retried.
   */
  retryingCount: number;
  /**
   * Retries every failed upload, at most 2 at a time.
   */
  retryFailed: () => void;
  /**
   * Stores an upload whose immediate retry is exhausted.
   */
  addFailedUpload: (upload: T) => void;
  /**
   * To call when a deferred retry ends. `failed` is `true` only for a retryable failure.
   */
  onDeferredRetryEnd: (upload: T, failed: boolean) => void;
  /**
   * Drops the failed and backlogged uploads matching `isOutdated`.
   */
  discardOutdated: (isOutdated: (upload: T) => boolean) => void;
}

/**
 * Keeps the uploads that failed because of a network or server issue, and retries them on demand or automatically
 * (with an exponential backoff applied once per retry round).
 */
export function useUploadRetryQueue<T>({
  metadataRef,
  queueRef,
  networkStatus,
  enableAutoRetry,
}: UploadRetryQueueParams<T>): UploadRetryQueueHandle<T> {
  const [failedUploads, setFailedUploads] = useState<T[]>([]);
  const [retryingCount, setRetryingCount] = useState(0);
  const failedUploadsRef = useRef(failedUploads);
  failedUploadsRef.current = failedUploads;
  const retryBacklogRef = useRef<T[]>([]);
  const inFlightRetriesRef = useRef(0);
  const deferredRetryDelayRef = useRef(0);
  const autoRetryFailuresRef = useRef(0);
  const roundHadFailureRef = useRef(false);
  const roundHadSuccessRef = useRef(false);

  const updateRetryingCount = () =>
    setRetryingCount(inFlightRetriesRef.current + retryBacklogRef.current.length);

  const pumpDeferredRetries = () => {
    while (
      inFlightRetriesRef.current < MAX_CONCURRENT_DEFERRED_RETRIES &&
      retryBacklogRef.current.length > 0
    ) {
      const upload = retryBacklogRef.current.shift() as T;
      inFlightRetriesRef.current += 1;
      queueRef.current?.push(upload);
    }
    updateRetryingCount();
  };

  // Concurrent retries of the same round share one outcome, so the backoff grows once per round, not once per item.
  const settleRoundIfOver = () => {
    if (inFlightRetriesRef.current > 0 || retryBacklogRef.current.length > 0) {
      return;
    }
    if (roundHadFailureRef.current) {
      autoRetryFailuresRef.current += 1;
      deferredRetryDelayRef.current = Math.min(
        Math.max(MIN_DEFERRED_RETRY_DELAY_MS, deferredRetryDelayRef.current * 2),
        MAX_DEFERRED_RETRY_DELAY_MS,
      );
    } else if (roundHadSuccessRef.current) {
      deferredRetryDelayRef.current = 0;
      autoRetryFailuresRef.current = 0;
    }
    roundHadFailureRef.current = false;
    roundHadSuccessRef.current = false;
  };

  const onDeferredRetryEnd = (upload: T, failed: boolean) => {
    inFlightRetriesRef.current = Math.max(0, inFlightRetriesRef.current - 1);
    if (failed) {
      const uploadsToPutBack = [upload, ...retryBacklogRef.current].filter((u) => {
        const metadata = metadataRef.current.get(u);
        if (metadata?.isOutdated) {
          metadataRef.current.delete(u);
          return false;
        }
        if (metadata) {
          metadata.isDeferredRetry = false;
        }
        return true;
      });
      retryBacklogRef.current = [];
      setFailedUploads((current) => [...current, ...uploadsToPutBack]);
      roundHadFailureRef.current = true;
    } else {
      const wasOutdated = metadataRef.current.get(upload)?.isOutdated;
      metadataRef.current.delete(upload);
      if (!wasOutdated) {
        roundHadSuccessRef.current = true;
      }
    }
    pumpDeferredRetries();
    settleRoundIfOver();
  };

  const retryFailedUploads = useCallback(() => {
    const uploadsToRetry = failedUploadsRef.current;
    if (uploadsToRetry.length === 0) {
      return;
    }
    setFailedUploads((current) => current.filter((upload) => !uploadsToRetry.includes(upload)));
    uploadsToRetry.forEach((upload) => {
      const metadata = metadataRef.current.get(upload);
      if (metadata) {
        metadata.isDeferredRetry = true;
      }
    });
    retryBacklogRef.current.push(...uploadsToRetry);
    pumpDeferredRetries();
  }, []);

  const retryFailed = useCallback(() => {
    autoRetryFailuresRef.current = 0;
    retryFailedUploads();
  }, [retryFailedUploads]);

  const addFailedUpload = useCallback((upload: T) => {
    setFailedUploads((current) => [...current, upload]);
  }, []);

  const discardOutdated = useCallback((isOutdated: (upload: T) => boolean) => {
    failedUploadsRef.current.filter(isOutdated).forEach((u) => metadataRef.current.delete(u));
    setFailedUploads((current) => current.filter((u) => !isOutdated(u)));
    if (retryBacklogRef.current.some(isOutdated)) {
      retryBacklogRef.current.filter(isOutdated).forEach((u) => metadataRef.current.delete(u));
      retryBacklogRef.current = retryBacklogRef.current.filter((u) => !isOutdated(u));
      updateRetryingCount();
    }
  }, []);

  const quality = networkStatus?.quality;
  const hasFailedUploads = failedUploads.length > 0;
  useEffect(() => {
    if (
      !enableAutoRetry ||
      quality !== NetworkQuality.GOOD ||
      !hasFailedUploads ||
      retryingCount ||
      autoRetryFailuresRef.current >= MAX_AUTO_RETRY_FAILURES
    ) {
      return undefined;
    }
    const timeout = setTimeout(retryFailedUploads, deferredRetryDelayRef.current);
    return () => clearTimeout(timeout);
  }, [enableAutoRetry, quality, hasFailedUploads, retryingCount, retryFailedUploads]);

  return {
    failedUploads,
    retryingCount,
    retryFailed,
    addFailedUpload,
    onDeferredRetryEnd,
    discardOutdated,
  };
}
