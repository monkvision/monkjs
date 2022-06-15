import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';
import isEmpty from 'lodash.isempty';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function useGetInspection(inspectionId) {
  const dispatch = useDispatch();

  const inspectionEntities = useSelector(monk.entity.inspection.selectors.selectEntities);
  const imageEntities = useSelector(monk.entity.image.selectors.selectEntities);
  const taskEntities = useSelector(monk.entity.task.selectors.selectEntities);
  const viewsEntities = useSelector(monk.entity.view.selectors.selectEntities);
  const damagesEntities = useSelector(monk.entity.damage.selectors.selectEntities);

  const inspection = inspectionEntities[inspectionId];
  const images = inspection
    ? Object.values(imageEntities).filter(({ id }) => inspection?.images?.includes(id))
    : [];
  const tasks = inspection
    ? Object.values(taskEntities).filter(({ id }) => inspection?.tasks?.includes(id))
    : [];
  const views = inspection
    ? Object
      .values(viewsEntities)
      .filter(({ imageRegion }) => inspection?.images?.includes(imageRegion.imageId))
    : [];
  const damages = views
    ? views
      .filter(({ elementId }) => inspection?.damages?.includes(elementId))
      .map((view) => ({ ...view, damageType: damagesEntities[view.elementId].damageType }))
    : [];

  const onRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.gotOneInspection({ entities, result }));
  }, [dispatch]);

  const canRequest = useCallback(
    (requestState) => !isEmpty(inspectionId)
      && !requestState.loading
      && requestState.count === 0,
    [inspectionId],
  );

  const axiosRequest = useCallback(
    async () => monk.entity.inspection.getOne(inspectionId),
    [inspectionId],
  );

  const request = useRequest({ request: axiosRequest, onRequestSuccess, canRequest });

  const getInspection = useCallback(async () => request.start(), []);

  useEffect(() => { getInspection(); }, []);

  return {
    ...request,
    damages,
    inspectionId,
    inspection,
    images,
    tasks,
  };
}
