import { useSentry } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';
import React, { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import CustomCaptureButton from './CustomCaptureButton';
import QuitButton from './QuitButton';
import SettingsButton from './SettingsButton';
import FullScreenButton from './FullScreenButton';
import TakePictureButton from './TakePictureButton';
import OverlaysToggleButton from './OverlaysToggleButton';
import PartSelector from './PartSelector';
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
  controlArray: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'end',
  },
  controlArraySpacer: {
    height: 20,
  },
  button: {
    maxWidth: '100%',
    borderRadius: 150,
    width: 68,
    height: 68,
    backgroundColor: '#fff',
  },
});

const insertBetween = (array, element) => [].concat(...array.map((n) => [n, element])).slice(0, -1);

export default function Controls({
  api,
  containerStyle,
  elements,
  loading,
  state,
  onStartUploadPicture,
  onFinishUploadPicture,
  onTogglePartSelector,
  Sentry,
  ...passThroughProps
}) {
  const { height: windowHeight } = useWindowDimensions();
  const { errorHandler } = useSentry(Sentry);
  const [customPictureTaken, setCustomPictureTaken] = useState(null);
  const [customPictureCallback, setCustomPictureCallback] = useState(null);

  const handlers = useHandlers({
    unControlledState: state,
    onStartUploadPicture,
    onFinishUploadPicture,
    stream: api.camera.current?.stream,
    Sentry,
  });

  const hasNoIdle = useMemo(
    () => Object.values(state.uploads.state).every(({ status }) => status !== 'idle'),
    [state.uploads],
  );

  const handlePress = useCallback((e, { onPress, onCustomTakePicture }) => {
    if (typeof onPress === 'function') {
      onPress(state, api, e);
    } else if (typeof onCustomTakePicture === 'function') {
      handlers.customCapture(api, e)
        .then((picture) => {
          setCustomPictureTaken(picture);
          setCustomPictureCallback(() => onCustomTakePicture);
        }).catch((err) => errorHandler(err, SentryConstants.type.APP));
    } else { handlers.capture(state, api, e); }
  }, [api, handlers, state, setCustomPictureTaken, setCustomPictureCallback]);

  const handleClosePartSelector = useCallback(() => {
    setCustomPictureTaken(null);
    setCustomPictureCallback(null);
  }, [setCustomPictureTaken, setCustomPictureCallback]);

  const handlePartSelected = useCallback((part) => {
    customPictureCallback({
      part,
      picture: customPictureTaken,
    });
    setCustomPictureTaken(null);
    setCustomPictureCallback(null);
  }, [customPictureTaken, customPictureCallback, setCustomPictureTaken, setCustomPictureCallback]);

  const createControlElement = useCallback(({
    id,
    children,
    component = TouchableOpacity,
    onPress,
    ...rest
  }) => createElement(component, {
    key: `camera-control-${id}`,
    disabled: loading || hasNoIdle,
    onPress: (e) => handlePress(e, { onPress, ...rest }),
    style: StyleSheet.flatten([styles.button]),
    ...rest,
    ...passThroughProps,
  }, children), [loading, hasNoIdle, handlePress, passThroughProps]);

  const createControlArray = useCallback((array) => (
    <View
      style={[styles.controlArray]}
    >
      {insertBetween(
        array.map((control) => createControlElement(control)),
        (<View style={[styles.controlArraySpacer]} />),
      )}
    </View>
  ), [createControlElement]);

  useEffect(() => {
    onTogglePartSelector(customPictureTaken !== null);
  }, [customPictureTaken]);

  return (
    <I18nextProvider i18n={i18n}>
      <View
        acccessibilityLabel="Controls"
        style={[styles.container, containerStyle, { maxHeight: windowHeight }]}
      >
        {elements.map((e) => (Array.isArray(e) ? createControlArray(e) : createControlElement(e)))}
      </View>
      {customPictureTaken === null ? null : (
        <PartSelector
          onClose={handleClosePartSelector}
          onSelectPart={handlePartSelected}
        />
      )}
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
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  elements: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape({
      component: PropTypes.element,
      disabled: PropTypes.bool,
      onCustomTakePicture: PropTypes.func,
      onPress: PropTypes.func,
    }),
    PropTypes.arrayOf(PropTypes.shape({
      component: PropTypes.element,
      disabled: PropTypes.bool,
      onCustomTakePicture: PropTypes.func,
      onPress: PropTypes.func,
    })),
  ])),
  loading: PropTypes.bool,
  onFinishUploadPicture: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  onTogglePartSelector: PropTypes.func,
  Sentry: PropTypes.any,
  state: PropTypes.shape({
    compliance: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
};

Controls.defaultProps = {
  api: {},
  containerStyle: null,
  elements: [],
  loading: false,
  state: {},
  onStartUploadPicture: () => {},
  onFinishUploadPicture: () => {},
  onTogglePartSelector: () => {},
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

Controls.CustomCaptureButtonProps = {
  id: 'custom-capture',
  accessibilityLabel: 'Custom Capture',
  children: <CustomCaptureButton label="Custom" />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#6187e3',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
    borderColor: '#6187e3',
    borderWidth: 4,
    shadowColor: '#6187e3',
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

Controls.OverlaysToggleButtonProps = {
  id: 'overlay-toggle',
  accessibilityLabel: 'Overlay Toggle',
  children: <OverlaysToggleButton />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#490505',
    width: 70,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
    borderColor: '#490505',
    borderWidth: 2,
    shadowColor: '#490505',
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
