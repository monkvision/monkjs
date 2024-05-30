import { useContext, useMemo } from 'react';
import { AnalyticsAdapter } from '../adapters';
import { AnalyticsContext } from './context';

/**
 * Custom hook that allows you to access the Analytics Context methods inside a component.
 */
export function useAnalytics(): AnalyticsAdapter {
  const adapter = useContext(AnalyticsContext);

  return useMemo(
    () => ({
      setUserId: adapter.setUserId.bind(adapter),
      setUserProperties: adapter.setUserProperties.bind(adapter),
      resetUser: adapter.resetUser.bind(adapter),
      trackEvent: adapter.trackEvent.bind(adapter),
      setEventsProperties: adapter.setEventsProperties.bind(adapter),
    }),
    [],
  );
}
