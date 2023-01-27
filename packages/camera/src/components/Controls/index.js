import React, { createElement, useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { I18nextProvider } from 'react-i18next';
import { Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import CustomCaptureButton from './CustomCaptureButton';
import CloseEarlyButton from './CloseEarlyButton';
import QuitButton from './QuitButton';
import SettingsButton from './SettingsButton';
import FullScreenButton from './FullScreenButton';
import TakePictureButton from './TakePictureButton';
import PartSelector from './PartSelector';
import Actions from '../../actions';
import useHandlers from './hooks';
import i18next from '../../i18n';

const i18n = i18next;
const MAX_LIMIT_FOR_PROCESSES = 4;

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
  onCloseEarly,
  ...passThroughProps
}) {
  const { height: windowHeight } = useWindowDimensions();
  const [customPictureTaken, setCustomPictureTaken] = useState(null);
  const [customPictureCallback, setCustomPictureCallback] = useState(null);

  const handlers = useHandlers({
    unControlledState: state,
    onStartUploadPicture,
    onFinishUploadPicture,
    stream: api.camera.current?.stream,
  });

  const hasNoIdle = useMemo(
    () => Object.values(state.uploads.state).every(({ status }) => status !== 'idle'),
    [state.uploads],
  );

  const handlePress = useCallback((e, { id, onPress, onCustomTakePicture, ...rest }) => {
    if (id === Controls.CloseEarlyButtonProps.id) {
      onCloseEarly({
        confirm: rest.confirm,
        confirmationMessage: rest.confirmationMessage,
      });
    } else if (typeof onPress === 'function') {
      onPress(state, api, e);
    } else if (typeof onCustomTakePicture === 'function') {
      handlers.customCapture(api, e)
        .then((picture) => {
          setCustomPictureTaken(picture);
          setCustomPictureCallback(() => onCustomTakePicture);
        }).catch(() => {
          // TODO: Add Monitoring code in MN-182
          // errorHandler(err, SentryConstants.type.APP)
        });
    } else { handlers.capture(state, api, e); }
  }, [api, handlers, state, setCustomPictureTaken, setCustomPictureCallback, onCloseEarly]);

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
    onPress: (e) => handlePress(e, { id, onPress, ...rest }),
    ...rest,
    ...passThroughProps,
    style: [
      rest.style ?? {},
      rest.disabled || loading || hasNoIdle ? { opacity: 0.6 } : {},
    ],
    disabled: rest.disabled || loading || hasNoIdle,
  }, children), [loading, hasNoIdle, handlePress, passThroughProps]);

  const createControlArray = useCallback((array) => (
    <View
      key={`control-array-${array.map((c) => c.id).join('-')}`}
      style={[styles.controlArray]}
    >
      {insertBetween(
        array.map((control) => createControlElement(control)),
        (<View key="spacer" style={[styles.controlArraySpacer]} />),
      )}
    </View>
  ), [createControlElement]);

  useEffect(() => {
    onTogglePartSelector(customPictureTaken !== null);
  }, [customPictureTaken]);

  useEffect(() => {
    const { current, ids, process } = state.sights.state;
    const { action, queue } = process;
    const noOfProcesses = queue.length;

    if (action === Actions.sights.ADD_PROCESS_TO_QUEUE) {
      if (noOfProcesses < MAX_LIMIT_FOR_PROCESSES && current.index !== (ids.length - 1)) {
        setTimeout(() => {
          onFinishUploadPicture(state, api);
          api.goNextSight();
        }, 500);
      }
    } else if (action === Actions.sights.REMOVE_PROCESS_FROM_QUEUE) {
      if (noOfProcesses === (MAX_LIMIT_FOR_PROCESSES - 1) && current.index !== (ids.length - 1)) {
        onFinishUploadPicture(state, api);
        api.goNextSight();
      }
    }
  }, [state.sights.state.process]);

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
  onCloseEarly: PropTypes.func,
  onFinishUploadPicture: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  onTogglePartSelector: PropTypes.func,
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
  onCloseEarly: () => {},
  onStartUploadPicture: () => {},
  onFinishUploadPicture: () => {},
  onTogglePartSelector: () => {},
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

Controls.CloseEarlyButtonProps = {
  id: 'close-button',
  accessibilityLabel: 'Close',
  children: <CloseEarlyButton label="Custom" />,
  style: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e16767',
    borderWidth: 1,
    borderColor: '#f1f1f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirm: true,
  confirmationMessage: {
    en: 'You haven\'t taken all the required pictures. Are you sure you want to end the insepction ?',
    fr: 'Vous n\'avez pas terminé de prendre toutes les photos nécessaires. Êtes-vous sûr(e) de vouloir terminer l\'inspection ?',
  },
};

Controls.FillerButtonProps = {
  id: 'filler-button',
  accessibilityLabel: 'None',
  children: null,
  style: {
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0,
  },
  pointerEvents: 'none',
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
