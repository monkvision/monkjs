import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { CameraView, useFakeActivity } from '@monkvision/react-native-views';
import useRequest from 'hooks/useRequest';

import { GETTING_STARTED, LANDING } from 'screens/names';

import {
  createOneInspection,
  addOneImageToInspection,
  updateOneTaskOfInspection,
  config,
} from '@monkvision/corejs';

const initialInspectionData = { tasks: { damage_detection: { status: 'NOT_STARTED' } } };

export default () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inspectionId, setInspectionId] = useState();

  const { isLoading } = useRequest(
    createOneInspection({ data: initialInspectionData }),
    { onSuccess: ({ result }) => setInspectionId(result) },
  );

  const { isLoading: isFinishing, request: updateTask } = useRequest(
    updateOneTaskOfInspection({
      inspectionId,
      taskName: 'damage_detection',
      data: { status: 'TODO' },
    }),
    { onSuccess: ({ result }) => navigation.navigate(LANDING, { inspectionId: result }) },
    false,
  );

  const [fakeActivity] = useFakeActivity(isLoading || isFinishing);

  const handleSuccess = useCallback(() => {
    updateTask();
  }, [updateTask]);

  const handleClose = useCallback(() => {
    navigation.navigate(GETTING_STARTED);
  }, [navigation]);

  const handleTakePicture = useCallback((picture) => {
    if (!inspectionId) { return; }

    const baseParams = {
      inspectionId,
      headers: { ...config.axiosConfig, 'Content-Type': 'multipart/form-data' },
    };

    const multiPartKeys = {
      image: 'image',
      json: 'json',
      filename: `${picture.sight.id}-${inspectionId}.png`,
      type: 'image/png',
    };

    const jsonData = JSON.stringify({
      acquisition: {
        strategy: 'upload_multipart_form_keys',
        file_key: multiPartKeys.image,
      },
      tasks: ['damage_detection'],
    });

    fetch(picture.source.uri).then((res) => res.blob())
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
  }, [dispatch, inspectionId]);

  return (
    <CameraView
      isLoading={fakeActivity}
      onTakePicture={handleTakePicture}
      onSuccess={handleSuccess}
      onCloseCamera={handleClose}
      theme={theme}
    />
  );
};
