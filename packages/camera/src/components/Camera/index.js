import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Text, View, useWindowDimensions } from 'react-native';
import Webcam from 'react-webcam';

import { utils } from '@monkvision/toolkit';
import log from '../../utils/log';
import useAvailable from '../../hooks/useAvailable';
import usePermissions from '../../hooks/usePermissions';

import styles from './styles';

const { getSize } = utils.styles;

const videoConstraints = {
  facingMode: 'environment',
};

export default function Camera({
  children,
  containerStyle,
  onCameraReady,
  onRef,
  ratio,
  style,
  title,
  ...passThroughProps
}) {
  const webcamRef = React.useRef(null);

  const available = useAvailable();
  const permissions = usePermissions();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const size = getSize(ratio, { windowHeight, windowWidth }, 'native');

  const handleUserMedia = useCallback(() => {
    onRef(webcamRef);
    onCameraReady(webcamRef);
  }, [onCameraReady, onRef]);

  const handleError = useCallback((error) => {
    log([error], 'error');
  }, []);

  if (permissions.isGranted === null) {
    return <View />;
  }

  if (permissions.isGranted === false || !available) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      accessibilityLabel="Camera container"
      style={[containerStyle, { height: '100%' }]}
    >
      <Webcam
        audio={false}
        forceScreenshotSourceSize
        imageSmoothing={false}
        ref={webcamRef}
        onUserMedia={handleUserMedia}
        onUserMediaError={handleError}
        screenshotFormat="image/webp"
        screenshotQuality={1}
        videoConstraints={videoConstraints}
        style={{ ...size, height: '100%' }}
        {...passThroughProps}
      />
      <View style={[styles.overCamera, size]}>
        {children}
      </View>
      {title !== '' && (
      <Text style={styles.title}>
        {title}
        pooop
      </Text>
      )}
    </View>
  );
}

Camera.propTypes = {
  children: PropTypes.element,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onCameraReady: PropTypes.func.isRequired,
  onRef: PropTypes.func.isRequired,
  ratio: PropTypes.string.isRequired,
  title: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  containerStyle: null,
  title: '',
};
