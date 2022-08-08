import React, { createElement, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useSentry } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';

import QuitButton from './QuitButton';
import SettingsButton from './SettingsButton';
import FullScreenButton from './FullScreenButton';
import TakePictureButton from './TakePictureButton';
import useHandlers from './hooks';
import i18next from '../../i18n';

const i18n = i18next;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    maxWidth: '100%',
    borderRadius: 150,
    width: 68,
    height: 68,
    backgroundColor: '#fff',
  },
});

export default function Controls({
  api,
  containerStyle,
  elements,
  loading,
  state,
  onStartUploadPicture,
  onFinishUploadPicture,
  Sentry,
  disableAll,
  connectionMode,
  ...passThroughProps
}) {
  const { height: windowHeight } = useWindowDimensions();

  const handlers = useHandlers({
    unControlledState: state,
    onStartUploadPicture,
    onFinishUploadPicture,
    stream: api.camera.current?.stream,
    connectionMode,
    Sentry,
  });
  const { errorHandler } = useSentry(Sentry);

  const hasNoIdle = useMemo(
    () => Object.values(state.uploads.state).every(({ status }) => status !== 'idle'),
    [state.uploads],
  );

  const handlePress = useCallback((e, { onPress }) => {
    if (typeof onPress === 'function') {
      onPress(state, api, e);
    } else {
      handlers.capture(state, api, e)
        .catch((err) => errorHandler(err, SentryConstants.type.COMPLIANCE));
    }
  }, [api, handlers, state]);

  return (
    <I18nextProvider i18n={i18n}>
      <View
        acccessibilityLabel="Controls"
        style={[styles.container, containerStyle, { maxHeight: windowHeight }]}
      >
        {elements.map(({
          id,
          children,
          component = TouchableOpacity,
          onPress,
          ...rest
        }) => (
          createElement(component, {
            key: `camera-control-${id}`,
            disabled: disableAll || loading || hasNoIdle,
            onPress: (e) => handlePress(e, { onPress, ...rest }),
            style: StyleSheet.flatten([styles.button]),
            ...rest,
            ...passThroughProps,
          }, children)
        ))}
      </View>
    </I18nextProvider>
  );
}

Controls.propTypes = {
  api: PropTypes.shape({
    camera: PropTypes.shape({
      current: PropTypes.objectOf(PropTypes.any),
      takePictureAsync: PropTypes.func,
    }),
    goNextSight: PropTypes.func,
    goPrevSight: PropTypes.func,
    startUploadAsync: PropTypes.func,
    takePictureSync: PropTypes.func,
  }),
  connectionMode: PropTypes.oneOf(['online', 'semi-offline', 'offline']).isRequired,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  disableAll: PropTypes.bool,
  elements: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.element,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
  })),
  loading: PropTypes.bool,
  onFinishUploadPicture: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  Sentry: PropTypes.any,
  state: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    embeddedCompliance: PropTypes.objectOf(PropTypes.any),
    lastTakenPicture: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
};

Controls.defaultProps = {
  api: {},
  containerStyle: null,
  disableAll: false,
  elements: [],
  loading: false,
  state: {},
  onStartUploadPicture: () => {},
  onFinishUploadPicture: () => {},
  Sentry: null,
};

Controls.CaptureButtonProps = {
  id: 'take-picture',
  accessibilityLabel: 'Take picture',
  children: <TakePictureButton />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#fff',
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 84,
    borderColor: 'white',
    borderWidth: 4,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 4 },
      default: { shadowRadius: '4px 4px' },
    }),
  },
};

Controls.FullscreenButtonProps = {
  id: 'full-screen',
  accessibilityLabel: 'Full Screen',
  children: <FullScreenButton />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#181829',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
    borderColor: '#181829',
    borderWidth: 2,
    shadowColor: '#181829',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 2 },
      default: { shadowRadius: '2px 2px' },
    }),
  },
};

Controls.SettingsButtonProps = {
  id: 'settings',
  accessibilityLabel: 'Settings',
  children: <SettingsButton />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#181829',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
    borderColor: '#181829',
    borderWidth: 2,
    shadowColor: '#181829',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 2 },
      default: { shadowRadius: '2px 2px' },
    }),
  },
};

Controls.GoBackButtonProps = {
  id: 'go-back',
  accessibilityLabel: 'Quit',
  children: <QuitButton />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#fa603d',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
    borderColor: '#fa603d',
    borderWidth: 2,
    shadowColor: '#fa603d',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 2 },
      default: { shadowRadius: '2px 2px' },
    }),
  },
};
