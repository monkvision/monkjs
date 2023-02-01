import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';

export default function useUpdateInspectionVehicle(id, vin, refetchInspection) {
  const dispatch = useDispatch();

  const axiosRequest = useCallback(
    async () => monk.entity.vehicle.updateOne(id, { vin }),
    [id, vin],
  );

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.updatedOneVehicle({ entities, result }));
    refetchInspection();
  }, [dispatch]);

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: handleRequestSuccess,
  });

  return { ...request };
}
