import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useTheme } from 'react-native-paper';
import { Alert, Platform, View } from 'react-native';

import { Capture, Controls } from '@monkvision/camera';
import monk, { useMonitoring, MonitoringStatus, SentryTransaction, SentryOperation, SentryTag } from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';

import * as names from 'screens/names';
import mapTasksToSights from './mapTasksToSights';
import styles from './styles';
import useSnackbar from '../../hooks/useSnackbar';
import useFullscreen from './useFullscreen';

const enableComplianceCheck = true;

export default function InspectionCapture() {
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { errorHandler, measurePerformance } = useMonitoring();

  const { inspectionId, sightIds, taskName, vehicleType, selectedMode } = route.params;

  const [isFocused, setFocused] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const { setShowMessage, Notice } = useSnackbar();
  const captureTourTransRef = useRef({});
  const { isFullscreen, requestFullscreen } = useFullscreen();

  const handleNavigate = useCallback((confirm = false) => {
    if (confirm) {
      if (Platform.OS === 'web') {
        // eslint-disable-next-line no-alert
        const ok = window.confirm(t('capture.quit.title'));
        if (ok) {
          /**
           * cancel 'Capture Tour' transaction and navigate back to landing page
           */
          utils.log(['[Click]', 'User suddenly quit the inspection']);
          captureTourTransRef.current.transaction.finish(MonitoringStatus.CANCELLED);
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
            /**
             * cancel 'Capture Tour' transaction and navigate back to landing page
             */
            utils.log(['[Click]', 'User suddenly quit the inspection']);
            captureTourTransRef.current.transaction.finish(MonitoringStatus.CANCELLED);
            navigation.navigate(names.LANDING, { inspectionId });
          },
        }],
        { cancelable: true },
      );
    } else { navigation.navigate(names.LANDING, { inspectionId }); }
  }, [inspectionId, navigation]);

  const getTaskName = useCallback((task) => (typeof task === 'string' ? task : task?.name), []);

  const mapTaskBySightToTasknames = useCallback((taskBySight) => {
    const task = getTaskName(taskBySight.task);
    const tasks = taskBySight.tasks ? taskBySight.tasks.map(getTaskName) : [];
    return [...tasks, task].filter((name) => !!name);
  }, [getTaskName]);

  const handleSuccess = useCallback(async () => {
    if (success && isFocused) {
      setCameraLoading(true);

      try {
        const promises = Object.values(mapTasksToSights)
          .filter(((taskBySight) => sightIds.includes(taskBySight.id)))
          .map(mapTaskBySightToTasknames)
          .flat()
          .concat([taskName])
          .filter((name, index, taskNames) => taskNames.indexOf(name) === index)
          .map((name) => new Promise((resolve) => {
            monk.entity.task.updateOne(inspectionId, name, {
              status: monk.types.ProgressStatusUpdate.TODO,
            }).then(({ entities, result }) => {
              dispatch(monk.actions.gotOneTask({ entities, result, inspectionId }));
              resolve(name);
            });
          }));

        await Promise.all(promises);
        setCameraLoading(false);

        /**
         * finish 'capture tour' transaction and navigate back to landing page
         */
        utils.log(['[Event] Back to landing page with photo taken']);
        captureTourTransRef.current.transaction.finish();
        handleNavigate();
      } catch (err) {
        errorHandler(err);
        setCameraLoading(false);
      }
    }
  }, [dispatch, handleNavigate, inspectionId, success, taskName, isFocused]);

  const handleChange = useCallback((state) => {
    /**
     * add takenPictures tag in "Capture Tour" transaction for a tour
     */
    const takenPicturesLen = Object.values(state.sights.state.takenPictures).length;
    const refObj = captureTourTransRef.current;
    if (takenPicturesLen && refObj.transaction && takenPicturesLen !== refObj.takenPictures) {
      refObj.takenPictures = takenPicturesLen;
      refObj.transaction.setTag(SentryTag.TAKEN_PICTURES, takenPicturesLen);
    }
    //
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
        errorHandler(err);
        // eslint-disable-next-line no-console
        console.error(err);
        throw err;
      }
    }
  }, [success, isFocused]);

  const captureRef = useRef();

  const controls = [
    {
      disabled: cameraLoading,
      ...Controls.getFullScreenButtonProps(isFullscreen),
      onPress: requestFullscreen,
    },
    [
      { disabled: cameraLoading, ...Controls.AddDamageButtonProps },
      { disabled: cameraLoading, ...Controls.CaptureButtonProps },
    ],
    { disabled: cameraLoading, onPress: () => handleNavigate(true), ...Controls.GoBackButtonProps },
  ];

  const onRetakeAll = useCallback(() => {
    captureTourTransRef.current.hasRetakeCalled = true;
    captureTourTransRef.current.transaction.setTag(SentryTag.IS_RETAKE, 1);
  }, []);
  const onSkipRetake = useCallback(() => {
    captureTourTransRef.current.transaction.setTag(SentryTag.IS_SKIP, 1);
  }, []);
  const onRetakeNeeded = useCallback(({ retakesNeeded = 0 }) => {
    if (!captureTourTransRef.current.hasRetakeCalled) {
      const { transaction } = captureTourTransRef.current;
      const percentOfNonCompliancePics = ((100 * retakesNeeded) / sightIds.length);
      transaction.setTag(SentryTag.RETAKEN_PICTURES, retakesNeeded);
      transaction.setTag(SentryTag.PERCENT_OF_NON_COMPLIANCE_PICS, percentOfNonCompliancePics);
    }
  }, []);

  useEffect(() => { if (success) { handleSuccess(); } }, [handleSuccess, success]);

  useEffect(() => {
    /**
     * create a new transaction with operation name 'Capture Tour' to measure tour performance
     */
    const transaction = measurePerformance(
      SentryTransaction.PICTURE_PROCESSING,
      SentryOperation.CAPTURE_TOUR,
    );
    // set tags to identify a transation and relate with an inspection
    transaction.setTag(SentryTag.TASK, taskName);
    transaction.setTag(SentryTag.INSPECTION_ID, inspectionId);
    transaction.setTag(SentryTag.IS_SKIP, 0);
    transaction.setTag(SentryTag.IS_RETAKE, 0);
    transaction.setTag(SentryTag.TAKEN_PICTURES, 0);
    transaction.setTag(SentryTag.RETAKEN_PICTURES, 0);
    captureTourTransRef.current = {
      transaction,
      takenPictures: 0,
      hasRetakeCalled: false,
    };
  }, []);

  useFocusEffect(() => {
    setFocused(true);
    return () => setFocused(false);
  });

  return (
    <View style={styles.root}>
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
        onRetakeAll={onRetakeAll}
        onSkipRetake={onSkipRetake}
        onRetakeNeeded={onRetakeNeeded}
        enableCarCoverage
        enableComplianceCheck={enableComplianceCheck}
        onComplianceCheckFinish={() => setSuccess(true)}
        colors={colors}
        vehicleType={vehicleType}
        selectedMode={selectedMode}
      />
      <Notice />
    </View>
  );
}
