import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import useOrientation from '../../hooks/useOrientation';
import useMobileBrowserConfig from '../../hooks/useMobileBrowserConfig';

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
});

function Layout({ children, containerStyle, left, right, sectionStyle }) {
  const [isAvailable, setAvailable] = useState(false);
  const isNative = Platform.select({ native: true });

  const orientation = useOrientation();
  const { width: windowWidth } = useWindowDimensions();
  const mobileBrowserIsPortrait = useMobileBrowserConfig(setAvailable);

  if (!isAvailable) { return (<View />); }
  if (mobileBrowserIsPortrait || (isNative && orientation.isNotLandscape)) { return (<View />); }

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
          web: { maxWidth: 'calc(100% - 225px)' },
        }), sectionStyle]}
      >
        {isAvailable ? children : <ActivityIndicator size="large" />}
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
