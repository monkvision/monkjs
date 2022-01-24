import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useSettings from '../../hooks/useSettings';

import useSights from '../../hooks/useSights';
import useToggle from '../../hooks/useToggle';

import Camera from '../Camera';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import Sights from '../Sights';

import Constants from '../../const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
});

export default function Capture({
  initialSettings,
  initialSightsState,
  onCapture,
  onChange,
  sightIds,
  style,
}) {
  const [camera, setCamera] = useState();
  const [isReady, setReady] = useState(false);
  const [isLoading, setLoadingOn, setLoadingOff] = useToggle();

  const settings = useSettings(initialSettings);
  const sights = useSights(sightIds, {
    ...initialSightsState,
    currentSight: sightIds[initialSightsState.index],
  });

  const { currentSight, index, takenPictures } = sights.state;
  const title = useMemo(() => {
    const currentSightMetadata = sights.metadata[index];
    if (!currentSightMetadata) { return ''; }
    const { label, id } = currentSightMetadata;

    return `${label} - ${id}`;
  }, [index, sights.metadata]);

  const handleCameraReady = useCallback(() => {
    setReady(true);
    // eslint-disable-next-line no-console
    if (!Constants.PRODUCTION) { console.log(`Camera preview has been set`); }
  }, []);

  const handleCapture = useCallback((picture) => {
    const newPictures = { ...takenPictures, [currentSight]: picture };

    const remainingPictures = sightIds.length - Object.keys(newPictures)
      .filter((id) => sightIds.includes(id)).length;

    if (!Constants.PRODUCTION) {
      // eslint-disable-next-line no-console
      console.log(
        `It remains ${remainingPictures} picture${remainingPictures > 1 ? 's' : ''} to take`,
      );
    }

    const payload = {
      metadata: sights.metadata[index],
      name: currentSight,
      picture,
      remainingPictures,
      takenPictures: newPictures,
    };

    // eslint-disable-next-line no-console
    if (!Constants.PRODUCTION) { console.log(`Payload sent to 'onCapture' callback:`, payload); }

    onCapture(payload, setLoadingOff);
  }, [currentSight, index, onCapture, setLoadingOff, sightIds, sights.metadata, takenPictures]);

  useEffect(() => {
    if (!Constants.PRODUCTION) {
      // eslint-disable-next-line no-console
      console.log(`Capture workflow initialized with sights`, sights.metadata);
      // eslint-disable-next-line no-console
      console.log(`See https://sights.monk.ai?q=${sightIds.join(',')}`);
    }
  }, [sights.metadata, sightIds]);

  useEffect(() => {
    onChange(sights);
  }, [onChange, sights]);

  return (
    <View accessibilityLabel="Capture component" style={[styles.container, style]}>
      <Layout
        left={(
          <Sights
            dispatch={sights.dispatch}
            ids={sightIds}
            metadata={sights.metadata}
            {...sights.state}
          />
        )}
        right={(
          <Controls
            camera={camera}
            isReady={isReady}
            isLoading={isLoading}
            onCapture={handleCapture}
            onCapturing={setLoadingOn}
            sights={sights}
          />
        )}
      >
        <Camera
          onRef={setCamera}
          onCameraReady={handleCameraReady}
          title={title}
          {...settings}
        >
          {(isReady && sights.currentOverlay) ? (
            <Overlay
              svg={sights.currentOverlay}
              style={styles.overlay}
            />
          ) : null}
        </Camera>
      </Layout>
    </View>
  );
}

Capture.propTypes = {
  initialSettings: PropTypes.shape({
    ratio: PropTypes.string,
    zoom: PropTypes.number,
  }),
  initialSightsState: PropTypes.shape({
    currentSight: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    takenPictures: PropTypes.objectOf(PropTypes.object).isRequired,
  }),
  onCapture: PropTypes.func,
  onChange: PropTypes.func,
  sightIds: PropTypes.arrayOf(PropTypes.string),
};

Capture.defaultProps = {
  initialSettings: {
    ratio: '4:3',
    zoom: 0,
  },
  initialSightsState: {
    currentSight: '',
    index: 0,
    takenPictures: {},
  },
  onCapture: (payload, setLoadingOff) => { setLoadingOff(); },
  onChange: () => {},
  sightIds: [
    'VGv4m3', // front
    'H12i1w', // front left
    'QtRSGx', // front lateral left
    'uk3vsS', // lateral left
    '0o2lYb', // rear lateral left
    'IO3gpE', // rear left
    '17C0fh', // rear
    'Js1yPM', // rear right
    'OVluNy', // rear lateral right
    'unM2IO', // lateral right
    'AXuZ8H', // front lateral right
    'rVVtgm', // front right
  ],
};
