import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import screenfull from 'screenfull';
import { Button, Platform, StyleSheet, useWindowDimensions, View, Text } from 'react-native';

import useOrientation from '../../hooks/useOrientation';

const SIDE = 116;
export const SIDE_WIDTH = SIDE;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  portrait: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  section: {
    alignItems: 'center',
  },
  sectionPortrait: {
    transform: [{ rotate: '90deg' }],
  },
  fullScreenButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
  },
  isNotFullscreen: {
    top: 32,
  },
  isFullscreen: {
    bottom: 8,
  },
  hidden: {
    ...Platform.select({
      native: { opacity: 0 },
      default: { visibility: 'hidden', opacity: 0 },
    }),
  },
  side: {
    display: 'flex',
    zIndex: 10,
    width: SIDE,
    overflow: 'hidden',
  },
  leftPortrait: {
    transform: [{ matrix: [0, 1, -1, 0, -120, 85] }],
  },
  rightPortrait: {
    transform: [{ matrix: [0, 1, -1, 0, -120, -84] }],
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  rotate: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rotateContent: {
    transform: [{ rotate: '90deg' }],
  },
  title: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: 500,
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 20,
    marginVertical: 2,
  },
  p: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: 400,
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 14,
    marginVertical: 2,
  },
});

function FullScreenButton({ hidden, ...rest }) {
  const [isOn, setOn] = useState(screenfull.isFullscreen);
  const title = useMemo(() => (isOn ? 'Escape Fullscreen' : 'Fullscreen'), [isOn]);
  const isFullScreenStyle = useMemo(
    () => (isOn ? styles.isFullscreen : styles.isNotFullscreen),
    [isOn],
  );

  const toggleFullScreen = useCallback((on) => {
    const params = [undefined, { navigationUI: 'hide' }];

    if (on === true) {
      screenfull.request(params);
      setOn(true);
    } else if (on === false) {
      screenfull.exit();
      setOn(false);
    } else {
      screenfull.toggle(...params);
      setOn((prevState) => !prevState);
    }
  }, [setOn]);

  useEffect(() => {
    if (!screenfull.isEnabled || !document) { return; }

    // initial backgroundColor
    const backgroundColor = document.body.style.backgroundColor;

    // change the backgroundColor
    document.body.style.backgroundColor = '#000;';

    // eslint-disable-next-line consistent-return
    return () => {
    // reset the backgroundColor
      document.body.style.backgroundColor = backgroundColor;
      toggleFullScreen(false);
    };
  }, [toggleFullScreen]);

  return (Platform.OS === 'web' && screenfull.isEnabled) ? (
    <View style={[styles.fullScreenButtonContainer, isFullScreenStyle]}>
      <Button
        color="rgba(0,0,0,0.75)"
        acccessibilityLabel="Toggle FullScreen"
        onPress={toggleFullScreen}
        title={title}
        disabled={hidden}
        style={[hidden ? styles.hidden : {}]}
        {...rest}
      />
    </View>
  ) : null;
}

FullScreenButton.propTypes = {
  hidden: PropTypes.bool,
};

FullScreenButton.defaultProps = {
  hidden: false,
};

function Layout({ buttonFullScreenProps, children, left, right }) {
  useOrientation('landscape');
  const { height, width } = useWindowDimensions();
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' }) || height > width;

  const size = StyleSheet.create({
    height: isPortrait ? width : height,
    width: isPortrait ? height : width,
  });

  const containerStyle = StyleSheet.compose(
    styles.container,
    isPortrait && styles.portrait,
  );

  const sectionStyle = StyleSheet.compose(
    styles.section,
    isPortrait && styles.sectionPortrait,
  );

  const sideStyle = StyleSheet.compose(
    styles.side,
    isPortrait && styles.sidePortrait,
  );

  const leftStyle = StyleSheet.compose(
    [size, sectionStyle, sideStyle, { height: isPortrait ? width : height, width: SIDE }],
    isPortrait && styles.leftPortrait,
  );

  const rightStyle = StyleSheet.compose(
    [size, sectionStyle, sideStyle, { height: isPortrait ? width : height, width: SIDE }],
    isPortrait && styles.rightPortrait,
  );

  if (isPortrait) {
    return (
      <View style={[styles.rotate, { backgroundColor: '#000', height }]}>
        <View style={styles.rotateContent}>
          <Text style={styles.title}>Please rotate your device ↪️</Text>
          <Text style={styles.p}>
            To go through the all experience,
            you must turn you device in landscape mode.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View accessibilityLabel="Layout" style={[{ height, width }, styles.container, containerStyle]}>
      <View accessibilityLabel="Side left" style={leftStyle}>{left}</View>
      <View
        accessibilityLabel="Center"
        style={[size, sectionStyle, styles.center, {
          maxWidth: (isPortrait ? height : width) - (2 * SIDE),
        }]}
      >
        {children}
        <FullScreenButton {...buttonFullScreenProps} />
      </View>
      <View accessibilityLabel="Side right" style={rightStyle}>{right}</View>
    </View>
  );
}

Layout.propTypes = {
  buttonFullScreenProps: PropTypes.objectOf(PropTypes.any),
  left: PropTypes.element,
  right: PropTypes.element,
};

Layout.defaultProps = {
  buttonFullScreenProps: {},
  left: null,
  right: null,
};

export default Layout;
