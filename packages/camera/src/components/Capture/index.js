import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import useSettings from '../../hooks/useSettings';

import useSights from '../../hooks/useSights';
import useToggle from '../../hooks/useToggle';

import Camera from '../Camera';
import Controls from '../Controls';
import Layout from '../Layout';
import Overlay from '../Overlay';
import Sights from '../Sights';

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

  const handleCapture = useCallback((picture) => {
    const { currentSight, index, takenPictures } = sights.state;
    const newPictures = { ...takenPictures, [currentSight]: picture };

    const remainingPictures = sightIds.length - Object.keys(newPictures)
      .filter((id) => sightIds.includes(id)).length;

    const payload = {
      metadata: sights.metadata[index],
      name: currentSight,
      picture,
      remainingPictures,
      takenPictures: newPictures,
    };

    onCapture(payload, setLoadingOff);
  }, [onCapture, setLoadingOff, sightIds, sights.metadata, sights.state]);

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
          onCameraReady={() => setReady(true)}
          {...settings}
        >
          {sights.currentOverlay ? (
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
