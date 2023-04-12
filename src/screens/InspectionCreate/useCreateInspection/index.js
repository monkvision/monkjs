import monk from '@monkvision/corejs';
import { useRequest, utils } from '@monkvision/toolkit';
import useAuth from 'hooks/useAuth';
import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function useCreateInspection(vehicle) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const [inspectionId, setInspectionId] = useState();

  const axiosRequest = useCallback(async () => {
    const taskOptions = { status: monk.types.ProgressStatusUpdate.NOT_STARTED };
    const tasks = {
      wheelAnalysis: {
        ...taskOptions,
        useLongshots: true,
      },
      damageDetection: {
        ...taskOptions,
        generate_subimages_parts: {},
      },
      ...(vehicle?.vin ? {} : { imagesOcr: taskOptions }),
    };

    return monk.entity.inspection.createOne({
      tasks,
      vehicle,
      damage_severity: { output_format: 'toyota' },
    });
  }, []);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    setInspectionId(result);
    // TODO: Add Monitoring code for setTag in MN-182
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
