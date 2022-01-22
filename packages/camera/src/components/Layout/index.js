import React from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

import useOrientation from '../../hooks/useOrientation';
import useMobileBrowserConfig from '../../hooks/useMobileBrowserConfig';

const windowWidth = Dimensions.get('window').width;

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
  center: {
    ...Platform.select({
      native: { maxWidth: windowWidth - 200 },
      web: { maxWidth: 'calc(100% - 200px)' },
    }),
  },
});

function Layout({ children, containerStyle, left, right, sectionStyle }) {
  const isNative = Platform.select({ native: true });

  const orientation = useOrientation();
  const mobileBrowserIsPortrait = useMobileBrowserConfig();

  if (mobileBrowserIsPortrait || (isNative && orientation.isNotLandscape)) {
    return (
      <View />
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
        style={[styles.section, styles.center, sectionStyle]}
      >
        {children}
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
