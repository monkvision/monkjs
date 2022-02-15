import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Platform, StyleSheet, View } from 'react-native';

import getOS from '../../utils/getOS';
import useToggle from '../../hooks/useToggle';
import useOrientation from '../../hooks/useOrientation';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import useMobileBrowserConfig from '../../hooks/useMobileBrowserConfig';
import PortraitOrientationBlocker from './PortraitOrientationBlocker/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  section: {
    ...Platform.select({
      native: { height: '100%' },
      default: { height: '100vh' },
    }),
    minWidth: 100,
    alignItems: 'center',
  },
  fullScreenButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
  },
  hidden: {
    ...Platform.select({
      native: { opacity: 0 },
      default: { visibility: 'hidden', opacity: 0 },
    }),
  },
  right: {
    maxWidth: 141,
    flexGrow: 1,
  },
});

function FullScreenButton({ hidden, ...rest }) {
  const [isOn, setOn, setOff] = useToggle();
  const title = useMemo(() => (isOn ? 'ESC.' : 'Fullscreen'), [isOn]);

  const toggleFullScreen = useCallback(() => {
    if (!document) { return; }

    if (!document.fullscreenElement) {
      setOn();
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      setOff();
      document.exitFullscreen();
    }
  }, [setOff, setOn]);

  return Platform.OS === 'web' && (
    <View style={styles.fullScreenButtonContainer}>
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
  );
}

FullScreenButton.propTypes = {
  hidden: PropTypes.bool,
};

FullScreenButton.defaultProps = {
  hidden: false,
};

function Layout({ buttonFullScreenProps, children, containerStyle, left, right, sectionStyle }) {
  const isNative = Platform.select({ native: true, default: false });

  const { width: windowWidth } = useWindowDimensions();
  const mobileBrowserIsPortrait = useMobileBrowserConfig();
  const orientation = useOrientation('landscape');
  const [grantedLandscape, grantLandscape] = useState(false);
  const showOrientationBLocker = useMemo(() => (
    !['Mac OS', 'Windows', 'Linux'].includes(getOS())
    && (!grantedLandscape
    || mobileBrowserIsPortrait
    || (isNative && orientation.isNotLandscape))
  ), [grantedLandscape, isNative, mobileBrowserIsPortrait, orientation.isNotLandscape]);

  if (showOrientationBLocker) {
    return (
      <PortraitOrientationBlocker
        grantLandscape={grantLandscape}
        isPortrait={mobileBrowserIsPortrait}
      />
    );
  }

  return (
    <View
      accessibilityLabel="Layout"
      style={[styles.container, containerStyle]}
    >
      <View
        accessibilityLabel="Side left"
        style={[styles.section, styles.left, sectionStyle]}
      >
        {left}
      </View>
      <View
        accessibilityLabel="Center"
        style={[styles.section, Platform.select({
          native: { maxWidth: windowWidth - 225 },
          default: { maxWidth: 'calc(100% - 225px)' },
        }), sectionStyle]}
      >
        {children}
        <FullScreenButton {...buttonFullScreenProps} />
      </View>
      <View
        accessibilityLabel="Side right"
        style={[styles.section, styles.right, sectionStyle]}
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
