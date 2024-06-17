import { useAnalytics } from '@monkvision/analytics';
import { useEffect } from 'react';
import { MonkAppState } from './appState';

export function useAppStateAnalytics({ inspectionId }: Pick<MonkAppState, 'inspectionId'>): void {
  const { setUserId } = useAnalytics();

  useEffect(() => {
    if (inspectionId) {
      setUserId(inspectionId);
    }
  }, [inspectionId, setUserId]);
}
