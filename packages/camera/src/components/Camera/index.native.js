import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Text, View } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';

import { utils } from '@monkvision/toolkit';
import log from '../../utils/log';
import useAvailable from '../../hooks/useAvailable';
import usePermissions from '../../hooks/usePermissions';
import useWindowDimensions from '../../hooks/useWindowDimensions';

import styles from './styles';

const { getSize } = utils.styles;

function Camera({
  children,
  containerStyle,
  ratio,
  style,
  title,
  ...passThroughProps
}, ref) {
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
        ref={ref}
        ratio={ratio}
        onMountError={handleError}
        {...passThroughProps}
      >
        {children}
      </ExpoCamera>
      {title !== '' && <Text style={styles.title}>{title}</Text>}
    </View>
  );
}

export default forwardRef(Camera);

Camera.propTypes = {
  children: PropTypes.element,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ratio: PropTypes.string.isRequired,
  title: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  containerStyle: null,
  title: '',
};
