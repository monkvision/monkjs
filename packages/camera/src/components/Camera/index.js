import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { Platform, StyleSheet, Text, View } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import usePermissions from '../../hooks/usePermissions';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export function getSize(ratio, { windowHeight, windowWidth }) {
  const [a, b] = ratio.split(':').sort((c, d) => (c + d));
  const longest = windowHeight <= windowWidth ? windowHeight : windowWidth;

  return {
    ...Platform.select({
      native: {
        height: longest,
        width: longest * (a / b),
      },
      default: {
        height: '100vh',
        width: `${Math.floor(100 * (a / b))}vh`,
      },
    }),
  };
}

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
  const permissions = usePermissions();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const size = getSize(ratio, { windowHeight, windowWidth });

  const handleError = useCallback((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, []);

  if (permissions.isGranted === null) {
    return <View />;
  }

  if (permissions.isGranted === false) {
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
