import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import screenfull from 'screenfull';
import { Button, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

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

function Layout({
  buttonFullScreenProps,
  children,
  left,
  right,
}) {
  const { height, width } = useWindowDimensions();
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  useOrientation('landscape');

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
