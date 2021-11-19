import React, { useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { CameraView } from '@monkvision/react-native-views';
import { GETTING_STARTED, INSPECTION_READ } from 'screens/names';

import {
  createOneInspection,
  addOneImageToInspection,
  updateOneTaskOfInspection,
  selectInspectionById,
  config,
} from '@monkvision/corejs';

const initialInspectionData = { tasks: { damage_detection: { status: 'NOT_STARTED' } } };

export default () => {
  const navigation = useNavigation();

  const store = useStore();
  const dispatch = useDispatch();

  const {
    loading,
    freshlyCreated,
    error,
  } = useSelector((state) => state.inspections);

  const inspection = selectInspectionById(store.getState(), freshlyCreated);

  const handleSuccess = useCallback(() => {
    const params = {
      inspectionId: inspection.id,
      taskName: 'damage_detection',
      data: { status: 'TODO' },
    };

    dispatch(updateOneTaskOfInspection(params));

    navigation.navigate(INSPECTION_READ, { inspectionId: inspection.id });
  }, [dispatch, inspection?.id, navigation]);

  const handleClose = useCallback(() => {
    navigation.navigate(GETTING_STARTED);
  }, [navigation]);

  const handleTakePicture = useCallback((picture) => {
    const baseParams = {
      inspectionId: inspection.id,
      headers: { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' },
    };

    const multiPartKeys = {
      image: 'image',
      json: 'json',
      filename: `${picture.sight.id}-${inspection.id}.png`,
      type: 'image/png',
    };

    const jsonData = JSON.stringify({
      acquisition: {
        strategy: 'upload_multipart_form_keys',
        file_key: multiPartKeys.image,
      },
      tasks: ['damage_detection'],
    });

    fetch(picture.source.uri).then((res) => res.blob()) // res.arrayBuffer()
      .then((buf) => new File(
        [buf], multiPartKeys.filename,
        { type: multiPartKeys.type },
      ))
      .then((imageFile) => {
        const data = new FormData();
        data.append(multiPartKeys.json, jsonData);
        data.append(multiPartKeys.image, imageFile);

        dispatch(addOneImageToInspection({ ...baseParams, data }));
      });
  }, [dispatch, inspection]);

  useEffect(() => {
    if (loading !== 'pending' && freshlyCreated === null && !error) {
      dispatch(createOneInspection({ data: initialInspectionData }));
    }
  }, [dispatch, error, freshlyCreated, loading]);

  return (
    <CameraView
      isLoading={loading === 'pending'}
      onTakePicture={handleTakePicture}
      onSuccess={handleSuccess}
      onCloseCamera={handleClose}
    />
  );
};
