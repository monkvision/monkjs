import { useCallback, useMemo } from 'react';
import { monkApi } from '@monkvision/corejs';

import Constants from '../../const';
import Actions from '../../actions';

import getWebFileDataAsync from '../../utils/getWebFileDataAsync';
import log from '../../utils/log';

/**
 * @param current
 * @return {string}
 */
export function useTitle({ current }) {
  return useMemo(() => {
    if (!current.metadata) { return ''; }
    const { label, id } = current.metadata;

    if (Constants.PRODUCTION) { return label; }

    return `${label} - ${id}`;
  }, [current]);
}

/**
 * @param camera
 * @param current
 * @param sights
 * @return {function(): Promise<picture>}
 */
export function useTakePictureAsync({ camera, current, sights }) {
  return useCallback(async () => {
    log([`Awaiting picture to be taken...`]);
    const picture = await camera.takePictureAsync();
    log([`Camera 'takePictureAsync' has fulfilled with picture:`, picture]);

    const payload = { id: current.id, picture };
    sights.dispatch({ type: Actions.sights.SET_PICTURE, payload });

    return picture;
  }, [camera, current.id, sights]);
}

/**
 * @param sights
 * @return {((function(): void)|*)[]}
 */
export function useNavigationBetweenSights({ sights }) {
  const goPrevSight = useCallback(() => {
    sights.dispatch({ type: Actions.sights.PREVIOUS_SIGHT });
  }, [sights]);

  const goNextSight = useCallback(() => {
    sights.dispatch({ type: Actions.sights.NEXT_SIGHT });
  }, [sights]);

  return [goPrevSight, goNextSight];
}

/**
 * @return {function(tasks=, compliances=): Promise<data>}
 */
export function useCreateDamageDetectionAsync() {
  return useCallback(async (
    tasks = { damage_detection: { status: 'NOT_STARTED' } },
    compliances = { iqc_compliance: {} },
  ) => {
    const result = await monkApi.inspections.createOne({ data: { tasks, compliances } });
    return result.data;
  }, []);
}

/**
 * @param inspectionId
 * @param sights
 * @param uploads
 * @return {(function({ inspectionId, sights, uploads }): Promise<result|error>)|*}
 */
export function useStartUploadAsync({ inspectionId, sights, uploads }) {
  return useCallback(async (picture) => {
    const { dispatch } = uploads;

    if (!inspectionId) {
      throw Error(`Please provide a valid "inspectionId". Got ${inspectionId}.`);
    }

    const { id, label } = sights.state.current.metadata;

    try {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, picture, status: 'pending', label },
      });

      const data = await getWebFileDataAsync(picture, sights, inspectionId);
      const result = await monkApi.images.addOne({ inspectionId, data });

      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        payload: { id, status: 'fulfilled' },
      });

      return result;
    } catch (err) {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, status: 'rejected', error: err },
      });

      return err;
    }
  }, [inspectionId, sights, uploads]);
}

/**
 * @param compliance
 * @param inspectionId
 * @return {(function(pictureId: string): Promise<result|error>)|*}
 */
export function useCheckComplianceAsync({ compliance, inspectionId }) {
  return useCallback(async (pictureId) => {
    const { dispatch } = compliance;
    const id = pictureId;

    if (!id) {
      throw Error(`Please provide a valid "pictureId". Got ${id}.`);
    }

    try {
      dispatch({
        type: Actions.compliance.UPDATE_COMPLIANCE,
        increment: true,
        payload: { id, status: 'pending' },
      });

      const result = await monkApi.images.getOne({ inspectionId, imageId: id });

      dispatch({
        type: Actions.compliance.UPDATE_COMPLIANCE,
        payload: { id, status: 'fulfilled', result },
      });

      return result;
    } catch (err) {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, status: 'rejected', error: err, result: null },
      });

      return err;
    }
  }, [compliance, inspectionId]);
}
