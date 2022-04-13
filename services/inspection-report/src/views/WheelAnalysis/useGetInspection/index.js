import { useRequest } from '@monkvision/toolkit';
import isEmpty from 'lodash.isempty';
import { denormalize } from 'normalizr';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import monk from '@monkvision/corejs';

export default function useGetInspection(id) {
  const dispatch = useDispatch();

  const inspectionEntity = useSelector((state) => monk.entity.inspection.selectors
    .selectById(state, id));

  const vehicleEntity = useSelector((state) => monk.entity.vehicle.selectors
    .selectById(state, inspectionEntity ? inspectionEntity.vehicle : ''));

  const inspectionEntities = useSelector(monk.entity.inspection.selectors.selectEntities);
  const imageEntities = useSelector(monk.entity.image.selectors.selectEntities);
  const taskEntities = useSelector(monk.entity.task.selectors.selectEntities);
  const damagesEntities = useSelector(monk.entity.damage.selectors.selectEntities);
  const wheelAnalysisEntities = useSelector(monk.entity.wheelAnalysis.selectors.selectEntities);

  const { inspection } = denormalize(
    { inspection: id },
    {
      inspection: monk.schemas.inspection,
      wheelAnalysis: [monk.schemas.wheelAnalysis],
      tasks: [monk.schemas.task],
      images: [monk.schemas.images],
    },
    {
      inspections: inspectionEntities,
      images: imageEntities,
      tasks: taskEntities,
      damages: damagesEntities,
      vehicle: vehicleEntity,
      wheelAnalysis: wheelAnalysisEntities,
    },
  );

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.gotOneInspection({ entities, result }));
  }, [dispatch]);

  const shouldFetch = useCallback(
    (requestState) => !isEmpty(id)
      && !requestState.loading
      && requestState.count === 0,
    [id],
  );

  const axiosRequest = useCallback(async () => monk.entity.inspection.getOne({ id }), [id]);

  const request = useRequest(
    axiosRequest,
    handleRequestSuccess,
    shouldFetch,
  );

  return {
    ...request,
    inspectionId: id,
    imageEntities,
    inspection,
  };
}
