import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { StyleSheet, Text, View } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import { utils } from '@monkvision/toolkit';
import log from '../../utils/log';
import useAvailable from '../../hooks/useAvailable';
import usePermissions from '../../hooks/usePermissions';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const { getSize } = utils.styles;

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 18,
    color: 'white',
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 9,
    marginTop: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    position: 'absolute',
  },
});

export default function Camera({
  children,
  containerStyle,
  onRef,
  ratio,
  style,
  title,
  ...passThroughProps
}) {
  const available = useAvailable();
  const permissions = usePermissions();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const size = getSize(ratio, { windowHeight, windowWidth });

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
      style={[containerStyle, size]}
    >
      <ExpoCamera
        ref={onRef}
        ratio={ratio}
        onMountError={handleError}
        type={ExpoCamera.Constants.Type.back}
        {...passThroughProps}
      >
        {children}
      </ExpoCamera>
      {title !== '' && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

Camera.propTypes = {
  children: PropTypes.element,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  onRef: PropTypes.func.isRequired,
  ratio: PropTypes.string.isRequired,
  title: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  containerStyle: null,
  title: '',
};
