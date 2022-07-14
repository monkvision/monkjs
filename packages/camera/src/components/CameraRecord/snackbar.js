import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 20,
    zIndex: 9,
    left: 20,
    padding: 8,
    backgroundColor: '#181829',
    minWidth: 200,
    borderRadius: 4,
  },
  titleLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  realtimeIndicator: {
    width: 6,
    height: 6,
    marginHorizontal: 4,
    backgroundColor: '#C4F7AB',
    borderRadius: 90,
  },
  title: {
    color: '#C4F7AB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  feedbackText: {
    color: '#fafafa',
  },
});

const feedbackVariants = {
  blurriness: 'is blurry',
  underexposure: 'is underexposed (too dark)',
  overexposure: 'is overexposed (too bright)',
  'TOO_ZOOMED--too zoomed': 'is too zoomed',
  'NOT_ZOOMED_ENOUGH--not zoomed enough': 'is too far from vehicle',
  'WRONG_ANGLE--wrong angle': 'is taken from incorrect angle',
  'UNKNOWN_VIEWPOINT--unknown viewpoint': 'doesn\'t match photo guide',
  'WRONG_CENTER_PART--picture centered on the wrong parts': 'is not centered on the right part',
  'MISSING_PARTS--missing some parts': 'is missing important car parts',
  'HIDDEN_PARTS--some parts not visible enough': 'has some car parts not visible enough',
  'NO_CAR_BODY--no car body detected': 'doesn\'t have a clear vehicle',
};

const composeFeedback = (fb) => {
  const feedback = [];
  fb.forEach((reason, index) => {
    const first = index === 0;
    feedback.push(first ? feedbackVariants[reason] : `and ${feedbackVariants[reason]}`);
  });
  return feedback.toString().replace(',', ', ');
};

export default function Snackbar({ feedback, show }) {
  const [persistedFeedback, setPersistedFeedback] = useState();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => Animated.spring(fadeAnim, { toValue: 1,
    useNativeDriver: true,
    friction: 20,
    tension: 160 }).start();
  const fadeOut = (onComplete) => Animated.spring(fadeAnim, { toValue: 0,
    useNativeDriver: true,
    friction: 20,
    tension: 160 })
    .start(onComplete);

  useEffect(() => {
    if (!feedback) { return; }
    fadeOut(() => { setPersistedFeedback(feedback); fadeIn(); });
  }, [feedback]);

  if (!persistedFeedback || !show) { return null; }

  return (
    <View style={styles.root}>
      <View style={styles.titleLayout}>
        <Text style={styles.title}>Realtime feedback</Text>
        <View style={styles.realtimeIndicator} />
      </View>
      <Animated.Text style={[styles.feedbackText, { opacity: fadeAnim }]}>{`The video ${composeFeedback(persistedFeedback)}`}</Animated.Text>
    </View>
  );
}

Snackbar.propTypes = {
  feedback: PropTypes.arrayOf(PropTypes.string),
  show: PropTypes.bool,
};

Snackbar.defaultProps = {
  feedback: null,
  show: false,
};
