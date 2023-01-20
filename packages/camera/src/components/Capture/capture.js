import { utils } from '@monkvision/toolkit';
import PropTypes from 'prop-types';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Constants from '../../const';
import log from '../../utils/log';

import AddDamageModal from '../AddDamageModal';
import AddDamageOverlay from '../AddDamageOverlay';

import AddDamageHelpModal from '../AddDamageModal/AddDamageHelpModal';
import useEventStorage from '../../hooks/useEventStorage';
import Camera from '../Camera';
import CloseEarlyConfirmModal from '../CloseEarlyConfirmModal';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import SelectedParts from '../SelectedParts';
import Sights from '../Sights';
import UploadCenter from '../UploadCenter';

import {
  useCheckComplianceAsync,
  useCreateDamageDetectionAsync,
  useNavigationBetweenSights,
  useSetPictureAsync,
  useStartUploadAsync,
  useTakePictureAsync,
  useTitle, useUploadAdditionalDamage,
} from './hooks';

const AddDamageStatus = {
  IDLE: 0,
  HELP: 1,
  PART_SELECTOR: 2,
  TAKE_PICTURE: 3,
};

const ADD_DAMAGE_HELP_EVENT_KEY = 'ADD_DAMAGE_HELP';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        left: 0,
        flex: '1 1 0%',
        display: 'flex',
      },
    }),
  },
  loading: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    justifyContent: 'center',
  },
  addDamageOverlay: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#000000BE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
});

const defaultNavigationOptions = {
  allowNavigate: false,
  allowRetake: true,
  allowSkip: false,
  allowSkipImageQualityCheck: true,
  retakeMaxTry: 1,
  retakeMinTry: 1,
};

const Capture = forwardRef(({
  additionalPictures,
  controls,
  controlsContainerStyle,
  enableComplianceCheck,
  enableCarCoverage,
  enableQHDWhenSupported,
  colors,
  footer,
  fullscreen,
  inspectionId,
  isFocused,
  isSubmitting,
  loading,
  navigationOptions,
  offline,
  onChange,
  onComplianceChange,
  onSettingsChange,
  onSightsChange,
  onUploadsChange,
  onCaptureTourFinish,
  onCameraPermissionError,
  onCameraPermissionSuccess,
  onComplianceCheckFinish,
  onComplianceCheckStart,
  onPictureUploaded,
  onWarningMessage,
  onReady,
  onRetakeAll,
  onRetakeNeeded,
  onSkipRetake,
  onStartUploadPicture,
  onFinishUploadPicture,
  orientationBlockerProps,
  primaryColor,
  sightsContainerStyle,
  style,
  task,
  mapTasksToSights,
  thumbnailStyle,
  uploads,
  compliance,
  sights,
  settings,
  compressionOptions,
  resolutionOptions,
}, combinedRefs) => {
  // STATES //
  const [isReady, setReady] = useState(false);
  const [addDamageStatus, setAddDamageStatus] = useState(AddDamageStatus.IDLE);
  const [addDamageParts, setAddDamageParts] = useState([]);
  const [closeEarlyModalState, setCloseEarlyModalState] = useState({
    show: false,
    message: {
      en: '',
      fr: '',
    },
  });
  const [endTour, setEndTour] = useState(false);

  const { camera, ref } = combinedRefs.current;
  const { current } = sights.state;

  const overlay = current?.metadata?.overlay || '';
  const title = useTitle({ current });

  /**
   * @type {{
     * settings: {zoom: number, ratio: string},
     * sights: {
       * dispatch: (function({}): void),
       * name: string,
       * state: {current, ids, remainingPictures, takenPictures: {}, tour},
     * },
     * compliance: {
       * dispatch: (function({}): void),
       * name: string,
       * state: {
         * status: string,
         * error,
         * requestCount:
         * number,
         * result: {
           * binary_size: number,
             * compliances: {
               * image_quality_assessment: {
                 * is_compliant: boolean,
                 * reason: string,
                 * status: string,
               * },
             * },
           * id: string,
           * image_height: number,
           * image_width: number,
           * name: string,
           * path: string,
         * },
       * },
     * },
     * isReady: boolean,
     * uploads: {
       * dispatch: (function({}): void),
       * name: string,
       * state: {picture, status: string, error: null, uploadCount: number},
     * }
   * }}
   */
  const states = useMemo(() => ({
    additionalPictures,
    compliance,
    isReady,
    settings,
    sights,
    uploads,
  }), [additionalPictures, compliance, isReady, settings, sights, uploads]);

  const hideAddDamage = useMemo(
    () => addDamageStatus === AddDamageStatus.TAKE_PICTURE,
    [addDamageStatus],
  );

  // END STATES //
  // METHODS //

  const { t } = useTranslation();
  const {
    lastEventTimestamp: lastAddDamageHelpTimestamp,
    fireEvent: fireAddDamageHelpEvent,
  } = useEventStorage({ key: ADD_DAMAGE_HELP_EVENT_KEY });
  const createDamageDetectionAsync = useCreateDamageDetectionAsync();
  const takePictureAsync = useTakePictureAsync({ camera, isFocused });
  const setPictureAsync = useSetPictureAsync({
    additionalPictures,
    addDamageParts,
    current,
    sights,
    uploads,
  });

  const checkComplianceParams = { compliance, inspectionId, sightId: current.id };
  const checkComplianceAsync = useCheckComplianceAsync(checkComplianceParams);
  const startUploadAsyncParams = {
    inspectionId,
    sights,
    uploads,
    task,
    mapTasksToSights,
    enableCarCoverage,
    onFinish: onCaptureTourFinish,
    onPictureUploaded,
    onWarningMessage,
    endTour,
  };
  const startUploadAsync = useStartUploadAsync(startUploadAsyncParams);
  const uploadAdditionalDamage = useUploadAdditionalDamage({ inspectionId });

  const [goPrevSight, goNextSight] = useNavigationBetweenSights({ sights });

  const api = useMemo(() => ({
    camera,
    checkComplianceAsync,
    createDamageDetectionAsync,
    goPrevSight,
    goNextSight,
    setPictureAsync,
    startUploadAsync,
    takePictureAsync,
    uploadAdditionalDamage,
  }), [
    camera, checkComplianceAsync, createDamageDetectionAsync,
    goNextSight, goPrevSight,
    setPictureAsync, startUploadAsync, takePictureAsync,
    uploadAdditionalDamage,
  ]);

  useImperativeHandle(ref, () => ({
    camera,
    checkComplianceAsync,
    createDamageDetectionAsync,
    goPrevSight,
    goNextSight,
    setPictureAsync,
    startUploadAsync,
    takePictureAsync,
  }));

  // END METHODS //
  // CONSTANTS //

  const windowDimensions = useWindowDimensions();
  const tourHasFinished = useMemo(
    () => Object.values(uploads.state).every(({ status, uploadCount }) => (status === 'rejected' || status === 'fulfilled') && uploadCount >= 1),
    [uploads.state],
  );
  const overlaySize = useMemo(
    () => utils.styles.getSize('4:3', windowDimensions, 'number'),
    [windowDimensions],
  );
  const complianceHasFulfilledAll = useMemo(
    () => Object
      .values(compliance.state)
      .every(({ status, id }) => status === 'fulfilled' || uploads.state[id].status === 'rejected' || uploads.state[id].uploadCount >= 1),
    [compliance.state, uploads.state],
  );

  // END CONSTANTS //
  // HANDLERS //

  const handleCameraReady = useCallback(() => {
    try {
      setReady(true);
      onReady(states, api);
    } catch (err) {
      log([`Error in \`<Capture />\` \`onReady()\`: ${err}`], 'error');
      throw err;
    }
  }, [api, onReady, states]);

  const handleAddDamagePressed = useCallback(() => {
    if (lastAddDamageHelpTimestamp) {
      setAddDamageStatus(AddDamageStatus.PART_SELECTOR);
    } else {
      setAddDamageStatus(AddDamageStatus.HELP);
    }
  }, [setAddDamageStatus, lastAddDamageHelpTimestamp]);

  const handleResetDamageStatus = useCallback(() => {
    setAddDamageStatus(AddDamageStatus.IDLE);
    setAddDamageParts([]);
  }, [setAddDamageStatus, setAddDamageParts]);

  const handlePartSelectorHelpConfirm = useCallback(() => {
    fireAddDamageHelpEvent();
    setAddDamageStatus(AddDamageStatus.PART_SELECTOR);
  }, [setAddDamageStatus, fireAddDamageHelpEvent]);

  const handlePartSelectorConfirm = useCallback((selectedParts) => {
    setAddDamageParts(selectedParts);
    setAddDamageStatus(AddDamageStatus.TAKE_PICTURE);
  }, [setAddDamageStatus]);

  const handleCloseCaptureEarly = useCallback(() => {
    setEndTour(true);
  }, [setEndTour]);

  const handleCloseEarlyClick = useCallback(({ confirm, confirmationMessage }) => {
    if (confirm) {
      setCloseEarlyModalState({
        show: true,
        message: confirmationMessage,
      });
    } else {
      handleCloseCaptureEarly();
    }
  }, [handleCloseCaptureEarly, setCloseEarlyModalState]);

  const handleCloseEarlyCancel = useCallback(() => {
    setCloseEarlyModalState({
      show: false,
      message: '',
    });
  }, [setCloseEarlyModalState]);

  const handleCloseEarlyConfirm = useCallback(() => {
    setCloseEarlyModalState({
      show: false,
      message: '',
    });
    handleCloseCaptureEarly();
  }, [setCloseEarlyModalState, handleCloseCaptureEarly]);

  // END HANDLERS //
  // EFFECTS //

  useEffect(() => {
    try {
      onChange(states, api);
    } catch (err) {
      log([`Error in \`<Capture />\` \`onChange()\`: ${err}`], 'error');
      throw err;
    }
  }, [api, onChange, states]);

  useEffect(() => { onUploadsChange(states, api); }, [uploads]);
  useEffect(() => { onComplianceChange(states, api); }, [compliance]);
  useEffect(() => { onSightsChange(states, api); }, [sights]);
  useEffect(() => { onSettingsChange(states, api); }, [settings]);

  // END EFFECTS //
  // RENDERING //

  const left = useMemo(
    () => (addDamageStatus === AddDamageStatus.TAKE_PICTURE ? (
      <SelectedParts selectedParts={addDamageParts} />
    ) : (
      <Sights
        containerStyle={sightsContainerStyle}
        dispatch={sights.dispatch}
        footer={footer}
        navigationOptions={navigationOptions}
        offline={offline}
        thumbnailStyle={thumbnailStyle}
        uploads={uploads}
        additionalPictures={additionalPictures.state.takenPictures}
        {...sights.state}
      />
    )),
    [
      footer, navigationOptions, offline, sights.dispatch,
      sights.state, sightsContainerStyle, thumbnailStyle, uploads,
      addDamageStatus, addDamageParts, additionalPictures.state,
    ],
  );

  const right = useMemo(() => (
    <Controls
      api={api}
      containerStyle={controlsContainerStyle}
      elements={controls}
      loading={loading}
      state={states}
      onCloseEarly={handleCloseEarlyClick}
      onAddDamagePressed={handleAddDamagePressed}
      onStartUploadPicture={onStartUploadPicture}
      onFinishUploadPicture={onFinishUploadPicture}
      addDamageParts={addDamageParts}
      onResetAddDamageStatus={handleResetDamageStatus}
      hideAddDamage={hideAddDamage}
    />
  ), [
    api, controlsContainerStyle, controls, loading,
    states, enableComplianceCheck, onStartUploadPicture,
    onFinishUploadPicture, handleAddDamagePressed, addDamageParts,
    handleResetDamageStatus,
  ]);

  const children = useMemo(() => (
    <>
      {(isReady && overlay && loading === false
        && addDamageStatus !== AddDamageStatus.TAKE_PICTURE) ? (
          <Overlay
            svg={overlay}
            style={[styles.overlay, overlaySize]}
          />
        ) : null}
      {(isReady && overlay && loading === false
        && addDamageStatus === AddDamageStatus.TAKE_PICTURE) ? (
          <AddDamageOverlay />
        ) : null}
      {(isReady && loading === false && addDamageStatus === AddDamageStatus.TAKE_PICTURE) ? (
        <>
          <Text style={[styles.overlay, styles.addDamageOverlay, { top: 16 }]}>
            {t('partSelector.overlay.title')}
          </Text>
          <Text style={[styles.overlay, styles.addDamageOverlay, { bottom: 16 }]}>
            {t('partSelector.overlay.indication')}
          </Text>
        </>
      ) : null}
      {loading === true ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={primaryColor}
          />
        </View>
      ) : null}
    </>
  ), [isReady, loading, overlay, overlaySize, primaryColor, addDamageStatus]);

  if (enableComplianceCheck && (endTour || (tourHasFinished && complianceHasFulfilledAll))) {
    return (
      <UploadCenter
        {...states}
        isSubmitting={isSubmitting}
        onComplianceCheckFinish={onComplianceCheckFinish}
        onComplianceCheckStart={onComplianceCheckStart}
        onRetakeAll={onRetakeAll}
        onSkipRetake={onSkipRetake}
        onRetakeNeeded={onRetakeNeeded}
        task={task}
        mapTasksToSights={mapTasksToSights}
        inspectionId={inspectionId}
        checkComplianceAsync={checkComplianceAsync}
        navigationOptions={{ ...defaultNavigationOptions, ...navigationOptions }}
        colors={colors}
        endTour={endTour}
      />
    );
  }

  return (
    <View
      accessibilityLabel="Capture component"
      style={[styles.container, style]}
    >
      <Layout
        isReady={isReady}
        backgroundColor={colors.background}
        fullscreen={fullscreen}
        left={left}
        orientationBlockerProps={orientationBlockerProps}
        right={right}
      >
        <Camera
          ref={camera}
          loding={loading}
          onCameraReady={handleCameraReady}
          onWarningMessage={onWarningMessage}
          title={title}
          ratio={settings.ratio}
          pictureSize={settings.pictureSize}
          settings={settings}
          enableQHDWhenSupported={enableQHDWhenSupported}
          compressionOptions={compressionOptions}
          resolutionOptions={resolutionOptions}
          onCameraPermissionError={onCameraPermissionError}
          onCameraPermissionSuccess={onCameraPermissionSuccess}
          isDisplayed
        >
          {children}
        </Camera>
      </Layout>
      {[AddDamageStatus.HELP, AddDamageStatus.PART_SELECTOR].includes(addDamageStatus) ? (
        <View style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {addDamageStatus === AddDamageStatus.HELP ? (
            <AddDamageHelpModal
              onConfirm={handlePartSelectorHelpConfirm}
              onCancel={handleResetDamageStatus}
            />
          ) : null}
          {addDamageStatus === AddDamageStatus.PART_SELECTOR ? (
            <AddDamageModal
              currentSight={states.sights.state.current.id}
              onConfirm={handlePartSelectorConfirm}
              onCancel={handleResetDamageStatus}
            />
          ) : null}
        </View>
      ) : null}
      {closeEarlyModalState.show ? (
        <CloseEarlyConfirmModal
          confirmationMessage={closeEarlyModalState.message}
          onCancel={handleCloseEarlyCancel}
          onConfirm={handleCloseEarlyConfirm}
        />
      ) : null}
    </View>
  );

  // END RENDERING //
});

Capture.defaultSightIds = Constants.defaultSightIds;

Capture.propTypes = {
  additionalPictures: PropTypes.shape({
    dispatch: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    state: PropTypes.shape({
      takenPictures: PropTypes.arrayOf(PropTypes.shape({
        labelKey: PropTypes.string.isRequired,
        picture: PropTypes.any,
        previousSight: PropTypes.string.isRequired,
      })),
    }).isRequired,
  }).isRequired,
  colors: PropTypes.shape({
    accent: PropTypes.string,
    actions: PropTypes.shape({
      primary: PropTypes.shape({
        background: PropTypes.string,
        text: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        background: PropTypes.string,
        text: PropTypes.string,
      }),
    }),
    background: PropTypes.string,
    boneColor: PropTypes.string,
    disabled: PropTypes.string,
    error: PropTypes.string,
    highlightBoneColor: PropTypes.string,
    notification: PropTypes.string,
    onSurface: PropTypes.string,
    placeholder: PropTypes.string,
    primary: PropTypes.string,
    success: PropTypes.string,
    surface: PropTypes.string,
    text: PropTypes.string,
  }).isRequired,
  compliance: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.objectOf(PropTypes.shape({
      error: PropTypes.objectOf(PropTypes.any),
      id: PropTypes.string,
      imageId: PropTypes.string,
      requestCount: PropTypes.number,
      result: PropTypes.objectOf(PropTypes.any),
      status: PropTypes.string,
    })),
  }).isRequired,
  compressionOptions: PropTypes.shape({
    quality: PropTypes.number,
  }),
  controls: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      component: PropTypes.element,
      disabled: PropTypes.bool,
      onCustomTakePicture: PropTypes.func,
      onPress: PropTypes.func,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      component: PropTypes.element,
      disabled: PropTypes.bool,
      onCustomTakePicture: PropTypes.func,
      onPress: PropTypes.func,
    })),
  ])),
  controlsContainerStyle: PropTypes.objectOf(PropTypes.any),
  enableCarCoverage: PropTypes.bool,
  enableComplianceCheck: PropTypes.bool,
  enableCompression: PropTypes.bool,
  enableQHDWhenSupported: PropTypes.bool,
  footer: PropTypes.element,
  fullscreen: PropTypes.objectOf(PropTypes.any),
  initialState: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
  inspectionId: PropTypes.string,
  isFocused: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  loading: PropTypes.bool,
  mapTasksToSights: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      tasks: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
    }),
  ),
  navigationOptions: PropTypes.shape({
    allowNavigate: PropTypes.bool,
    allowRetake: PropTypes.bool,
    allowSkip: PropTypes.bool,
    allowSkipImageQualityCheck: PropTypes.bool,
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }),
  offline: PropTypes.objectOf(PropTypes.any),
  onCameraPermissionError: PropTypes.func,
  onCameraPermissionSuccess: PropTypes.func,
  onCaptureTourFinish: PropTypes.func,
  onCaptureTourStart: PropTypes.func,
  onChange: PropTypes.func,
  onComplianceChange: PropTypes.func,
  onComplianceCheckFinish: PropTypes.func,
  onComplianceCheckStart: PropTypes.func,
  onFinishUploadPicture: PropTypes.func,
  onPictureUploaded: PropTypes.func,
  onReady: PropTypes.func,
  onRetakeAll: PropTypes.func,
  onRetakeNeeded: PropTypes.func,
  onSettingsChange: PropTypes.func,
  onSightsChange: PropTypes.func,
  onSkipRetake: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  onUploadsChange: PropTypes.func,
  onWarningMessage: PropTypes.func,
  orientationBlockerProps: PropTypes.shape({ title: PropTypes.string }),
  primaryColor: PropTypes.string,
  resolutionOptions: PropTypes.shape({
    QHDDelay: PropTypes.number,
  }),
  settings: PropTypes.shape({
    compression: PropTypes.bool,
    pictureSize: PropTypes.string,
    ratio: PropTypes.string,
    type: PropTypes.string,
    zoom: PropTypes.number,
  }).isRequired,
  sights: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.shape({
      current: PropTypes.shape({
        id: PropTypes.string,
        index: PropTypes.number,
        metadata: PropTypes.shape({
          category: PropTypes.string,
          id: PropTypes.string,
          label: PropTypes.shape({
            en: PropTypes.string,
            fr: PropTypes.string,
          }),
          overlay: PropTypes.string,
          vehicleType: PropTypes.string,
        }),
      }),
      ids: PropTypes.arrayOf(PropTypes.string),
      remainingPictures: PropTypes.number,
      takenPictures: PropTypes.objectOf(PropTypes.any),
      tour: PropTypes.arrayOf(
        PropTypes.shape({
          category: PropTypes.string,
          id: PropTypes.string,
          label: PropTypes.shape({
            en: PropTypes.string,
            fr: PropTypes.string,
          }),
          overlay: PropTypes.string,
          vehicleType: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
  sightsContainerStyle: PropTypes.objectOf(PropTypes.any),
  task: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  thumbnailStyle: PropTypes.objectOf(PropTypes.any),
  uploads: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.objectOf(PropTypes.shape({
      error: PropTypes.objectOf(PropTypes.any),
      id: PropTypes.string,
      picture: PropTypes.objectOf(PropTypes.any),
      status: PropTypes.string,
      uploadCount: PropTypes.number,
    })),
  }).isRequired,
};

Capture.defaultProps = {
  compressionOptions: { quality: 0.8 },
  controls: [],
  controlsContainerStyle: {},
  enableQHDWhenSupported: true,
  enableCarCoverage: false,
  enableCompression: true,
  footer: null,
  fullscreen: null,
  initialState: {
    compliance: undefined,
    settings: undefined,
    sights: undefined,
    uploads: undefined,
  },
  inspectionId: null,
  isFocused: Platform.OS === 'web',
  loading: false,
  mapTasksToSights: [],
  navigationOptions: defaultNavigationOptions,
  offline: null,
  onPictureUploaded: () => {},
  onCameraPermissionError: () => {},
  onCameraPermissionSuccess: () => {},
  onCaptureTourFinish: () => {},
  onCaptureTourStart: () => {},
  onChange: () => {},
  onComplianceChange: () => {},
  onSettingsChange: () => {},
  onSightsChange: () => {},
  onSkipRetake: () => {},
  onUploadsChange: () => {},
  onComplianceCheckFinish: () => {},
  onComplianceCheckStart: () => {},
  onFinishUploadPicture: () => {},
  onWarningMessage: () => {},
  onReady: () => {},
  onStartUploadPicture: () => {},
  onRetakeAll: () => {},
  onRetakeNeeded: () => {},
  orientationBlockerProps: null,
  primaryColor: '#FFF',
  resolutionOptions: undefined,
  sightsContainerStyle: {},
  enableComplianceCheck: false,
  isSubmitting: false,
  task: 'damage_detection',
  thumbnailStyle: {},
};

/**
 * Note(Ilyass): While using `forwardRef` with PropTypes, the component loses its displayName
 * which is important for debugging with devtools
 *  */
Capture.displayName = 'Capture';

export default Capture;
