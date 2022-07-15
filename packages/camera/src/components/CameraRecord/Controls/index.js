import React, { useCallback } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

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
    borderRadius: 999,
    borderWidth: 4,
    borderStyle: 'solid',
  },
  recordButton: {
    backgroundColor: 'red',
    width: 60,
    height: 60,
    borderRadius: 999,
  },
  resetButton: {
    backgroundColor: 'white',
    width: 40,
    height: 40,
    borderRadius: 8,
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

export default function Controls({ onQuit, onStart, onStop, onPause, onReset, status }) {
  const { pending, idle, finished } = status;

  const handlePress = useCallback(() => {
    if (pending) { onStop(); }
    onStart();
  }, [idle, pending]);

  return (
    <View style={styles.root}>
      <View style={styles.buttonLayout}>
        <TouchableOpacity onPress={onQuit}>
          <Text style={styles.text}>QUIT</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonLayout}>
        {pending
          ? <TouchableOpacity style={styles.resetButton} onPress={onStop} />
          : <TouchableOpacity style={styles.recordButton} onPress={handlePress} />}
      </View>

      <View style={styles.buttonLayout}>
        {pending ? (
          <TouchableOpacity onPress={onPause}>
            <Text style={styles.text}>PAUSE</Text>
          </TouchableOpacity>
        ) : null}
        {finished ? (
          <TouchableOpacity onPress={onReset}>
            <Text style={styles.text}>RESET</Text>
          </TouchableOpacity>
        ) : null}
      </View>

    </View>
  );
}

Controls.propTypes = {
  onPause: PropTypes.func.isRequired,
  onQuit: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  status: PropTypes.shape({
    finished: PropTypes.bool,
    idle: PropTypes.bool,
    pending: PropTypes.bool,
  }).isRequired,
};

Controls.defaultProps = {};
