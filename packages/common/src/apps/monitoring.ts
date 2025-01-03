import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useMonitoring } from '@monkvision/monitoring';
import { MonkAppState, PhotoCaptureAppState } from './appState';

export function useAppStateMonitoring({
  authToken,
  inspectionId,
  vehicleType,
  steeringWheel,
}: Partial<
  Pick<MonkAppState, 'authToken' | 'inspectionId'> &
    Pick<PhotoCaptureAppState, 'vehicleType' | 'steeringWheel'>
>): void {
  const { setTags, setUserId } = useMonitoring();

  useEffect(() => {
    setTags({
      inspectionId,
      vehicleType,
      steeringWheel,
    });
  }, [inspectionId, vehicleType, steeringWheel, setTags]);

  useEffect(() => {
    const userId = authToken ? jwtDecode(authToken).sub : undefined;
    if (userId) {
      setUserId(userId);
    }
  }, [authToken, setUserId]);
}
