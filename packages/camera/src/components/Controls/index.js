import React, { createElement, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';

import AddDamageButton from './AddDamageButton';
import CloseEarlyButton from './CloseEarlyButton';
import QuitButton from './QuitButton';
import SettingsButton from './SettingsButton';
import FullScreenButton from './FullScreenButton';
import TakePictureButton from './TakePictureButton';
import Actions from '../../actions';
import useHandlers from './hooks';

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
    justifyContent: 'flex-end',
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
  buttonDisabled: {
    opacity: 0.5,
  },
});

const insertBetween = (array, element) => [].concat(...array.map((n) => [n, element])).slice(0, -1);

export default function Controls({
  api,
  containerStyle,
  elements,
  loading,
  state,
  hideAddDamage,
  onAddDamagePressed,
  onAddDamageUploadPicture,
  onStartUploadPicture,
  onFinishUploadPicture,
  addDamageParts,
  onResetAddDamageStatus,
  onCloseEarly,
  isPortraitModeVinLayoutView,
  onPictureTaken,
  ...passThroughProps
}) {
  const { height: windowHeight } = useWindowDimensions();

  const handlers = useHandlers({
    unControlledState: state,
    onStartUploadPicture,
    onFinishUploadPicture,
    stream: api.camera.current?.stream,
    onResetAddDamageStatus,
    onPictureTaken,
  });

  const isAddDamageButtonAndDisabled = useCallback(
    (id) => id === Controls.AddDamageButtonProps.id && (
      (addDamageParts && addDamageParts.length > 0)
        || state.additionalPictures.state.takenPictures.length >= 10
    ),
    [addDamageParts, state.additionalPictures],
  );

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
    } else if (id === Controls.AddDamageButtonProps.id) {
      onAddDamagePressed();
    } else if (typeof onPress === 'function') {
      onPress(state, api, e);
    } else { handlers.capture(state, api, e, addDamageParts); }
  }, [api, handlers, state, onAddDamagePressed, addDamageParts, onCloseEarly]);

  const getRotationForPortraitModeStyle = (id, rotateForPortrait) => isPortraitModeVinLayoutView
    && rotateForPortrait
    && { transform: [{ rotate: '90deg' }] };

  const createControlElement = useCallback(({
    id,
    children,
    component = TouchableOpacity,
    onPress,
    rotateForPortrait,
    ...rest
  }) => (id === Controls.AddDamageButtonProps.id && hideAddDamage
    ? null
    : createElement(component, {
      key: `camera-control-${id}`,
      onPress: (e) => handlePress(e, { id, onPress, ...rest }),
      ...rest,
      ...passThroughProps,
      style: [
        rest.style ?? {},
        rest.disabled || loading
          || hasNoIdle || isAddDamageButtonAndDisabled(id) ? styles.buttonDisabled : {},
        getRotationForPortraitModeStyle(id, rotateForPortrait),
      ],
      disabled: rest.disabled || loading || hasNoIdle || isAddDamageButtonAndDisabled(id),
    }, children)), [
    loading,
    hasNoIdle,
    handlePress,
    passThroughProps,
    Controls.AddDamageButtonProps.id,
    hideAddDamage,
    isAddDamageButtonAndDisabled,
  ]);

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
    <View
      acccessibilityLabel="Controls"
      style={[styles.container, containerStyle, { maxHeight: windowHeight }]}
    >
      {elements.map((e) => (Array.isArray(e) ? createControlArray(e) : createControlElement(e)))
        .filter((e) => e !== null)}
    </View>
  );
}

Controls.propTypes = {
  addDamageParts: PropTypes.arrayOf(PropTypes.string),
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
  hideAddDamage: PropTypes.bool,
  isPortraitModeVinLayoutView: PropTypes.bool,
  loading: PropTypes.bool,
  onAddDamagePressed: PropTypes.func,
  onAddDamageUploadPicture: PropTypes.func,
  onCloseEarly: PropTypes.func,
  onFinishUploadPicture: PropTypes.func,
  onPictureTaken: PropTypes.func,
  onResetAddDamageStatus: PropTypes.func,
  onStartUploadPicture: PropTypes.func,
  state: PropTypes.shape({
    additionalPictures: PropTypes.shape({
      dispatch: PropTypes.func.isRequired,
      name: PropTypes.string.isRequired,
      state: PropTypes.shape({
        takenPictures: PropTypes.arrayOf(PropTypes.shape({
          labelKey: PropTypes.string.isRequired,
          picture: PropTypes.any,
          previousSight: PropTypes.string.isRequired,
        })),
      }).isRequired,
    }).isRequired,
    compliance: PropTypes.objectOf(PropTypes.any),
    settings: PropTypes.objectOf(PropTypes.any),
    sights: PropTypes.objectOf(PropTypes.any),
    uploads: PropTypes.objectOf(PropTypes.any),
  }),
};

Controls.defaultProps = {
  addDamageParts: [],
  api: {},
  containerStyle: null,
  elements: [],
  hideAddDamage: false,
  loading: false,
  state: {},
  onCloseEarly: () => {},
  onPictureTaken: () => {},
  onAddDamagePressed: () => {},
  onAddDamageUploadPicture: () => {},
  onStartUploadPicture: () => {},
  onFinishUploadPicture: () => {},
  onResetAddDamageStatus: () => {},
  isPortraitModeVinLayoutView: false,
};

Controls.CaptureButtonProps = {
  id: 'take-picture',
  accessibilityLabel: 'Take picture',
  children: <TakePictureButton />,
  rotateForPortrait: true,
  style: {
    maxWidth: '100%',
    backgroundColor: '#fff',
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
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
  rotateForPortrait: true,
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

Controls.AddDamageButtonProps = {
  id: 'add-damage',
  accessibilityLabel: 'Zoomed Damage',
  children: <AddDamageButton
    label="Zoomed Damage"
    customStyle={{
      fontSize: 12,
      color: '#020202',
      paddingBottom: 3,
    }}
  />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#eaeaea',
    width: 75,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 65,
    borderColor: '#1e1e1e',
    borderWidth: 2,
    shadowColor: '#656565',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 4 },
      default: { shadowRadius: '4px 4px' },
    }),
  },
};

Controls.getFullScreenButtonProps = (isFullscreen) => ({
  id: 'full-screen',
  accessibilityLabel: 'Full Screen',
  children: <FullScreenButton isInFullScreenMode={isFullscreen} />,
  style: {
    maxWidth: '100%',
    backgroundColor: '#181829',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 50,
    borderColor: '#181829',
    borderWidth: 2,
    shadowColor: '#181829',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 0 },
    ...Platform.select({
      native: { shadowRadius: 2, opacity: 0 },
      default: { shadowRadius: '2px 2px', visibility: 'visible' },
    }),
  },
});

Controls.SettingsButtonProps = {
  id: 'settings',
  accessibilityLabel: 'Settings',
  children: <SettingsButton />,
  rotateForPortrait: true,
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
  rotateForPortrait: true,
  style: {
    maxWidth: '100%',
    backgroundColor: '#fa603d',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 50,
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
