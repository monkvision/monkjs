import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import log from '../../utils/log';

import useSettings from '../../hooks/useSettings';
import useSights from '../../hooks/useSights';
import useUploads, { handleUpload } from '../../hooks/useUploads';

import Camera from '../Camera';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import Sights from '../Sights';

import Actions from '../../actions';
import Constants from '../../const';

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1 },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

/**
 * @param controls
 * @param footer
 * @param fullscreen
 * @param inspectionId
 * @param loading
 * @param offline
 * @param onChange
 * @param onReady
 * @param primaryColor
 * @param sightIds
 * @param style
 * @return {JSX.Element}
 * @constructor
 */
export default function Capture({
  controls,
  footer,
  fullscreen,
  inspectionId,
  loading,
  offline,
  onChange,
  onReady,
  primaryColor,
  sightIds,
  style,
}) {
  const [camera, setCamera] = useState();
  const [isReady, setReady] = useState(false);

  const settings = useSettings();
  const [pictureState, pictureDispatch] = useSights(sightIds);
  const [uploads, uploadsDispatch] = useUploads(sightIds);

  const { current, tour } = pictureState;
  const overlay = current?.metadata?.overlay || '';

  const title = useMemo(() => {
    if (!current.metadata) { return ''; }
    const { label, id } = current.metadata;
    if (Constants.PRODUCTION) { return label; }
    return `${label} - ${id}`;
  }, [current]);

  const takePictureAsync = useCallback(async () => {
    log([`Awaiting picture to be taken...`]);
    const picture = await camera.takePictureAsync();
    log([`Camera 'takePictureAsync' has fulfilled with picture:`, picture]);
    const payload = { id: current.id, picture };
    pictureDispatch({ type: Actions.sights.SET_PICTURE, payload });
    return { ...payload, ...current };
  }, [camera, current, pictureDispatch]);

  const goPrevSight = useCallback(() => {
    pictureDispatch({ type: Actions.sights.PREVIOUS_SIGHT });
  }, [pictureDispatch]);

  const goNextSight = useCallback(() => {
    pictureDispatch({ type: Actions.sights.NEXT_SIGHT });
  }, [pictureDispatch]);

  const startUploadAsync = useCallback((
    picture,
    state = uploads,
    dispatch = uploadsDispatch,
    callback,
  ) => {
    const payload = { picture, camera, sights: { current }, inspectionId };
    handleUpload(payload, state, dispatch, callback);
  }, [camera, current, inspectionId, uploads, uploadsDispatch]);

  const api = useMemo(() => ({
    goPrevSight,
    goNextSight,
    startUploadAsync,
    takePictureAsync,
    camera,
  }), [camera, goNextSight, goPrevSight, startUploadAsync, takePictureAsync]);

  const handleCameraReady = useCallback(() => {
    setReady(true);
    log([`Camera preview has been set`]);
    onReady(pictureState, api);
  }, [api, onReady, pictureState]);

  useEffect(() => {
    onChange(pictureState, uploads, api);
  }, [api, onChange, pictureState, uploads]);

  useEffect(() => {
    if (sightIds) {
      log([`Capture workflow initialized with sights`, tour]);
      log([`See https://sights.monk.ai?q=${sightIds.join(',')}`]);
    }
  }, [tour, sightIds]);

  return (
    <View accessibilityLabel="Capture component" style={[styles.container, style]}>
      <Layout
        fullscreen={fullscreen}
        left={(
          <Sights
            offline={offline}
            dispatch={pictureDispatch}
            footer={footer}
            {...pictureState}
          />
        )}
        right={<Controls elements={controls} api={api} />}
      >
        <Camera
          onRef={setCamera}
          onCameraReady={handleCameraReady}
          title={title}
          {...settings}
        >
          <>
            {(isReady && overlay && loading === false) ? (
              <Overlay svg={overlay} style={styles.overlay} />
            ) : null}
            {loading === true ? (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color={primaryColor} />
              </View>
            ) : null}
          </>
        </Camera>
      </Layout>
    </View>
  );
}

Capture.propTypes = {
  controls: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  })),
  footer: PropTypes.element,
  fullscreen: PropTypes.objectOf(PropTypes.any),
  inspectionId: PropTypes.string,
  loading: PropTypes.bool,
  offline: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  onReady: PropTypes.func,
  primaryColor: PropTypes.string,
  sightIds: PropTypes.arrayOf(PropTypes.string),
};

Capture.defaultProps = {
  controls: [],
  footer: null,
  fullscreen: null,
  inspectionId: null,
  loading: false,
  offline: null,
  onChange: () => {},
  onReady: () => {},
  primaryColor: '#FFF',
  sightIds: ['vLcBGkeh', 'sLu0CfOt'],
};
