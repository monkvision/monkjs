import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import { Platform, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';

import Actions from '../../actions';
import Constants from '../../const';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    width: 68,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    borderRadius: 68,
    backgroundColor: 'white',
  },
  captureButton: {
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    borderRadius: 84,
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 4,
    overflow: 'hidden',
  },
});

export function ControlButton({ children, disabled, style, ...passThroughProps }) {
  return (
    <Pressable
      disabled={disabled}
      style={[styles.button, style]}
      {...passThroughProps}
    >
      {children}
    </Pressable>
  );
}

ControlButton.propTypes = {
  children: PropTypes.element,
  disabled: PropTypes.bool,
};

ControlButton.defaultProps = {
  children: null,
  disabled: false,
};

function Controls({ camera, containerStyle, isLoading, isReady, onCapture, onCapturing, sights }) {
  const [takenPicture, setPicture] = useState(false);
  const { height: windowHeight } = useWindowDimensions();

  const handleCapture = useCallback(async () => {
    setPicture('capturing');

    // eslint-disable-next-line no-console
    if (!Constants.PRODUCTION) { console.log(`Awaiting picture to be taken...`); }

    const picture = await camera.takePictureAsync();

    if (!Constants.PRODUCTION) {
      // eslint-disable-next-line no-console
      console.log(`Camera 'takePictureAsync' has fulfilled with picture:`, picture);
    }

    sights.dispatch({
      type: Actions.sights.SET_PICTURE,
      payload: { id: sights.state.currentSight, picture },
    });

    sights.dispatch({
      type: Actions.sights.NEXT_SIGHT,
    });

    setPicture(picture);
    onCapture(picture);
  }, [camera, onCapture, sights]);

  const disabled = useMemo(
    () => (!isReady || isLoading || takenPicture === 'capturing'),
    [isLoading, isReady, takenPicture],
  );

  useEffect(() => {
    if (takenPicture === 'capturing') {
      onCapturing();
    }
  }, [onCapturing, takenPicture]);

  return (
    <View
      acccessibilityLabel="Controls"
      style={[styles.container, containerStyle, Platform.select({
        native: { maxHeight: '100vh' },
        default: { maxHeight: windowHeight },
      })]}
    >
      <ControlButton
        acccessibilityLabel="Capture button"
        disabled={disabled}
        onPress={handleCapture}
        style={styles.captureButton}
      >
        <View style={styles.button} />
      </ControlButton>
    </View>
  );
}

Controls.propTypes = {
  camera: PropTypes.shape({ takePictureAsync: PropTypes.func }),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  isLoading: PropTypes.bool,
  isReady: PropTypes.bool,
  onCapture: PropTypes.func,
  onCapturing: PropTypes.func,
  sights: PropTypes.shape({
    dispatch: PropTypes.func,
    state: PropTypes.shape({ currentSight: PropTypes.string }),
  }).isRequired,
};

Controls.defaultProps = {
  camera: null,
  containerStyle: null,
  isLoading: false,
  isReady: false,
  onCapture: () => {},
  onCapturing: () => {},
};

export default Controls;
