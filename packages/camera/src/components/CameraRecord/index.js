import React, { useCallback, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Camera as ExpoCamera } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import processCut from './mock';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  buttonBorder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderRadius: 999,
    borderWidth: 4,
    borderStyle: 'solid',
  },
  button: {
    backgroundColor: 'red',
    width: 80,
    height: 80,
    borderRadius: 999,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  feedback: {
    position: 'absolute',
    bottom: 20,
    zIndex: 9,
    right: 20,
    padding: 8,
    backgroundColor: 'grey',
    minWidth: 200,
    minHeight: 40,
    borderRadius: 4,
  },
  feedbackText: {
    color: 'white',
  },
});

export default function CameraRecord() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cuts, setCuts] = useState([]);
  const [processedCuts, setProcessedCuts] = useState([]);
  const [snackbar, setSnackbar] = useState(null);
  const cameraRef = useRef();

  const handleStartRecord = useCallback(async (length = 0) => {
    if (length >= 3) { setIsRecording(false); return; }

    setIsRecording(true);
    const src = await cameraRef.current?.recordAsync({ maxDuration: 3, quality: '2160p' });
    setCuts((prev) => [...prev, { src }]);
    processCut({ src })
      .then((res) => setProcessedCuts((prev) => [...prev, res]))
      .catch((err) => console.log({ err }));
    await handleStartRecord(length + 1);
  }, [cuts]);

  const handleStopRecord = useCallback(async () => {
    const src = await cameraRef.current?.stopRecording();
    setCuts((prev) => [...prev, { src }]);
    setIsRecording(false);
  }, []);

  useEffect(() => {
    if (!processedCuts.length) { return; }
    const { feedback } = processedCuts[processedCuts.length - 1];
    setSnackbar(feedback);
  }, [processedCuts]);

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestCameraPermissionsAsync();
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
    <View style={styles.container}>
      {snackbar ? (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{snackbar}</Text>
        </View>
      ) : null}
      <ExpoCamera style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonBorder, { borderColor: isRecording ? 'red' : 'transparent' }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => (isRecording ? handleStopRecord() : handleStartRecord())}
            />
          </View>
        </View>
      </ExpoCamera>
    </View>
  );
}

CameraRecord.propTypes = {};

CameraRecord.defaultProps = {};
