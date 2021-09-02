import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    position: 'absolute',
    right: 0,
  },
});

/**
 * @param children
 * @param right
 * @param width
 * @returns {JSX.Element}
 * @constructor
 */
function CameraSideBar({ children, right, width }) {
  return (
    <BlurView
      intensity={80}
      tint="dark"
      style={[styles.root, { right, width }]}
    >
      {children}
    </BlurView>
  );
}

CameraSideBar.propTypes = {
  children: PropTypes.node,
  right: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
  width: PropTypes.number,
};

CameraSideBar.defaultProps = {
  children: null,
  right: false,
  width: 100,
};

export default CameraSideBar;
