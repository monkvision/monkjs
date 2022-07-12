import React, { useCallback, useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Camera as ExpoCamera } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});

export default function CameraRecord() {
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cuts, setCuts] = useState([]);
  const cameraRef = useRef();

  const handleStartRecord = useCallback(async (length = 0) => {
    if (length >= 3) { setIsRecording(false); return; }

    setIsRecording(true);
    const src = await cameraRef.current?.recordAsync({ maxDuration: 3, quality: '2160p' });
    setCuts((prev) => [...prev, { src }]);
    await handleStartRecord(length + 1);
  }, [cuts]);

  const handleStopRecord = useCallback(async () => {
    const src = await cameraRef.current?.stopRecording();
    setCuts((prev) => [...prev, { src }]);
    setIsRecording(false);
  }, []);

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
