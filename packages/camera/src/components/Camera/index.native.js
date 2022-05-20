import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { Text, View, useWindowDimensions } from 'react-native';
import { Camera as ExpoCamera, PermissionStatus, CameraType } from 'expo-camera';

import { utils } from '@monkvision/toolkit';
import log from '../../utils/log';
import usePermissions from '../../hooks/usePermissions';

const { getSize } = utils.styles;

function Camera({
  children,
  containerStyle,
  ratio,
  style,
  title,
  ...passThroughProps
}, ref) {
  const permissions = usePermissions();

  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const size = getSize(ratio, { windowHeight, windowWidth });

  const handleError = useCallback((error) => {
    log([error], 'error');
  }, []);

  if (permissions.granted && permissions.status === PermissionStatus.GRANTED) {
    return (
      <ExpoCamera
        ref={ref}
        ratio={ratio}
        onMountError={handleError}
        {...passThroughProps}
        style={[containerStyle, size]}
      >
        {children}
      </ExpoCamera>
    );
  }

  if (permissions.status === PermissionStatus.DENIED) {
    return <Text>No access to camera. Permission denied!</Text>;
  }

  return <View />;
}

export default forwardRef(Camera);

Camera.propTypes = {
  children: PropTypes.element,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ratio: PropTypes.string,
  title: PropTypes.string,
  type: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  containerStyle: null,
  ratio: '4:3',
  title: '',
  type: CameraType.back,
};
