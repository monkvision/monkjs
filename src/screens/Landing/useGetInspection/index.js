import { useRequest } from '@monkvision/toolkit';
import useAuth from 'hooks/useAuth';
import isEmpty from 'lodash.isempty';
import { denormalize } from 'normalizr';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import monk from '@monkvision/corejs';

export default function useGetInspection(id) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.getOne({ id }),
    [id],
  );

  const inspectionEntity = useSelector((state) => monk.entity.inspections.selectors
    .selectById(state, id));

  const imageEntities = useSelector(monk.entity.image.selectors.selectEntities);
  const taskEntities = useSelector(monk.entity.task.selectors.selectEntities);
  const damagesEntities = useSelector(monk.entity.damage.selectors.selectEntities);
  const vehicleEntities = useSelector(monk.entity.vehicle.selectors.selectEntities);
  const wheelAnalysisEntities = useSelector(monk.entity.wheelAnalysis.selectors.selectEntities);

  const { inspection } = denormalize(
    { inspection: id },
    { inspection: monk.schemas.inspection },
    {
      inspection: inspectionEntity,
      images: imageEntities,
      tasks: taskEntities,
      damages: damagesEntities,
      vehicle: vehicleEntities,
      wheelAnalysis: wheelAnalysisEntities,
    },
  );

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.gotOneInspection({ entities, result }));
  }, [dispatch]);

  const shouldFetch = useCallback(
    (requestState) => !isEmpty(id)
      && isAuthenticated
      && !requestState.loading
      && requestState.count === 0,
    [id, isAuthenticated],
  );

  const request = useRequest(
    axiosRequest,
    handleRequestSuccess,
    shouldFetch,
  );

  return { ...request, inspectionId: id };
}
