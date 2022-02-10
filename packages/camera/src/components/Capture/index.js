import { monkApi } from '@monkvision/corejs';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import log from '../../utils/log';

import useSettings from '../../hooks/useSettings';
import useSights from '../../hooks/useSights';
import useUploads from '../../hooks/useUploads';

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

  /**
   * @type {{dispatch: (function({}): void), name: string, state: {
   * current,
   * ids,
   * remainingPictures,
   * takenPictures: {},
   * tour,
   * }}|*}
   */
  const sights = useSights(sightIds);

  /**
   * @type {{dispatch: (function({}): void), name: string, state: S}|*}
   */
  const uploads = useUploads(sightIds);

  const { current, tour } = sights.state;
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
    sights.dispatch({ type: Actions.sights.SET_PICTURE, payload });

    return picture;
  }, [camera, current.id, sights]);

  const goPrevSight = useCallback(() => {
    sights.dispatch({ type: Actions.sights.PREVIOUS_SIGHT });
  }, [sights]);

  const goNextSight = useCallback(() => {
    sights.dispatch({ type: Actions.sights.NEXT_SIGHT });
  }, [sights]);

  const startUploadAsync = useCallback(async ({ picture }) => {
    const { dispatch } = uploads;

    if (!inspectionId) {
      throw Error(`Please provide a valid "inspectionId". Got ${inspectionId}.`);
    }

    const { id, label } = sights.state.current.metadata;
    const { uri } = picture;

    try {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, picture, status: 'pending', label },
      });

      const filename = `${id}-${inspectionId}.jpg`;
      const multiPartKeys = { image: 'image', json: 'json', filename, type: 'image/jpg' };

      const acquisition = { strategy: 'upload_multipart_form_keys', file_key: multiPartKeys.image };
      const json = JSON.stringify({
        acquisition,
        tasks: ['damage_detection'],
        additional_data: {
          ...sights.current.metadata,
          width: picture.width,
          height: picture.height,
          exif: picture.exif,
          overlay: undefined,
        },
      });

      const data = new FormData();
      data.append(multiPartKeys.json, json);

      const blobUri = await fetch(uri);
      const blob = await blobUri.blob();
      const file = await new File(
        [blob],
        multiPartKeys.filename,
        { type: multiPartKeys.type },
      );

      data.append(multiPartKeys.image, file);

      const result = await monkApi.images.addOne({ inspectionId, data });

      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        payload: { id, status: 'fulfilled' },
      });

      return result;
    } catch (err) {
      dispatch({
        type: Actions.uploads.UPDATE_UPLOAD,
        increment: true,
        payload: { id, status: 'error', error: err },
      });

      return err;
    }
  }, [inspectionId, sights, uploads]);

  const state = useMemo(() => ({
    isReady,
    settings,
    sights,
    uploads,
  }), [isReady, settings, sights, uploads]);

  const api = useMemo(() => ({
    camera,
    goPrevSight,
    goNextSight,
    startUploadAsync,
    takePictureAsync,
  }), [camera, goNextSight, goPrevSight, startUploadAsync, takePictureAsync]);

  const handleCameraReady = useCallback(() => {
    setReady(true);
    log([`Camera preview has been set`]);
    onReady(state, api);
  }, [api, onReady, state]);

  useEffect(() => {
    onChange(state, api);
  }, [api, onChange, state]);

  useEffect(() => {
    if (sightIds) {
      log([`Capture workflow initialized with sights`, tour]);
      log([`See https://monkvision.github.io/monkjs/sights?q=${sightIds.join(',')}`]);
    }
  }, [tour, sightIds]);

  return (
    <View accessibilityLabel="Capture component" style={[styles.container, style]}>
      <Layout
        fullscreen={fullscreen}
        left={(
          <Sights
            dispatch={sights.dispatch}
            footer={footer}
            offline={offline}
            {...sights.state}
          />
        )}
        right={<Controls elements={controls} state={state} api={api} />}
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
