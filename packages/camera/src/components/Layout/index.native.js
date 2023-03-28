import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, useWindowDimensions, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

const SIDE = 116;
export const SIDE_WIDTH = SIDE;

const styles = StyleSheet.create({
  rotate: {
    justifyContent: 'center',
    alignItems: 'center'
  },
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
  title: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 20,
    marginVertical: 2,
  },
});

function Layout({ backgroundColor, children, isReady, left, right }) {
  const { height, width } = useWindowDimensions();
  const { t } = useTranslation();

  const size = StyleSheet.create({ height, width });

  const leftStyle = StyleSheet.compose(
    [size, styles.section, styles.side, { width: SIDE }],
    styles.leftPortrait,
  );

  const rightStyle = StyleSheet.compose(
    [size, styles.section, styles.side, { width: SIDE }],
    styles.rightPortrait,
  );

  if (width > height) {
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
  } else {
    return (
      <View
        accessibilityLabel="Layout"
        style={[
          styles.rotate,
          { width, height, backgroundColor },
        ]}
      >
        <Text style={styles.title}>
            {t('layout.rotateDevice')}
        </Text>
      </View>
    );
  }
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
