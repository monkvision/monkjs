import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Alert, Platform, View } from 'react-native';

import { Capture, Controls, useSettings } from '@monkvision/camera';
import monk from '@monkvision/corejs';
import { useError } from '@monkvision/toolkit';

import * as names from 'screens/names';
import Settings from './settings';
import styles from './styles';
import Sentry from '../../config/sentry';
import useSnackbar from '../../hooks/useSnackbar';

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

const enableComplianceCheck = true;

export default function InspectionCapture() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { errorHandler, Constants } = useError(Sentry);
  const { t } = useTranslation();
  const { colors } = useTheme();

  const { inspectionId, sightIds, taskName } = route.params;

  const [isFocused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const { setShowMessage, Notice } = useSnackbar();

  const handleNavigate = useCallback((confirm = false) => {
    if (confirm) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        const ok = window.confirm(t('capture.quit.title'));
        if (ok) {
          errorHandler(new Error('User suddenly quit the inspection'), Constants.type.APP);
          navigation.navigate(names.LANDING, { inspectionId });
        }
      }

      Alert.alert(
        t('capture.quit.title'),
        t('capture.quit.message'),
        [{
          text: t('capture.quit.cancel'),
          style: 'cancel',
        }, {
          text: t('capture.quit.ok'),
          onPress: () => {
            errorHandler(new Error('User suddenly quit the inspection'), Constants.type.APP);
            navigation.navigate(names.LANDING, { inspectionId });
          },
        }],
        { cancelable: true },
      );
    } else { navigation.navigate(names.LANDING, { inspectionId }); }
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
        errorHandler(err, Constants.type.HTTP, {
          inspectionId, taskName, status: monk.types.ProgressStatusUpdate.TODO,
        });
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName, isFocused]);

  const handleChange = useCallback((state) => {
    if (!success && isFocused && !enableComplianceCheck) {
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
        const hasFailedUploadButNoCheck = ((failedUploads + fulfilledUploads) === totalPictures);

        if (hasPictures && (hasBeenUploaded || hasFailedUploadButNoCheck) && state
        && hasAllFulfilledAndCompliant) {
          setSuccess(true);
        }
      } catch (err) {
        errorHandler(err, Constants.type.APP, state);
        throw err;
      }
    }
  }, [success, isFocused]);

  const captureRef = useRef();

  const settings = useSettings({ camera: captureRef.current?.camera });
  const settingsRef = useRef();
  const openSettings = settingsRef.current?.open;

  const controls = [
    { disabled: cameraLoading, ...Controls.SettingsButtonProps, onPress: openSettings },
    { disabled: cameraLoading, ...Controls.CaptureButtonProps },
    { disabled: cameraLoading, onPress: () => handleNavigate(true), ...Controls.GoBackButtonProps },
  ];

  useEffect(() => { if (success) { handleSuccess(); } }, [handleSuccess, success]);

  useFocusEffect(() => {
    setFocused(true);
    return () => setFocused(false);
  });

  return (
    <View style={styles.root}>
      <Settings ref={settingsRef} settings={settings} />
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
        onWarningMessage={(message) => setShowMessage(message)}
        onChange={handleChange}
        settings={settings}
        enableComplianceCheck={enableComplianceCheck}
        onComplianceCheckFinish={() => setSuccess(true)}
        colors={colors}
        Sentry={Sentry}
      />
      <Notice />
    </View>
  );
}
