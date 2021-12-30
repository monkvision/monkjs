import { useCallback, useMemo, useState } from 'react';
import isEmpty from 'lodash.isempty';

import { useDispatch } from 'react-redux';
import { useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';
import useToggle from 'hooks/useToggle';

import { createOneDamage, addOneViewToInspection, config } from '@monkvision/corejs';
import { Platform } from 'react-native';
import { snakeCase } from 'lodash';

function useDamages({ currentDamage, inspectionId, setCurrentDamage, handleCloseDrawer, refresh }) {
  const [isUploading, toggleUploadingOn, toggleUploadingOff] = useToggle();
  const [damagePictures, setDamagePictures] = useState([]);

  const dispatch = useDispatch();

  const handleAddViewPicture = useCallback(async (viewPicture, index) => {
    if (!inspectionId || !viewPicture.viewData) { return; }

    toggleUploadingOn();

    const filename = `${currentDamage.id}-${index}-${inspectionId}.jpg`;
    const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

    const headers = { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' };
    const baseParams = { inspectionId, headers };

    const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
    const json = JSON.stringify({
      ...viewPicture.viewData,
      new_image: { name: multiPartKeys.filename, acquisition },
    });

    const data = new FormData();
    data.append(multiPartKeys.json, json);

    if (Platform.OS === 'web') {
      const response = await fetch(viewPicture.source.base64);
      const blob = await response.blob();
      const file = await new File([blob], multiPartKeys.filename, { type: multiPartKeys.type });
      data.append(multiPartKeys.image, file);
    } else {
      data.append('image', {
        uri: viewPicture.source.uri,
        name: multiPartKeys.filename,
        type: multiPartKeys.type,
      });
    }

    await dispatch(addOneViewToInspection({ ...baseParams, data })).unwrap();
  }, [currentDamage.id, dispatch, inspectionId, toggleUploadingOn]);

  const createDamageViews = useCallback(async (damageId) => {
    if (isEmpty(damagePictures) || !damageId) {
      handleCloseDrawer();
      return;
    }
    const viewsPromises = [];
    toggleUploadingOn();
    damagePictures.forEach((source, i) => viewsPromises.push(
      handleAddViewPicture({
        source,
        viewData: {
          damage_id: damageId,
          // polygons: [[[0]]], // TODO
          // bounding_box: { xmin: 0, ymin: 0, width: 0, height: 0 }, // TODO
        },
      }, i),
    ));
    Promise.all(viewsPromises)
      .then(() => {
        toggleUploadingOff();
        handleCloseDrawer();
      })
      .catch(toggleUploadingOff);
  }, [damagePictures, handleAddViewPicture,
    handleCloseDrawer, toggleUploadingOff, toggleUploadingOn]);

  const { isLoading, request: createDamageRequest } = useRequest(
    createOneDamage({ inspectionId,
      data: {
        part_type: snakeCase(currentDamage.part_type),
        damage_type: snakeCase(currentDamage.damage_type),
      },
    }),
    {
      onSuccess: ({ result: id }) => {
        setCurrentDamage((old) => ({ ...old, id }));
        createDamageViews(id);
        handleCloseDrawer();
        refresh();
      } },
    false,
  );
  const isDamageValid = useMemo(() => currentDamage.part_type && currentDamage.damage_type,
    [currentDamage.damage_type, currentDamage.part_type]);

  const [damageIsLoading] = useFakeActivity(isLoading || isUploading);

  return {
    isUploading,
    createDamageRequest,
    damageIsLoading,
    isDamageValid,
    damagePicturesState: [damagePictures, setDamagePictures],
  };
}
export default useDamages;
