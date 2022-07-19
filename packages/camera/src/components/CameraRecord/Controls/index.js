import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import CircularProgress from '../ProgressBar/index';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-around',
    margin: 20,
  },
  recordButtonBorder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 99,
    borderWidth: 4,
    borderStyle: 'solid',
  },
  recordButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    backgroundColor: 'white',
    width: 28,
    height: 28,
    borderRadius: 4,
    position: 'absolute',
    zIndex: 99,
  },
  resetButtonLayout: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  verticalDash: {
    backgroundColor: 'white',
    width: 4,
    height: 24,
    borderRadius: 2,
  },
  continueButton: {
    width: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  buttonLayout: {
    width: 80,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});

export default function Controls({ onQuit, onStart, onStop, onReset, status, duration }) {
  const { pending, idle, finished, canceled, processing } = status;

  const handlePress = useCallback(() => {
    if (pending) { onStop(); }
    if (finished) { onReset(); }
    onStart();
  }, [idle, pending, onStop, onReset]);

  return (
    <View style={styles.root}>
      <View style={styles.buttonLayout}>
        <TouchableOpacity onPress={onQuit}>
          <Text style={styles.text}>QUIT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonLayout}>
        {pending ? (
          <View style={styles.resetButtonLayout}>
            <TouchableOpacity style={styles.resetButton} onPress={onStop} />
            <CircularProgress radius={30} color="#FFF" duration={duration} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.recordButton}
            onPress={handlePress}
            disabled={processing && finished}
          >
            {processing && finished ? <ActivityIndicator color="#FFF" /> : null}
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonLayout}>
        {canceled ? (
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.text}>RESET</Text>
          </TouchableOpacity>
        ) : null}
      </View>

    </View>
  );
}

Controls.propTypes = {
  duration: PropTypes.number.isRequired,
  onQuit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  status: PropTypes.shape({
    canceled: PropTypes.bool,
    cutting: PropTypes.bool,
    finished: PropTypes.bool,
    idle: PropTypes.bool,
    paused: PropTypes.bool,
    pending: PropTypes.bool,
    processing: PropTypes.bool,
  }).isRequired,
};

Controls.defaultProps = {};
