import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, View } from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import { Capture, Controls, useSettings } from '@monkvision/camera';
import monk from '@monkvision/corejs';
import { useError, utils } from '@monkvision/toolkit';

import * as names from 'screens/names';
import useAuth from 'hooks/useAuth';

const mapTasksToSights = [{
  id: 'sLu0CfOt',
  task: {
    name: monk.types.TaskName.IMAGES_OCR,
    image_details: { image_type: monk.types.ImageOcrType.VIN },
  },
}, {
  id: 'xQKQ0bXS',
  task: {
    name: monk.types.TaskName.WHEEL_ANALYSIS,
    image_details: { wheel_name: monk.types.WheelType.WHEEL_FRONT_LEFT },
  },
  payload: {},
}, {
  id: '8_W2PO8L',
  task: {
    name: monk.types.TaskName.WHEEL_ANALYSIS,
    image_details: { wheel_name: monk.types.WheelType.WHEEL_BACK_LEFT },
  },
  payload: {},
}, {
  id: 'rN39Y3HR',
  task: {
    name: monk.types.TaskName.WHEEL_ANALYSIS,
    image_details: { wheel_name: monk.types.WheelType.WHEEL_BACK_RIGHT },
  },
  payload: {},
}, {
  id: 'PuIw17h0',
  task: {
    name: monk.types.TaskName.WHEEL_ANALYSIS,
    image_details: { wheel_name: monk.types.WheelType.WHEEL_FRONT_RIGHT },
  },
  payload: {},
}];

const enableComplianceCheck = false;

export default function InspectionCapture() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const errorHandler = useError();

  const { isAuthenticated } = useAuth();

  const { inspectionId, sightIds, taskName } = route.params;

  const [isFocused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const handleNavigate = useCallback(() => {
    navigation.navigate(names.LANDING, { inspectionId });
  }, [inspectionId, navigation]);

  const handleSuccess = useCallback(async () => {
    if (success && isFocused) {
      setCameraLoading(true);

      try {
        const { entities, result } = await monk.entity.task.updateOne(inspectionId, taskName, {
          status: monk.types.ProgressStatusUpdate.TODO,
        });

        dispatch(monk.actions.gotOneTask({ entities, result, inspectionId }));
        setCameraLoading(false);

        handleNavigate();
      } catch (err) {
        errorHandler(err);
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName, isFocused]);

  const handleChange = useCallback((state) => {
    if (!success && isFocused) {
      try {
        const { takenPictures, tour } = state.sights.state;
        const totalPictures = Object.keys(tour).length;
        const uploadState = Object.values(state.uploads.state);
        const complianceState = Object.values(state.compliance.state);

        const fulfilledUploads = uploadState.filter(({ status }) => status === 'fulfilled').length;
        const retriedUploads = uploadState.filter(({ requestCount }) => requestCount > 1).length;
        const failedUploads = uploadState.filter(({ status }) => status === 'rejected').length;

        const hasAllFulfilledAndCompliant = enableComplianceCheck && complianceState
          .every(({ result, status, id }) => (
            state.uploads.state[id].status === 'rejected'
            || (status === 'fulfilled' && result && Object.values(result?.data?.compliances)
              .every((e) => e.is_compliant === true || e.is_compliant === null))));

        const hasPictures = Object.keys(takenPictures).length === totalPictures;
        const hasBeenUploaded = (
          fulfilledUploads === totalPictures
          || retriedUploads >= totalPictures - fulfilledUploads
        );
        const hasFailedUploadButNoCheck = !enableComplianceCheck
          && ((failedUploads + fulfilledUploads) === totalPictures);

        if (hasPictures && (hasBeenUploaded || hasFailedUploadButNoCheck) && state
          && (!enableComplianceCheck || hasAllFulfilledAndCompliant)) {
          setSuccess(true);
        }
      } catch (err) {
        errorHandler(err);
        throw err;
      }
    }
  }, [success, isFocused]);

  const captureRef = useRef();

  const settings = useSettings({ camera: captureRef.current?.camera });

  const controls = [
    { disabled: cameraLoading, ...Controls.SettingsButtonProps },
    { disabled: cameraLoading, ...Controls.CaptureButtonProps },
    { disabled: cameraLoading, onPress: handleNavigate, ...Controls.GoBackButtonProps },
  ];

  useEffect(() => { if (success) { handleSuccess(); } }, [handleSuccess, success]);

  useFocusEffect(() => {
    setFocused(true);
    return () => setFocused(false);
  });

  return (
    <Capture
      ref={captureRef}
      task={taskName}
      mapTasksToSights={mapTasksToSights}
      sightIds={sightIds}
      inspectionId={inspectionId}
      isFocused={isFocused}
      controls={controls}
      loading={cameraLoading}
      onReady={() => setCameraLoading(false)}
      onStartUploadPicture={() => setCameraLoading(true)}
      onFinishUploadPicture={() => setCameraLoading(false)}
      onChange={handleChange}
      settings={settings}
    />
  );
}
