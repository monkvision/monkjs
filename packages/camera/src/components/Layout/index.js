import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Platform, StyleSheet, View } from 'react-native';

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
    height: '100%',
    minWidth: 100,
    overflow: 'hidden',
    alignItems: 'center',
  },
  fullScreenButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 8,
  },
});

function FullScreenButton() {
  const toggleFullScreen = useCallback(() => {
    if (!document) { return; }

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  return Platform.OS === 'web' && (
    <View style={styles.fullScreenButtonContainer}>
      <Button
        color="rgba(0,0,0,0.75)"
        acccessibilityLabel={toggleFullScreen}
        onPress={toggleFullScreen}
        title="Fullscreen"
      />
    </View>
  );
}

function Layout({ children, containerStyle, left, right, sectionStyle }) {
  const isNative = Platform.select({ native: true, default: false });

  const { width: windowWidth } = useWindowDimensions();
  const mobileBrowserIsPortrait = useMobileBrowserConfig();
  const orientation = useOrientation('landscape');
  const [grantedLandscape, grantLandscape] = useState(false);

  if (!grantedLandscape || mobileBrowserIsPortrait || (isNative && orientation.isNotLandscape)) {
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
        <FullScreenButton />
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
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  left: PropTypes.element,
  right: PropTypes.element,
  sectionStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Layout.defaultProps = {
  containerStyle: null,
  left: null,
  right: null,
  sectionStyle: null,
};

export default Layout;
