import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, View } from 'react-native';
import { NEXT_SIGHT, SET_PICTURE } from '../../hooks/useSights';

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

  const handleCapture = useCallback(async () => {
    setPicture('capturing');

    const picture = await camera.takePictureAsync();

    sights.dispatch({
      type: SET_PICTURE,
      payload: { id: sights.state.currentSight, picture },
    });

    sights.dispatch({
      type: NEXT_SIGHT,
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
    <View acccessibilityLabel="Controls" style={[styles.container, containerStyle]}>
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
