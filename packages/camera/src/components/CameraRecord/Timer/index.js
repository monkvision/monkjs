import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native'; // seconds to hh:mm:ss
import { useInterval } from '@monkvision/toolkit';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    width: 110,
    alignSelf: 'center',
    marginTop: 20,
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 99,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  timer: {
    backgroundColor: 'red',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
});

const ONE_SECOND = 1000;
const secToMinSec = (sec) => new Date(sec * 1000).toUTCString().split(' ')[4];

export default function Timer({ status }) {
  const [timer, setTimer] = useState(0);
  const { pending, todo, idle } = status;

  const delay = useMemo(() => (pending ? ONE_SECOND : null));
  useInterval(() => setTimer((prev) => prev + 1), delay);

  useEffect(() => { if (todo || idle) { setTimer(0); } }, [todo, idle]);

  return (
    <View style={styles.root}>
      <View style={styles.timer}>
        <Text style={styles.text}>{secToMinSec(timer)}</Text>
      </View>
    </View>
  );
}

Timer.propTypes = {
  status: PropTypes.shape({
    canceled: PropTypes.bool,
    cutting: PropTypes.bool,
    finished: PropTypes.bool,
    idle: PropTypes.bool,
    pending: PropTypes.bool,
    todo: PropTypes.bool,
  }).isRequired,
};

Timer.defaultProps = {};
