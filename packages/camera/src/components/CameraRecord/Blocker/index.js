import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 20,
    left: 0,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 120,
    height: 30,
    margin: 12,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default function Blocker({ onReset, compliant, allProcessed, allRecorded }) {
  if (!allRecorded) { return null; }

  return (
    <View style={styles.root}>
      <Text style={styles.text}>
        {allRecorded && !allProcessed ? 'Precessing...' : null}
        {allRecorded && allProcessed && !compliant ? 'The video is not compliant, please retake' : null}
      </Text>

      {allRecorded && allProcessed && !compliant ? (
        <TouchableOpacity onPress={onReset} style={styles.button}>
          <Text style={styles.text}>Retake</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

Blocker.propTypes = {
  allProcessed: PropTypes.bool.isRequired,
  allRecorded: PropTypes.bool.isRequired,
  compliant: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
};
