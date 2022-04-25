import React, { useCallback, useEffect, useState } from 'react';
import { Loader, ScreenView } from '@monkvision/ui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Capture, Controls, useUploads } from '@monkvision/camera';
import monk from '@monkvision/corejs';
import { useDispatch } from 'react-redux';
import * as names from 'screens/names';
import useAuth from 'hooks/useAuth';

import styles from './styles';

const mapTasksToSights = [{
  id: 'sLu0CfOt',
  task: {
    name: 'images_ocr',
    image_details: {
      image_type: 'VIN',
    },
  },
}, {
  id: 'xQKQ0bXS',
  tasks: ['wheel_analysis', 'damage_detection'],
  payload: {},
}, {
  id: '8_W2PO8L',
  tasks: ['wheel_analysis', 'damage_detection'],
  payload: {},
}, {
  id: 'rN39Y3HR',
  tasks: ['wheel_analysis', 'damage_detection'],
  payload: {},
}, {
  id: 'PuIw17h0',
  tasks: ['wheel_analysis', 'damage_detection'],
  payload: {},
}];

export default function InspectionCapture() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const { inspectionId, sightIds, taskName } = route.params;

  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const uploads = useUploads({ sightIds });

  const handleNavigate = useCallback(() => {
    navigation.navigate(names.LANDING, { inspectionId });
  }, [inspectionId, navigation]);

  const handleSuccess = useCallback(async () => {
    if (success) {
      setCameraLoading(true);

      try {
        const params = { inspectionId, name: taskName, data: { status: 'TODO' } };
        const payload = await monk.entity.task.updateOne(params);
        const { entities, result } = payload;

        dispatch(monk.actions.gotOneTask({ entities, result, inspectionId }));
        setCameraLoading(false);

        handleNavigate();
      } catch (e) {
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName]);

  const handleChange = useCallback((state) => {
    if (!success) {
      const { takenPictures, tour } = state.sights.state;
      const totalPictures = Object.keys(tour).length;
      const uploadState = Object.values(state.uploads.state);

      const fulfilledUploads = uploadState.filter(({ status }) => status === 'fulfilled').length;
      const retriedUploads = uploadState.filter(({ requestCount }) => requestCount > 1).length;

      const hasPictures = Object.keys(takenPictures).length === totalPictures;
      const hasBeenUploaded = (
        fulfilledUploads === totalPictures
       || retriedUploads >= totalPictures - fulfilledUploads
      );

      if (hasPictures && hasBeenUploaded) {
        setSuccess(true);
      }
    }
  }, [success]);

  const controls = [{
    disabled: cameraLoading,
    ...Controls.CaptureButtonProps,
  }];

  useEffect(() => { handleSuccess(); }, [handleSuccess, success]);

  if (!isAuthenticated) {
    return (
      <ScreenView style={styles.safeArea}>
        <Loader />
      </ScreenView>
    );
  }

  return (
    <Capture
      task={taskName}
      mapTasksToSights={mapTasksToSights}
      sightIds={sightIds}
      inspectionId={inspectionId}
      controls={controls}
      loading={cameraLoading}
      uploads={uploads}
      onReady={() => setCameraLoading(false)}
      onStartUploadPicture={() => setCameraLoading(true)}
      onFinishUploadPicture={() => setCameraLoading(false)}
      onChange={handleChange}
    />
  );
}
