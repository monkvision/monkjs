import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { utils } from '@monkvision/toolkit';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import useCompliance from '../../hooks/useCompliance';
import useSettings from '../../hooks/useSettings';
import useSights from '../../hooks/useSights';

import Camera from '../Camera';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import Sights from '../Sights';
import UploadCenter from '../UploadCenter';

import Constants from '../../const';
import log from '../../utils/log';

import {
  useCheckComplianceAsync,
  useCreateDamageDetectionAsync,
  useNavigationBetweenSights,
  useSetPictureAsync,
  useStartUploadAsync,
  useTakePictureAsync,
  useTitle,
} from './hooks';

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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

/**
 * @param controls
 * @param controlsContainerStyle
 * @param enableComplianceCheck
 * @param footer
 * @param fullscreen
 * @param initialState
 * @param inspectionId
 * @param isSubmitting
 * @param loading
 * @param navigationOptions
 * @param offline
 * @param onChange
 * @param onReady
 * @param onCaptureTourFinish
 * @param onCaptureTourStart
 * @param onComplianceCheckFinish
 * @param onComplianceCheckStart
 * @param onStartUploadPicture
 * @param onFinishUploadPicture
 * @param onRetakeAll
 * @param onFinish
 * @param orientationBlockerProps
 * @param primaryColor
 * @param sightIds
 * @param sightsContainerStyle
 * @param style
 * @param submitButtonLabel
 * @param thumbnailStyle
 * @param uploads
 * @param submitButtonProps
 * @param task
 * @param mapTasksToSights
 * @return {JSX.Element}
 * @constructor
 */
export default function Capture({
  controls,
  controlsContainerStyle,
  enableComplianceCheck,
  footer,
  fullscreen,
  initialState,
  inspectionId,
  isSubmitting,
  loading,
  navigationOptions,
  offline,
  onChange,
  onCaptureTourFinish,
  onCaptureTourStart,
  onComplianceCheckFinish,
  onComplianceCheckStart,
  onReady,
  onRetakeAll,
  onStartUploadPicture,
  onFinishUploadPicture,
  orientationBlockerProps,
  primaryColor,
  sightIds,
  sightsContainerStyle,
  style,
  submitButtonLabel,
  task,
  mapTasksToSights,
  thumbnailStyle,
  uploads,
}) {
  // STATES //

  const camera = useRef();
  const [isReady, setReady] = useState(false);

  const compliance = useCompliance({ sightIds, initialState: initialState.compliance });
  const settings = useSettings({ camera, initialState: initialState.settings });
  const sights = useSights({ sightIds, initialState: initialState.sights });

  const { current, tour } = sights.state;
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
    compliance,
    isReady,
    settings,
    sights,
    uploads,
  }), [compliance, isReady, settings, sights, uploads]);

  // END STATES //
  // METHODS //

  const createDamageDetectionAsync = useCreateDamageDetectionAsync();
  const takePictureAsync = useTakePictureAsync({ camera });
  const setPictureAsync = useSetPictureAsync({ current, sights, uploads });

  const checkComplianceParams = { compliance, inspectionId, sightId: current.id };
  const checkComplianceAsync = useCheckComplianceAsync(checkComplianceParams);
  const startUploadAsyncParams = {
    inspectionId, sights, uploads, task, mapTasksToSights, onFinish: onCaptureTourFinish,
  };
  const startUploadAsync = useStartUploadAsync(startUploadAsyncParams);

  const [goPrevSight, goNextSight] = useNavigationBetweenSights({ sights });

  /**
   * @type {{
     * createDamageDetectionAsync: function(tasks=, compliances=): Promise<data>,
     * setPictureAsync: (function(pictureOrBlob:*, isBlob:boolean=): Promise<void>)|void,
     * startUploadAsync: (function({inspectionId, sights, uploads}): Promise<result|error>)|*,
     * goPrevSight: (function(): void)|*,
     * takePictureAsync: function(): Promise<picture>,
     * camera: {takePictureAsync: (function(options=): Promise<picture>)},
     * checkComplianceAsync: (function(string): Promise<result|error>)|*,
     * goNextSight: (function(): void)|*,
   * }}
   */
  const api = useMemo(() => ({
    camera,
    checkComplianceAsync,
    createDamageDetectionAsync,
    goPrevSight,
    goNextSight,
    setPictureAsync,
    startUploadAsync,
    takePictureAsync,
  }), [
    camera, checkComplianceAsync, createDamageDetectionAsync,
    goNextSight, goPrevSight,
    setPictureAsync, startUploadAsync, takePictureAsync,
  ]);

  // END METHODS //
  // CONSTANTS //

  const windowDimensions = useWindowDimensions();
  const tourHasFinished = useMemo(
    () => !Object.values(uploads.state).some((upload) => !upload.picture),
    [uploads.state],
  );
  const overlaySize = useMemo(
    () => utils.styles.getSize('4:3', windowDimensions, 'number'),
    [windowDimensions],
  );

  // END CONSTANTS //
  // HANDLERS //

  const handleCameraReady = useCallback(() => {
    setReady(true);
    log([`Camera preview has been set`]);
    onReady(states, api);
  }, [api, onReady, states]);

  // END HANDLERS //
  // EFFECTS //

  useEffect(() => {
    onChange(states, api);
  }, [api, onChange, states]);

  useEffect(() => {
    if (sightIds) {
      log([`Capture workflow initialized with sights`, tour]);
      log([`See https://monkvision.github.io/monkjs/sights?q=${sightIds.join(',')}`]);
    }
  }, [tour, sightIds]);

  useEffect(() => {
    if (enableComplianceCheck) { log([`Compliance check is enabled`]); }
  }, [enableComplianceCheck]);

  useEffect(() => {
    log([`Capture tour has been started`]);
    onCaptureTourStart();
  }, [onCaptureTourStart]);

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
      state={states}
      enableComplianceCheck={enableComplianceCheck}
      onStartUploadPicture={onStartUploadPicture}
      onFinishUploadPicture={onFinishUploadPicture}
    />
  ), [api, controlsContainerStyle, controls, states, enableComplianceCheck,
    onStartUploadPicture, onFinishUploadPicture]);

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

  if (enableComplianceCheck && tourHasFinished) {
    return (
      <UploadCenter
        {...states}
        isSubmitting={isSubmitting}
        onComplianceCheckFinish={onComplianceCheckFinish}
        onComplianceCheckStart={onComplianceCheckStart}
        onRetakeAll={onRetakeAll}
        submitButtonLabel={submitButtonLabel}
        task={task}
        mapTasksToSights={mapTasksToSights}
        inspectionId={inspectionId}
        checkComplianceAsync={checkComplianceAsync}
        navigationOptions={navigationOptions}
      />
    );
  }

  return (
    <View
      accessibilityLabel="Capture component"
      style={[styles.container, style]}
    >
      <Layout
        fullscreen={fullscreen}
        left={left}
        orientationBlockerProps={orientationBlockerProps}
        right={right}
      >
        <Camera
          ref={camera}
          onCameraReady={handleCameraReady}
          title={title}
          ratio={settings.ratio}
          pictureSize={settings.pictureSize}
        >
          {children}
        </Camera>
      </Layout>
    </View>
  );

  // END RENDERING //
}

Capture.defaultSightIds = Constants.defaultSightIds;

Capture.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  })),
  controlsContainerStyle: PropTypes.objectOf(PropTypes.any),
  enableComplianceCheck: PropTypes.bool,
  footer: PropTypes.element,
  fullscreen: PropTypes.objectOf(PropTypes.any),
  initialState: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
  inspectionId: PropTypes.string,
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
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }),
  offline: PropTypes.objectOf(PropTypes.any),
  onCaptureTourFinish: PropTypes.func,
  onCaptureTourStart: PropTypes.func,
  onChange: PropTypes.func,
  onComplianceCheckFinish: PropTypes.func,
  onComplianceCheckStart: PropTypes.func,
  onFinish: PropTypes.func,
  onFinishUploadPicture: PropTypes.func,
  onReady: PropTypes.func,
  onRetakeAll: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  orientationBlockerProps: PropTypes.shape({ title: PropTypes.string }),
  primaryColor: PropTypes.string,
  renderOnFinish: PropTypes.func,
  sightIds: PropTypes.arrayOf(PropTypes.string),
  sightsContainerStyle: PropTypes.objectOf(PropTypes.any),
  submitButtonLabel: PropTypes.string,
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
  }),
};

Capture.defaultProps = {
  controls: [],
  controlsContainerStyle: {},
  footer: null,
  fullscreen: null,
  initialState: {
    compliance: undefined,
    settings: undefined,
    sights: undefined,
    uploads: undefined,
  },
  inspectionId: null,
  loading: false,
  mapTasksToSights: [],
  navigationOptions: {
    allowNavigate: false,
    allowRetake: true,
    allowSkip: false,
    retakeMaxTry: 1,
    retakeMinTry: 1,
  },
  offline: null,
  onCaptureTourFinish: () => {},
  onCaptureTourStart: () => {},
  onChange: () => {},
  onComplianceCheckFinish: () => {},
  onComplianceCheckStart: () => {},
  onFinish: () => {},
  onFinishUploadPicture: () => {},
  onReady: () => {},
  onStartUploadPicture: () => {},
  onRetakeAll: () => {},
  orientationBlockerProps: null,
  primaryColor: '#FFF',
  renderOnFinish: null,
  sightIds: Capture.defaultSightIds,
  sightsContainerStyle: {},
  enableComplianceCheck: false,
  isSubmitting: false,
  submitButtonLabel: 'Skip retaking',
  task: 'damage_detection',
  thumbnailStyle: {},
  uploads: {
    dispatch: noop,
    name: null,
    state: {},
  },
};
