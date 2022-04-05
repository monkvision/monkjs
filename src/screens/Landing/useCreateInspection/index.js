import { upsertOne } from '@monkvision/corejs/src/inspections';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRequestState } from '@monkvision/toolkit';
import monk from '@monkvision/corejs';

const TASKS_BY_MOD = {
  car360: 'damage_detection',
  wheelAnalysis: 'wheel_analysis',
  repairEstimate: 'repair_estimate',
  imageOCR: 'image_ocr',
  video: 'video',
};

export default function useCreateInspection(captureMod) {
  const dispatch = useDispatch();
  const [inspectionId, setInspectionId] = useState([]);

  const data = useMemo(() => ({
    tasks: { [TASKS_BY_MOD[captureMod]]: { status: 'NOT_STARTED' } },
  }), [captureMod]);

  const createOneInspection = useCallback(
    async () => monk.entity.inspection.upsertOne({ data }),
    [data],
  );

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    setInspectionId(result);
    dispatch(monk.actions.gotOneInspection({ entities, result }));
  }, [dispatch]);

  const request = useRequestState(
    createOneInspection,
    handleRequestSuccess,
    () => false,
  );

  return [request, inspectionId];
}
