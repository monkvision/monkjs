import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Camera as ExpoCamera } from 'expo-camera';
import { StyleSheet, Text, View } from 'react-native';

import { initiateProcessCut } from './Mocks';

import useRecord from './hooks/useRecord';
import usePermission from './hooks/usePermission';
import useSensors from './hooks/useSensors';

import Feedback from './Feedback';
import Controls from './Controls';
import Timer from './Timer/index';
import Blocker from './Blocker/index';
import usePostFrames from './hooks/usePostFrames';
import ActivityIndicator from './ActivityIndicator/index';

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
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 999,
  },
});

const SCORE_ACCEPTANCE = 3; // the max number of non-compliant frames allowed
const TOTAL_CUTS = 2; // number of cuts
const DURATION = 5;
const recordOptions = { maxDuration: DURATION, quality: '2160p', mute: true };

const removeDuplication = (arr) => [...new Set([...arr])];
const flatten = (value) => (Array.isArray(value) ? [].concat(...value.map(flatten)) : value);
export default function CameraRecord({ onQuit, onValidate, inspectionId }) {
  const hasPermission = usePermission();
  const { status, start, reset, cancel, finish, cut, ready, pause, resume } = useRecord();
  const { pending, todo, cutting, canceled } = status;

  const sensors = useSensors();
  const { uploading } = usePostFrames(inspectionId, sensors);

  const cameraRef = useRef();

  const processCut = () => initiateProcessCut();
  const [cuts, setCuts] = useState([]);
  const [processedCuts, setProcessedCuts] = useState([]);

  const feedback = useMemo(
    () => processedCuts[processedCuts.length - 1]?.feedback,
    [processedCuts],
  );
  const allRecorded = useMemo(
    () => cuts.length >= TOTAL_CUTS,
    [cuts],
  );
  const allProcessed = useMemo(
    () => processedCuts.length === cuts.length,
    [cuts, processedCuts],
  );
  const processing = useMemo(
    () => !allRecorded || processedCuts.length < cuts.length,
    [processedCuts, allRecorded, cuts],
  );
  const compliant = useMemo(() => {
    const allFeedbacks = processedCuts.map((p) => p.feedback);
    const accepted = removeDuplication(flatten(allFeedbacks)).length < SCORE_ACCEPTANCE;

    return allProcessed && allRecorded && accepted;
  }, [allRecorded, allProcessed, processedCuts]);

  const handleRecord = useCallback(async () => {
    start();
    const src = await cameraRef.current?.recordAsync(recordOptions);
    cut();

    setCuts((prev) => [...prev, { src }]);
    processCut({ src }).then((res) => setProcessedCuts((prev) => [...prev, res]));
  }, [cuts, allRecorded]);

  const handleStop = useCallback(async () => {
    const src = await cameraRef.current?.stopRecording();
    if (src) { setCuts((prev) => [...prev, { src }]); }
  }, []);

  const handleReset = useCallback(async () => {
    setCuts([]);
    setProcessedCuts([]);
    reset();
  }, [reset]);

  // cancel the video
  useEffect(() => {
    if (canceled) { handleStop(); }
  }, [canceled, handleStop]);

  // start video
  useEffect(() => {
    if (!allRecorded && todo) { handleRecord(); }
  }, [handleRecord, allRecorded, todo]);

  // start a new cut
  useEffect(() => {
    if (!allRecorded && cutting) { handleRecord(); }
  }, [handleRecord, allRecorded, cutting]);

  // finish recording (got all cuts)
  useEffect(() => {
    if (allRecorded) { finish(); }
  }, [allRecorded, finish]);

  // feedback stisfaction
  useEffect(() => {
    if (compliant) { onValidate(); }
  }, [compliant]);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Blocker
        onReset={handleReset}
        allRecorded={allRecorded}
        allProcessed={allProcessed}
        compliant={compliant}
      />

      <Feedback feedback={feedback} show={pending} />

      <Timer status={status} />

      <ActivityIndicator show={uploading} />

      <ExpoCamera style={styles.camera} ref={cameraRef}>
        <Controls
          onQuit={onQuit}
          onStart={ready}
          onStop={cancel}
          onReset={handleReset}
          onPause={pause}
          onResume={resume}
          status={{ ...status, processing }}
          duration={DURATION * 1000} // in seconds
        />
      </ExpoCamera>
    </View>
  );
}

CameraRecord.propTypes = {
  inspectionId: PropTypes.string.isRequired,
  onQuit: PropTypes.func.isRequired,
  onValidate: PropTypes.func.isRequired,
};

CameraRecord.defaultProps = {};