import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';

import useAuth from 'hooks/useAuth';

export default function useUpdateInspectionVehicle(id, vin) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const axiosRequest = useCallback(async () => monk.entity.vehicle.updateOne(id, { vin }), []);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.gotOneVehicle({ entities, result }));
  }, [dispatch]);

  const canRequest = useCallback(() => isAuthenticated, [isAuthenticated]);

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: handleRequestSuccess,
    canRequest,
  });

  return { ...request };
}
