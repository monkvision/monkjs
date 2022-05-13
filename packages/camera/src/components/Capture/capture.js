import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View } from 'react-native';
import { utils } from '@monkvision/toolkit';
import PropTypes from 'prop-types';

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
  container: {
    flex: 1,
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

const Capture = forwardRef(({
  controls,
  controlsContainerStyle,
  enableComplianceCheck,
  footer,
  fullscreen,
  inspectionId,
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
  onReady,
  onRetakeAll,
  onStartUploadPicture,
  onFinishUploadPicture,
  orientationBlockerProps,
  primaryColor,
  sightsContainerStyle,
  style,
  submitButtonLabel,
  task,
  mapTasksToSights,
  thumbnailStyle,
  uploads,
  compliance,
  sights,
  settings,
}, combinedRefs) => {
  // STATES //
  const [isReady, setReady] = useState(false);

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
    inspectionId,
    sights,
    uploads,
    task,
    mapTasksToSights,
    onFinish: onCaptureTourFinish,
    onPictureUploaded,
  };
  const startUploadAsync = useStartUploadAsync(startUploadAsyncParams);

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
  }), [
    camera, checkComplianceAsync, createDamageDetectionAsync,
    goNextSight, goPrevSight,
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

  // END METHODS //
  // CONSTANTS //

  const windowDimensions = useWindowDimensions();
  const tourHasFinished = useMemo(
    () => !Object.values(uploads.state).some(({ status, uploadCount }) => ((status === 'pending' || status === 'idle') && uploadCount < 1)),
    [uploads.state],
  );
  const overlaySize = useMemo(
    () => utils.styles.getSize('4:3', windowDimensions, 'number'),
    [windowDimensions],
  );
  const complianceHasFulfilledAll = useMemo(
    () => Object
      .values(compliance.state)
      .every(({ status, id }) => status === 'fulfilled' || uploads.state[id].status === 'rejected' || uploads.state[id].uploadCount > 1),
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
      enableComplianceCheck={enableComplianceCheck}
      onStartUploadPicture={onStartUploadPicture}
      onFinishUploadPicture={onFinishUploadPicture}
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

  if (enableComplianceCheck && tourHasFinished && complianceHasFulfilledAll) {
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
          loding={loading}
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
});

Capture.defaultSightIds = Constants.defaultSightIds;

Capture.propTypes = {
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
  orientationBlockerProps: PropTypes.shape({ title: PropTypes.string }),
  primaryColor: PropTypes.string,
  settings: PropTypes.shape({
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
          label: PropTypes.string,
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
          label: PropTypes.string,
          overlay: PropTypes.string,
          vehicleType: PropTypes.string,
        }),
      ),
    }),
  }).isRequired,
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
  }).isRequired,
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
  onReady: () => {},
  onStartUploadPicture: () => {},
  onRetakeAll: () => {},
  orientationBlockerProps: null,
  primaryColor: '#FFF',
  sightsContainerStyle: {},
  enableComplianceCheck: false,
  isSubmitting: false,
  submitButtonLabel: 'Skip retaking',
  task: 'damage_detection',
  thumbnailStyle: {},
};

/**
 * Note(Ilyass): While using `forwardRef` with PropTypes, the component loses its displayName
 * which is important for debugging with devtools
 *  */
Capture.displayName = 'Capture';

export default Capture;
