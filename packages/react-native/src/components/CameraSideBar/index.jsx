import PropTypes from 'prop-types';
import React from 'react';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    height: '100%',
    width: 125,
  },
});

/**
 * @param camera {{ ref, ready: bool }}
 * @param Component {func}
 * @param containerProps {object}
 * @returns {JSX.Element}
 * @constructor
 */
function CameraSideBar({
  camera,
  Component,
  containerProps: { style: containerStyle, ...rest },
}) {
  return (
    <View style={[styles.root, containerStyle]} {...rest}>
      <Component camera={camera} />
    </View>
  );
}

export default CameraSideBar;

CameraSideBar.propTypes = {
  camera: PropTypes.shape({
    ready: PropTypes.bool,
    ref: PropTypes.shape({
      takePictureAsync: PropTypes.func,
    }),
  }).isRequired,
  Component: PropTypes.func.isRequired,
  containerProps: PropTypes.objectOf(PropTypes.any),
};

CameraSideBar.defaultProps = {
  containerProps: {},
};
