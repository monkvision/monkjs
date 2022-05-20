import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Chip } from 'react-native-paper';

import { Capture, Controls, useSettings, Actions } from '@monkvision/camera';
import monk from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';

import * as names from 'screens/names';
import useAuth from 'hooks/useAuth';

const mapTasksToSights = [{
  id: 'sLu0CfOt',
  task: { name: monk.types.TaskName.IMAGES_OCR, image_details: { image_type: 'VIN' } },
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

  const { isAuthenticated } = useAuth();

  const { inspectionId, sightIds, taskName } = route.params;

  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);

  const handleNavigate = useCallback(() => {
    navigation.navigate(names.LANDING, { inspectionId });
  }, [inspectionId, navigation]);

  const handleSuccess = useCallback(async () => {
    if (success) {
      setCameraLoading(true);

      try {
        const { entities, result } = await monk.entity.task.updateOne(inspectionId, taskName, {
          status: monk.types.ProgressStatusUpdate.TODO,
        });

        dispatch(monk.actions.gotOneTask({ entities, result, inspectionId }));
        setCameraLoading(false);

        handleNavigate();
      } catch (err) {
        utils.log([`Error after taking picture: ${err}`], 'error');
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName]);

  const handleChange = useCallback((state) => {
    if (!success) {
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
        utils.log([`Error handling Capture state change: ${err}`], 'error');
        throw err;
      }
    }
  }, [success]);

  const captureRef = useRef();
  const settings = useSettings({ camera: captureRef.current?.camera });
  const resolution = useMemo(() => (settings.state.resolution === 'FHD' ? 'QHD' : 'FHD'), [settings.state.resolution]);
  const setSettings = useCallback(
    () => settings.dispatch({ type: Actions.settings.UPDATE_SETTINGS, payload: { resolution } }),
    [resolution],
  );
  const resolutionChildren = useMemo(() => (<Chip onPress={setSettings}>{resolution}</Chip>
  ), [settings, resolution]);

  const controls = [
    { onPress: () => {}, style: {}, children: resolutionChildren },
    { disabled: cameraLoading, ...Controls.CaptureButtonProps },
    { disabled: true, style: {} },
  ];

  useEffect(() => { if (success) { handleSuccess(); } }, [handleSuccess, success]);

  if (!isAuthenticated) {
    return <View />;
  }

  return (
    <Capture
      ref={captureRef}
      task={taskName}
      mapTasksToSights={mapTasksToSights}
      sightIds={sightIds}
      inspectionId={inspectionId}
      controls={controls}
      loading={cameraLoading}
      onReady={() => setCameraLoading(false)}
      onStartUploadPicture={() => setCameraLoading(true)}
      onFinishUploadPicture={() => setCameraLoading(false)}
      onChange={handleChange}
      settings={settings}

      // Case with Upload Center (enableComplianceCheck set to `true`)
      // enableComplianceCheck={enableComplianceCheck}
      // onComplianceCheckFinish={() => setSuccess(true)}
    />
  );
}
