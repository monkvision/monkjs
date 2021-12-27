import React, { useCallback, useRef } from 'react';
import { Animated, Image, Platform, View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from 'react-native-paper';

import Placeholder from 'components/Placeholder/index';
import MonkIcon from 'components/Icons/MonkIcon';

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 10,
  },
  errorCardLayout: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  skeleton: { position: 'absolute', zIndex: 1 },
});

export default function Img({ style, skeletonStyle, ...props }) {
  const { colors } = useTheme();

  const imageOpacity = useRef(new Animated.Value(0)).current;
  const placeholderOpacity = useRef(new Animated.Value(1)).current;
  const errorCardOpacity = useRef(new Animated.Value(0)).current;

  const handleAnimateOpacity = useCallback(
    (toValue, animation) => Animated.timing(animation, {
      duration: 250,
      toValue,
      useNativeDriver: Platform.select({ native: true, web: false }),
    }), [],
  );
  const onLoad = useCallback(() => {
    // hide placeholder
    handleAnimateOpacity(0, placeholderOpacity).start();
    // show image
    handleAnimateOpacity(1, imageOpacity).start();
  }, [imageOpacity, placeholderOpacity, handleAnimateOpacity]);

  const onError = useCallback(() => {
    // hide placeholder
    handleAnimateOpacity(0, placeholderOpacity).start();
    // show error card
    Animated.sequence([
      Animated.delay(300),
      handleAnimateOpacity(1, errorCardOpacity),
    ]).start();
  }, [errorCardOpacity, handleAnimateOpacity, placeholderOpacity]);

  // onError doesn't trigger on IOS that's why we put it into onLoadEnd
  const events = Platform.select({
    default: { onError },
    ios: { onLoadEnd: onError },
  });

  return (
    <View style={[style, { position: 'relative' }]}>
      {/* the image is wrapped into an animated
       view to make the image style manipulation natural */}
      <Animated.View style={{ opacity: imageOpacity, position: 'absolute', zIndex: 10 }}>
        <Image
          style={style}
          onLoad={onLoad}
          {...events}
          {...props}
        />
      </Animated.View>

      {/* show this card when no image loaded  */}
      <Animated.View style={[style, styles.errorCardLayout,
        { opacity: errorCardOpacity,
          backgroundColor: colors.primary,
        },
      ]}
      >
        <MonkIcon
          width={71}
          height={32}
          color="#FFFFFF"
          alt="Monk logo"
        />
        <Text style={styles.text}>Broken image</Text>
      </Animated.View>

      <Animated.View style={[styles.skeleton, { opacity: placeholderOpacity }]}>
        <Placeholder style={skeletonStyle} />
      </Animated.View>
    </View>
  );
}

Img.propTypes = {
  skeletonStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
};

Img.defaultProps = {
  skeletonStyle: {},
  style: {},

};
