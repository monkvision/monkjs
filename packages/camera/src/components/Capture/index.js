import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import noop from 'lodash.noop';

import useCompliance from '../../hooks/useCompliance';
import useSettings from '../../hooks/useSettings';
import useSights from '../../hooks/useSights';

// eslint-disable-next-line import/namespace,import/no-named-as-default-member
import Camera from '../Camera';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import Sights from '../Sights';

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
  overlay: { flex: 1 },
});

/**
 * @param controls
 * @param controlsContainerStyle
 * @param footer
 * @param fullscreen
 * @param initialState
 * @param inspectionId
 * @param loading
 * @param navigationOptions
 * @param offline
 * @param onChange
 * @param onReady
 * @param onFinish
 * @param primaryColor
 * @param sightIds
 * @param sightsContainerStyle
 * @param style
 * @param thumbnailStyle
 * @param uploads
 * @param RenderOnFinish
 * @param submitButtonProps
 * @param task
 * @return {JSX.Element}
 * @constructor
 */
export default function Capture({
  controls,
  controlsContainerStyle,
  footer,
  fullscreen,
  initialState,
  inspectionId,
  loading,
  navigationOptions,
  offline,
  onChange,
  onReady,
  onFinish,
  orientationBlockerProps,
  primaryColor,
  renderOnFinish: RenderOnFinish,
  sightIds,
  sightsContainerStyle,
  style,
  submitButtonProps,
  task,
  thumbnailStyle,
  uploads,
}) {
  // STATES //

  const [camera, setCamera] = useState();
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
  const startUploadAsync = useStartUploadAsync({ inspectionId, sights, uploads, task, onFinish });
  const checkComplianceAsync = useCheckComplianceAsync({
    compliance,
    inspectionId,
    sightId: current.id,
  });
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

  const tourHasFinished = useMemo(
    () => !Object.values(uploads.state).some((upload) => !upload.picture), [uploads.state],
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
    if (tourHasFinished) {
      log([`Capture tour has been finished`]);
    }
  }, [camera, tourHasFinished, onFinish]);

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
    />
  ), [api, controls, controlsContainerStyle, states]);

  const children = useMemo(() => (
    <>
      {(isReady && overlay && loading === false) ? (
        <Overlay
          svg={overlay}
          style={styles.overlay}
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
  ), [isReady, loading, overlay, primaryColor]);

  if (tourHasFinished && RenderOnFinish) {
    return (
      <RenderOnFinish
        {...states}
        submitButtonProps={submitButtonProps}
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
          onRef={setCamera}
          onCameraReady={handleCameraReady}
          title={title}
          ratio="4:3"
          {...Platform.select({ native: settings, default: {} })}
        >
          {children}
        </Camera>
      </Layout>
    </View>
  );

  // END RENDERING //
}

Capture.defaultSightIds = [
  'xsuH1g5T', // Beauty Shot
  'xfbBpq3Q', // Front Bumper Side Left
  'LE9h1xh0', // Front Fender Left
  'IVcF1dOP', // Doors Left
  'm1rhrZ88', // Front Roof Left
  'GvCtVnoD', // Rear Lateral Left
  '3vKXafwc', // Rear Fender Left
  'XyeyZlaU', // Rear
  'Cce1KCd3', // Rear Fender Right
  'AoO-nOoM', // Rear Lateral Right
  'Pzgw0WGe', // Doors Right
  'jqJOb6Ov', // Front Fender Right
  'CELBsvYD', // Front Bumper Side Right
  'vLcBGkeh', // Front
  'IqwSM3', // Front seats
  'rSvk2C', // Dashboard
  'rj5mhm', // Back seats
  'qhKA2z', // Trunk
];

Capture.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  })),
  controlsContainerStyle: PropTypes.objectOf(PropTypes.any),
  footer: PropTypes.element,
  fullscreen: PropTypes.objectOf(PropTypes.any),
  initialState: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
  inspectionId: PropTypes.string,
  loading: PropTypes.bool,
  navigationOptions: PropTypes.shape({
    allowNavigate: PropTypes.bool,
    allowRetake: PropTypes.bool,
    allowSkip: PropTypes.bool,
    retakeMaxTry: PropTypes.number,
    retakeMinTry: PropTypes.number,
  }),
  offline: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  onFinish: PropTypes.func,
  onReady: PropTypes.func,
  orientationBlockerProps: PropTypes.shape({ title: PropTypes.string }),
  primaryColor: PropTypes.string,
  renderOnFinish: PropTypes.func,
  sightIds: PropTypes.arrayOf(PropTypes.string),
  sightsContainerStyle: PropTypes.objectOf(PropTypes.any),
  submitButtonProps: PropTypes.shape({ onPress: PropTypes.func.isRequired }),
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
  navigationOptions: {
    allowNavigate: false,
    allowRetake: true,
    allowSkip: false,
    retakeMaxTry: 1,
    retakeMinTry: 1,
  },
  offline: null,
  onChange: () => {},
  onFinish: () => {},
  onReady: () => {},
  orientationBlockerProps: null,
  primaryColor: '#FFF',
  renderOnFinish: null,
  sightIds: Capture.defaultSightIds,
  sightsContainerStyle: {},
  submitButtonProps: {},
  task: 'damage_detection',
  thumbnailStyle: {},
  uploads: {
    dispatch: noop,
    name: null,
    state: {},
  },
};
