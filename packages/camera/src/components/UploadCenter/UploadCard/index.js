import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Animated, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  upload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 100,
    padding: spacing(1),
    marginVertical: spacing(1),
    borderRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    position: 'absolute',
  },
  imageLayout: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: spacing(2),
    position: 'relative',
  },
  imageOverlay: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 69, 0,0.4)',
  },
  text: {
    flexGrow: 1,
    flex: 1,
  },
});

export default function UploadCard({ hasError, uri, status }) {
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

  const interpolateOpacity = opacityAnimation.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [0.2, 1, 0.2],
  });
  const startAnimation = React.useCallback(() => {
    opacityAnimation.setValue(0);
    Animated.timing(opacityAnimation, {
      toValue: 2,
      duration: 2000,
      useNativeDriver: Platform.select({ web: false, native: true }),
    }).start((result) => {
      if (result.finished) {
        startAnimation();
      }
    });
  }, [opacityAnimation]);

  const stopAnimation = React.useCallback(() => {
    opacityAnimation.stopAnimation();
  }, [opacityAnimation]);

  React.useEffect(() => {
    startAnimation();
    return () => stopAnimation();
  }, [startAnimation, stopAnimation]);

  return (
    <View style={styles.upload}>
      {!hasError
        ? (
          <Animated.View style={[styles.imageLayout, { opacity: status === 'pending' ? interpolateOpacity : 1 }]}>
            <Image style={styles.image} source={{ uri }} />
          </Animated.View>
        )
        : (
          <TouchableOpacity style={styles.imageLayout}>
            <View style={styles.imageOverlay}>
              <MaterialCommunityIcons name="camera-retake" size={24} color="#FFF" />
            </View>
            <Image style={styles.image} source={{ uri }} />
          </TouchableOpacity>
        )}
      {hasError ? (
        <Text style={styles.text}>Image has not been uploaded</Text>
      ) : (
        <Text style={styles.text}>
          Image has been uploaded successfully
        </Text>
      )}
    </View>
  );
}

UploadCard.propTypes = {
  hasError: PropTypes.bool,
  status: PropTypes.string,
  uri: PropTypes.string,

};

UploadCard.defaultProps = {
  hasError: false,
  uri: '',
  status: '',
};
