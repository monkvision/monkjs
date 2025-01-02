import { useAnalytics } from '@monkvision/analytics';
import { useMonitoring } from '@monkvision/monitoring';
import { decodeMonkJwt } from '@monkvision/network';
import { useEffect } from 'react';

/**
 * Parameters of the useTracking hook.
 */
export interface TrackingParams {
  /**
   * The inspection ID.
   */
  inspectionId: string;
  /**
   * The authentication token used to communicate with the API.
   */
  authToken: string;
}

/**
 * Custom hook used for adding tags and userId to analytics and monitoring provider.
 */
export function useTracking({ inspectionId, authToken }: TrackingParams) {
  const analytics = useAnalytics();
  const monitoring = useMonitoring();

  useEffect(() => {
    analytics.setUserId(inspectionId);
    monitoring.setTags({
      inspectionId,
    });
    const userId = decodeMonkJwt(authToken)?.sub;
    if (userId) {
      monitoring.setUserId(userId);
      analytics.setUserProperties({ authToken: userId });
    }
  }, [inspectionId, authToken]);
}
