import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Camera as ExpoCamera } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';
import Controls from './Controls';
import initiateProcessCut from './mock';
import Snackbar from './snackbar';
import useRecord from './hooks/useRecord';
import usePermission from './hooks/usePermission';
import useTimer from './hooks/useTimer';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  timer: {
    position: 'absolute',
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
const TOTAL_CUTS = 3; // number of cuts
const DURATION = 3;

const flatten = (value) => (Array.isArray(value) ? [].concat(...value.map(flatten)) : value);
const secToMinSec = (sec) => new Date(sec * 1000).toUTCString().split(' ')[4]; // seconds to hh:mm:ss
export default function CameraRecord({ onQuit }) {
  const hasPermission = usePermission();
  const { status, start, reset, cancel, finish, cut, ready } = useRecord();
  const { pending, todo, cutting } = status;

  const timer = useTimer(status);

  const cameraRef = useRef();
  const processCut = () => initiateProcessCut(); // to generate a new random every time
  const [cuts, setCuts] = useState([]);
  const [processedCuts, setProcessedCuts] = useState([]);

  const feedback = useMemo(
    () => processedCuts[processedCuts.length - 1]?.feedback,
    [processedCuts],
  );

  const record = useCallback(async () => {
    start();
    const src = await cameraRef.current?.recordAsync({ maxDuration: DURATION, quality: '2160p' });
    cut();

    setCuts((prev) => [...prev, { src }]);
    processCut({ src }).then((res) => setProcessedCuts((prev) => [...prev, res]));
  }, [cuts]);

  const stop = useCallback(async () => {
    const src = await cameraRef.current?.stopRecording();
    cancel();
    setCuts((prev) => [...prev, { src }]);
  }, []);

  useEffect(() => {
    const hasRecordedAllCuts = cuts.length >= TOTAL_CUTS;
    if (!hasRecordedAllCuts && (todo || cutting)) { record(); }
    if (hasRecordedAllCuts) { finish(); }
  }, [record, cuts, todo]);

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
      <Snackbar feedback={feedback} show={pending} />

      <ExpoCamera style={styles.camera} ref={cameraRef}>
        <View style={styles.timer}>
          <Text style={styles.text}>{secToMinSec(timer)}</Text>
        </View>

        <Controls
          onQuit={onQuit}
          onStart={ready}
          onStop={stop}
          onReset={() => { setCuts([]); setProcessedCuts([]); reset(); }}
          onPause={() => console.log('pause')}
          status={status}
        />
      </ExpoCamera>
    </View>
  );
}

CameraRecord.propTypes = {
  onQuit: PropTypes.func.isRequired,
};

CameraRecord.defaultProps = {};
