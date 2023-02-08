import React from 'react';
import PropTypes from 'prop-types';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';

import useOrientation from '../../hooks/useOrientation';

const SIDE = 116;
export const SIDE_WIDTH = SIDE;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  portrait: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  section: {
    alignItems: 'center',
  },
  sectionPortrait: {
    transform: [{ rotate: '0deg' }],
    alignSelf: 'center',
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
    transform: [],
  },
  rightPortrait: {
    transform: [{ rotate: '270deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'flex-start',
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
    fontWeight: '500',
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 20,
    marginVertical: 2,
  },
  p: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 14,
    marginVertical: 2,
  },
});

function PortraitLayout({ backgroundColor, children, left, right }) {
  useOrientation('landscape');
  const { height, width } = useWindowDimensions();

  const containerStyle = StyleSheet.compose(
    styles.container,
    styles.portrait,
  );

  const sectionStyle = StyleSheet.compose(
    styles.section,
    styles.sectionPortrait,
  );

  const sideStyle = StyleSheet.compose(
    styles.side,
    styles.sidePortrait,
  );

  const leftStyle = StyleSheet.compose(
    [sectionStyle, sideStyle, { // height: isPortrait ? width : height,
      width: SIDE,
    }],
    styles.leftPortrait,
  );

  const rightStyle = StyleSheet.compose(
    [sectionStyle, sideStyle, {
      height: width - 155,
      width: SIDE,
    }, { position: 'static' }],
    [styles.rightPortrait,
    ],
  );

  return (
    <View
      accessibilityLabel="Layout"
      style={[
        { height, width },
        containerStyle,
        { backgroundColor },
      ]}
    >
      <View accessibilityLabel="Side left" style={leftStyle}>{left}</View>
      <View
        accessibilityLabel="Center"
        style={[sectionStyle, styles.center, { width, height: height / 2 }]}
      >
        {children}
      </View>
      <View accessibilityLabel="Side right" style={rightStyle}>{right}</View>
    </View>
  );
}

PortraitLayout.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  left: PropTypes.element,
  right: PropTypes.element,
};

PortraitLayout.defaultProps = {
  left: null,
  right: null,
};

export default PortraitLayout;
