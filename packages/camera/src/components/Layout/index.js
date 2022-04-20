import React, { useState, useCallback, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMediaQuery } from 'react-responsive';
import screenfull from 'screenfull';
import { Button, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import useMobileBrowserConfig from '../../hooks/useMobileBrowserConfig';
import useOrientation from '../../hooks/useOrientation';

export const SIDE_WIDTH = 116;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  section: {
    alignItems: 'center',
    overflow: 'hidden',
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
    position: 'absolute',
    width: SIDE_WIDTH,
    zIndex: 10,
  },
  left: {
    top: 0,
    left: 0,
  },
  right: {
    top: 0,
    right: 0,
  },
  center: {
    display: 'flex',
    width: '100%',
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
  containerStyle,
  left,
  right,
  sectionStyle,
}) {
  const { height } = useWindowDimensions();
  const isPortrait = useMediaQuery({ query: '(orientation: portrait)' });

  useMobileBrowserConfig();
  useOrientation('landscape');

  return (
    <View
      accessibilityLabel="Layout"
      style={[styles.container, containerStyle, isPortrait ? styles.portrait : {}]}
    >
      <View
        accessibilityLabel="Side left"
        style={[
          styles.section,
          styles.side,
          styles.left,
          isPortrait ? styles.leftPortrait : {},
          sectionStyle,
          { height: isPortrait ? height / 2 : height },
        ]}
      >
        {left}
      </View>
      <View
        accessibilityLabel="Center"
        style={[
          styles.section,
          sectionStyle,
          styles.center,
          isPortrait ? styles.centerPortrait : {},
          { height },
        ]}
      >
        {children}
        <FullScreenButton {...buttonFullScreenProps} />
      </View>
      <View
        accessibilityLabel="Side right"
        style={[
          styles.section,
          styles.side,
          styles.right,
          isPortrait ? styles.rightPortrait : {},
          sectionStyle,
          { height: isPortrait ? height / 2 : height },
        ]}
      >
        {right}
      </View>
    </View>
  );
}

Layout.propTypes = {
  buttonFullScreenProps: PropTypes.objectOf(PropTypes.any),
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  left: PropTypes.element,
  right: PropTypes.element,
  sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Layout.defaultProps = {
  buttonFullScreenProps: {},
  containerStyle: null,
  left: null,
  right: null,
  sectionStyle: null,
};

export default Layout;
