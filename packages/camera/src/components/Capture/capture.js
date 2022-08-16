import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ActivityIndicator, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSentry, utils } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';
import PropTypes from 'prop-types';
import Camera from '../Camera';
import ModelManager from '../ModelManager';

import ComplianceNotification from '../ComplianceNotification';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import Sights from '../Sights';
import UploadCenter from '../UploadCenter';
import useEmbeddedModel from '../../hooks/useEmbeddedModel';
import Models from '../../hooks/useEmbeddedModel/const';
import Actions from '../../actions';

import Constants from '../../const';
import log from '../../utils/log';
import i18next from '../../i18n';

import {
  useCheckComplianceAsync,
  useCreateDamageDetectionAsync,
  useNavigationBetweenSights,
  useSetPictureAsync,
  useStartUploadAsync,
  useTakePictureAsync,
  useTitle,
} from './hooks';

const i18n = i18next;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
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
  controls,
  controlsContainerStyle,
  enableComplianceCheck,
  enableQHDWhenSupported,
  colors,
  connectionMode,
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
  onComplianceCheckFinish,
  onComplianceCheckStart,
  onPictureUploaded,
  onWarningMessage,
  onReady,
  onRetakeAll,
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
  embeddedCompliance,
  sights,
  settings,
  lastTakenPicture,
  Sentry,
}, combinedRefs) => {
  // STATES //
  const [isReady, setReady] = useState(false);
  const [haveAllModelsBeenStored, setHaveAllModelsBeenStored] = useState(false);

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
     * embeddedCompliance: {
       * dispatch: (function({}): void),
       * name: string,
       * state: {
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
    compliance,
    embeddedCompliance,
    isReady,
    settings,
    sights,
    uploads,
    lastTakenPicture,
  }), [compliance, embeddedCompliance, isReady, settings, sights, uploads, lastTakenPicture]);

  // END STATES //
  // METHODS //

  const createDamageDetectionAsync = useCreateDamageDetectionAsync();
  const takePictureAsync = useTakePictureAsync({ camera, isFocused, Sentry });
  const setPictureAsync = useSetPictureAsync({ current, sights, uploads, Sentry });

  const checkComplianceParams = { compliance, inspectionId, sightId: current.id, Sentry };
  const checkComplianceAsync = useCheckComplianceAsync(checkComplianceParams);
  const startUploadAsyncParams = {
    inspectionId,
    sights,
    uploads,
    task,
    mapTasksToSights,
    onFinish: onCaptureTourFinish,
    onPictureUploaded,
    onWarningMessage,
    Sentry,
  };
  const startUploadAsync = useStartUploadAsync(startUploadAsyncParams);
  const { models, isModelStored, loadModel, predictions } = useEmbeddedModel();

  const [goPrevSight, goNextSight] = useNavigationBetweenSights({ sights });

  const api = useMemo(() => ({
    camera,
    checkComplianceAsync,
    createDamageDetectionAsync,
    goPrevSight,
    goNextSight,
    predictions,
    setPictureAsync,
    startUploadAsync,
    takePictureAsync,
  }), [
    camera, checkComplianceAsync, createDamageDetectionAsync,
    goNextSight, goPrevSight, predictions,
    setPictureAsync, startUploadAsync, takePictureAsync,
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

  const { errorHandler } = useSentry(Sentry);

  const handleCloseComplianceNotification = useCallback(() => {
    states.embeddedCompliance.dispatch({
      type: Actions.embeddedCompliance.UPDATE_EMBEDDED_COMPLIANCE,
      payload: { id: current.id, result: null },
    });
  }, [states.embeddedCompliance, current]);

  const handleSkipCompliance = useCallback(async () => {
    if (current.index === sights.state.ids.length - 1) {
      await startUploadAsync(states.lastTakenPicture.state.picture);
    } else {
      await startUploadAsync(states.lastTakenPicture.state.picture);

      setTimeout(() => {
        onFinishUploadPicture(states, api);
        goNextSight();
      }, 500);
    }
  }, [current, states.lastTakenPicture.state.picture, sights.state.ids]);

  // END METHODS //
  // CONSTANTS //

  const embeddedModels = [Models.imageQualityCheck];
  const windowDimensions = useWindowDimensions();
  const tourHasFinished = useMemo(
    () => Object.values(uploads.state).every(({ status, picture, uploadCount }) => (picture || status === 'rejected') && uploadCount >= 1),
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

  const currentEmbeddedCompliance = useMemo(
    () => (
      Object.values(embeddedCompliance.state)
        .find((comp) => comp.id === sights.state.current.id)),
    [embeddedCompliance.state, sights.state.current.id],
  );

  const complianceAlert = useMemo(() => {
    if (sights.state.current.id) {
      const currentComp = Object.values(embeddedCompliance.state)
        .find((comp) => comp.id === sights.state.current.id);
      return currentComp?.result?.is_compliant === false;
    }
    return false;
  }, [embeddedCompliance.state, sights.state.current.id]);

  const predictionsHasLoaded = useMemo(() => (
    Object.keys(Models).every((modelKey) => Object.keys(predictions).includes(modelKey))
  ), [predictions]);

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

  useEffect(() => {
    if (['offline', 'semi-offline'].includes(connectionMode) && haveAllModelsBeenStored) {
      Object.keys(Models).forEach(async (modelKey) => {
        if (!models[Models[modelKey].name]) {
          await loadModel(Models[modelKey].name);
        }
      });
    }
  }, [connectionMode, haveAllModelsBeenStored, models]);

  useEffect(() => { onUploadsChange(states, api); }, [uploads]);
  useEffect(() => { onComplianceChange(states, api); }, [compliance]);
  useEffect(() => { onSightsChange(states, api); }, [sights]);
  useEffect(() => { onSettingsChange(states, api); }, [settings]);
  useEffect(() => {
    if (!haveAllModelsBeenStored) {
      Promise.all(embeddedModels.map((model) => model.name).map((name) => isModelStored(name)))
        .then((results) => {
          if (results.every((modelIsStored) => modelIsStored)) {
            setHaveAllModelsBeenStored(true);
          }
        }).catch((err) => {
          const additionalTags = { models: embeddedModels };
          errorHandler(err, SentryConstants.type.COMPLIANCE, null, additionalTags);
        });
    }
  }, []);

  // END EFFECTS //
  // RENDERING //

  const left = useMemo(() => (
    <Sights
      containerStyle={sightsContainerStyle}
      dispatch={sights.dispatch}
      footer={footer}
      navigationOptions={navigationOptions}
      offline={offline}
      thumbnailStyle={thumbnailStyle}
      uploads={uploads}
      {...sights.state}
    />
  ), [
    footer, navigationOptions, offline, sights.dispatch,
    sights.state, sightsContainerStyle, thumbnailStyle, uploads,
  ]);

  const right = useMemo(() => (
    <Controls
      api={api}
      containerStyle={controlsContainerStyle}
      elements={controls}
      loading={loading}
      state={states}
      onStartUploadPicture={onStartUploadPicture}
      onFinishUploadPicture={onFinishUploadPicture}
      Sentry={Sentry}
      disableAll={complianceAlert}
      connectionMode={connectionMode}
    />
  ), [
    api, controlsContainerStyle, controls, loading,
    states, enableComplianceCheck, onStartUploadPicture,
    onFinishUploadPicture,
  ]);

  const children = useMemo(() => (
    <>
      {(isReady && overlay && loading === false) ? (
        <Overlay
          svg={overlay}
          style={[styles.overlay, overlaySize]}
        />
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
  ), [isReady, loading, overlay, overlaySize, primaryColor]);

  if (['offline', 'semi-offline'].includes(connectionMode) && (!haveAllModelsBeenStored || !predictionsHasLoaded)) {
    return (
      <I18nextProvider i18n={i18n}>
        <ModelManager
          backgroundColor={colors.background}
          onSuccess={() => setHaveAllModelsBeenStored(true)}
          Sentry={Sentry}
        />
      </I18nextProvider>
    );
  }

  if (enableComplianceCheck && tourHasFinished && complianceHasFulfilledAll) {
    return (
      <I18nextProvider i18n={i18n}>
        <UploadCenter
          {...states}
          isSubmitting={isSubmitting}
          onComplianceCheckFinish={onComplianceCheckFinish}
          onComplianceCheckStart={onComplianceCheckStart}
          onRetakeAll={onRetakeAll}
          task={task}
          mapTasksToSights={mapTasksToSights}
          inspectionId={inspectionId}
          checkComplianceAsync={checkComplianceAsync}
          navigationOptions={{ ...defaultNavigationOptions, ...navigationOptions }}
          colors={colors}
          Sentry={Sentry}
        />
      </I18nextProvider>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
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
            Sentry={Sentry}
          >
            {children}
          </Camera>
        </Layout>
        {complianceAlert ? (
          <ComplianceNotification
            image={lastTakenPicture?.state.picture}
            compliance={currentEmbeddedCompliance}
            colors={colors}
            onCloseNotification={handleCloseComplianceNotification}
            onSkipCompliance={handleSkipCompliance}
          />
        ) : null}
      </View>
    </I18nextProvider>
  );

  // END RENDERING //
});

Capture.defaultSightIds = Constants.defaultSightIds;

Capture.propTypes = {
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
  connectionMode: PropTypes.oneOf(['online', 'semi-offline', 'offline']).isRequired,
  controls: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  })),
  controlsContainerStyle: PropTypes.objectOf(PropTypes.any),
  embeddedCompliance: PropTypes.objectOf(PropTypes.any).isRequired,
  enableComplianceCheck: PropTypes.bool,
  enableCompression: PropTypes.bool,
  enableQHDWhenSupported: PropTypes.bool,
  footer: PropTypes.element,
  fullscreen: PropTypes.objectOf(PropTypes.any),
  initialState: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    lastTakenPicture: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
  inspectionId: PropTypes.string,
  isFocused: PropTypes.bool,
  isSubmitting: PropTypes.bool,
  lastTakenPicture: PropTypes.shape({
    dispatch: PropTypes.func,
    name: PropTypes.string,
    state: PropTypes.any,
  }).isRequired,
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
  onSettingsChange: PropTypes.func,
  onSightsChange: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  onUploadsChange: PropTypes.func,
  onWarningMessage: PropTypes.func,
  orientationBlockerProps: PropTypes.shape({ title: PropTypes.string }),
  primaryColor: PropTypes.string,
  Sentry: PropTypes.any,
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
  controls: [],
  controlsContainerStyle: {},
  enableQHDWhenSupported: true,
  enableCompression: true,
  footer: null,
  fullscreen: null,
  initialState: {
    compliance: undefined,
    lastTakenPicture: undefined,
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
  onCaptureTourFinish: () => {},
  onCaptureTourStart: () => {},
  onChange: () => {},
  onComplianceChange: () => {},
  onSettingsChange: () => {},
  onSightsChange: () => {},
  onUploadsChange: () => {},
  onComplianceCheckFinish: () => {},
  onComplianceCheckStart: () => {},
  onFinishUploadPicture: () => {},
  onWarningMessage: () => {},
  onReady: () => {},
  onStartUploadPicture: () => {},
  onRetakeAll: () => {},
  orientationBlockerProps: null,
  primaryColor: '#FFF',
  sightsContainerStyle: {},
  enableComplianceCheck: false,
  isSubmitting: false,
  Sentry: null,
  task: 'damage_detection',
  thumbnailStyle: {},
};

/**
 * Note(Ilyass): While using `forwardRef` with PropTypes, the component loses its displayName
 * which is important for debugging with devtools
 *  */
Capture.displayName = 'Capture';

export default Capture;
