import React from 'react';
import PropTypes from 'prop-types';
import { View, Platform, StyleSheet/* , ViewPropTypes */ } from 'react-native';

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'space-around',
    width: '100%',
    ...Platform.select({
      native: { minWidth: 75 },
      default: { minWidth: 100 },
    }),
  },
});

// Inspection doesn't like ViewPropTypes
// noinspection JSValidateJSDoc
/**
 * @param children {node}
 * @param style {ViewPropTypes.style}
 * @param passThroughProps
 * @returns {JSX.Element}
 * @constructor
 */
function CameraSideBar({ children, style, ...passThroughProps }) {
  return (
    <View style={[styles.root, style]} {...passThroughProps}>
      {children}
    </View>
  );
}

CameraSideBar.propTypes = {
  children: PropTypes.node,
  // https://github.com/GeekyAnts/NativeBase/issues/3264
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.any, // ViewPropTypes.style,
};

CameraSideBar.defaultProps = {
  children: null,
  style: {},
};

export default CameraSideBar;
