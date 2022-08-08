import React, { forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider, useTranslation } from 'react-i18next';

import { Text, View, useWindowDimensions } from 'react-native';
import { Camera as ExpoCamera, PermissionStatus, CameraType } from 'expo-camera';

import { utils } from '@monkvision/toolkit';
import log from '../../utils/log';
import usePermissions from '../../hooks/usePermissions';
import i18next from '../../i18n';

const i18n = i18next;
const { getSize } = utils.styles;

function Camera({
  children,
  containerStyle,
  ratio,
  style,
  ...passThroughProps
}, ref) {
  const { t } = useTranslation();
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
        useCamera2Api
      >
        {children}
      </ExpoCamera>
    );
  }

  if (permissions.status === PermissionStatus.DENIED) {
    return (
      <I18nextProvider i18n={i18n}>
        <Text>{t('camera.permissionDenied')}</Text>
      </I18nextProvider>
    );
  }

  return <View />;
}

export default forwardRef(Camera);

Camera.propTypes = {
  children: PropTypes.element,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  ratio: PropTypes.string,
  type: PropTypes.string,
};

Camera.defaultProps = {
  children: null,
  containerStyle: null,
  ratio: '4:3',
  type: CameraType.back,
};
