import monk from '@monkvision/corejs';
import { useRequest, utils } from '@monkvision/toolkit';
import useAuth from 'hooks/useAuth';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { setTag } from '../../../config/sentryPlatform';

export default function useCreateInspection(vin) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [inspectionId, setInspectionId] = useState();

  const axiosRequest = useCallback(async () => {
    const taskOptions = { status: monk.types.ProgressStatusUpdate.NOT_STARTED };
    const tasks = {
      wheelAnalysis: { ...taskOptions, useLongshots: true },
      damageDetection: taskOptions,
      ...(vin ? {} : { imagesOcr: taskOptions }),
    };

    return monk.entity.inspection.createOne({ tasks, vehicle: { vin } });
  }, [vin]);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    setInspectionId(result);
    // setTag('inspection_id', result);
    utils.log(['[Event] Starting inspection', result]);
    dispatch(monk.actions.gotOneInspection({ entities, result }));
  }, [dispatch]);

  const canRequest = useCallback(() => isAuthenticated, [isAuthenticated]);

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: handleRequestSuccess,
    canRequest,
  });

  return { ...request, inspectionId };
}
