import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'react-native-paper';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import noop from 'Functions/noop';

export const CAMERA_STATUS = {
  idle: 'idle',
  capturing: 'capturing',
  captured: 'captured',
  processing: 'processing',
  processed: 'processed',
  saving: 'processing',
  saved: 'saved',
  waitingForUser: 'waitingForUser',
  error: 'error',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden', // prevent issuing elements to break the layout
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

/**
 * A View using Camera native features
 *
 * @param mediaSize {number[]}
 * @param minBrightness {number}
 * @param onCapture {func}
 * @param onClose {func}
 * @param onOpen {func}
 * @param onPress {func}
 * @param onSave {func}
 * @param rtl {bool}
 * @param style {object}
 * @param userValidation {bool}
 * @param passThroughProps
 * @returns {JSX.Element}
 * @constructor
 */
function Camera({
  mediaSize,
  minBrightness,
  onCapture,
  onClose,
  onOpen,
  onPress,
  onSave,
  rtl,
  style,
  userValidation,
  ...passThroughProps
}) {
  const theme = useTheme();

  const [type, setType] = useState(Camera.Constants.Type.back);
  const [currentStatus, setCurrentStatus] = useState(CAMERA_STATUS.idle);

  const [isIdle, setIdle] = useState(false);
  const [isCapturing, setCapturing] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [isSaving, setSaving] = useState(false);

  const [sensors, updateSensors] = useState({}); // use Transitions from React 18

  const state = useMemo(() => ({
    currentStatus,
    isCapturing,
    isIdle,
    isProcessing,
    isSaving,
    type,
  }), [currentStatus, isCapturing, isIdle, isProcessing, isSaving]);

  function handleOpen() {
    onOpen(state);
  }

  function handleClose() {
    onClose(state);
  }

  function handlePress() {
    onPress(state);
  }

  function handleCapture() {
    onCapture(state);
  }

  function handleSave() {
    onSave(state);
  }

  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ ...styles.container, style }}>
      <ExpoCamera style={styles.camera} type={type} {...passThroughProps}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back,
              );
            }}
          >
            <Text style={styles.text}> Flip </Text>
          </TouchableOpacity>
        </View>
      </ExpoCamera>
    </View>
  );
}

Camera.propTypes = {
  /* force resolution of the taken media */
  mediaSize: PropTypes.arrayOf(PropTypes.number),
  /* display a tooltip if brightness sensor is available and value is below this prop */
  minBrightness: PropTypes.number,
  onCapture: PropTypes.func,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
  onPress: PropTypes.func,
  onSave: PropTypes.func,
  /* takes a picture by default *
  onPress: PropTypes.func,
  /* if true UI is on the left of the screen */
  rtl: PropTypes.bool,
  /* @ignore */
  style: PropTypes.objectOf(PropTypes.any),
  /* display a View after asking to Retake or Validate the media */
  userValidation: PropTypes.bool,
};

Camera.defaultProps = {
  minBrightness: 0, // no minimum required by default
  mediaSize: [1600, 1600, 1], // 1600x1600 1M pixels
  onCapture: noop,
  onOpen: noop,
  onPress: noop,
  onSave: noop,
  rtl: false,
  style: {},
  userValidation: false,
};

export default Camera;
