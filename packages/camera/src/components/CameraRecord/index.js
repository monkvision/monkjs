import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import PropTypes from 'prop-types';
import { Camera as ExpoCamera } from 'expo-camera';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import initiateProcessCut from './mock';
import Snackbar from './snackbar';
import useRecord from './hooks/useRecord';
import usePermission from './hooks/usePermission';

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
    alignSelf: 'flex-end',
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
  timer: {
    backgroundColor: 'red',
    borderRadius: 4,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginTop: 12,
  },
});

const SCORE_ACCEPTANCE = 3; // the max number of non-compliant frames allowed
const flatten = (value) => (Array.isArray(value) ? [].concat(...value.map(flatten)) : value);
const secToMinSec = (sec) => new Date(sec * 1000).toUTCString().split(' ')[4]; // seconds to hh:mm:ss
export default function CameraRecord() {
  const { setIsRecording, ref: cameraRef, isRecording, timer } = useRecord();
  const hasPermission = usePermission();

  const processCut = () => initiateProcessCut(); // to generate a new random every time
  const [cuts, setCuts] = useState([]);
  const [processedCuts, setProcessedCuts] = useState([]);

  const feedback = useMemo(
    () => processedCuts[processedCuts.length - 1]?.feedback,
    [processedCuts],
  );

  const handleStartRecord = useCallback(async (length = 0) => {
    if (length >= 3) { setIsRecording(false); return; }

    setIsRecording(true);
    const src = await cameraRef.current?.recordAsync({ maxDuration: 3, quality: '2160p' });
    setCuts((prev) => [...prev, { src }]);
    processCut({ src }).then((res) => setProcessedCuts((prev) => [...prev, res]));

    await handleStartRecord(length + 1);
  }, [cuts, isRecording]);

  const handleStopRecord = useCallback(async () => {
    const src = await cameraRef.current?.stopRecording();
    setIsRecording(null);
    setCuts((prev) => [...prev, { src }]);
    // TODO quit the video capture
  }, []);

  useEffect(() => {
    const allFeedbacks = processedCuts.map((p) => p.feedback);
    const allFeedbacksLength = flatten(allFeedbacks);

    if (allFeedbacksLength.length <= SCORE_ACCEPTANCE) { console.log('All good'); } // submit
  }, [processedCuts]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Snackbar feedback={feedback} show={isRecording} />
      <ExpoCamera style={styles.camera} ref={cameraRef}>
        <View style={styles.timer}>
          <Text style={styles.text}>{secToMinSec(timer)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={[styles.buttonBorder, { borderColor: isRecording ? 'red' : 'transparent' }]}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => (isRecording ? handleStopRecord() : handleStartRecord(0, isRecording))}
            />
          </View>
        </View>
      </ExpoCamera>
    </View>
  );
}

CameraRecord.propTypes = {};

CameraRecord.defaultProps = {};
