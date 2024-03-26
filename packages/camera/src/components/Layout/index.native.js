import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

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
  section: {
    alignItems: 'center',
  },
  side: {
    zIndex: 10,
    width: SIDE,
    overflow: 'hidden',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
});

function Layout({ backgroundColor, children, isReady, left, right }) {
  const { height, width } = useWindowDimensions();

  const size = { width, height };

  const leftStyle = StyleSheet.compose(
    [size, styles.section, styles.side, { width: SIDE }],
    styles.leftPortrait,
  );

  const rightStyle = StyleSheet.compose(
    [size, styles.section, styles.side, { width: SIDE }],
    styles.rightPortrait,
  );

  return (
    <View
      accessibilityLabel="Layout"
      style={[
        { height, width },
        styles.container,
        { backgroundColor },
      ]}
    >
      <View accessibilityLabel="Side left" style={leftStyle}>{isReady && left}</View>
      <View
        accessibilityLabel="Center"
        style={[size, styles.section, styles.center, {
          maxWidth: width - (2 * SIDE),
        }]}
      >
        {children}
      </View>
      <View accessibilityLabel="Side right" style={rightStyle}>{isReady && right}</View>
    </View>
  );
}

Layout.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  isReady: PropTypes.bool,
  left: PropTypes.element,
  right: PropTypes.element,
};

Layout.defaultProps = {
  isReady: false,
  left: null,
  right: null,
};

export default Layout;
