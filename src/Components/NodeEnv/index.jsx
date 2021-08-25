import React from 'react';
import PropTypes from 'prop-types';
import { Badge } from 'react-native-paper';

/**
 * Display NODE_ENV value by default.
 * @param title {string}
 * @param value {'development', 'test', 'production'}
 * @param passThroughProps
 * @returns {JSX.Element}
 * @constructor
 */
function NodeEnv({ title, value, ...passThroughProps }) {
  return (
    <Badge title={title} {...passThroughProps}>
      {value}
    </Badge>
  );
}

NodeEnv.propTypes = {
  title: PropTypes.string,
  value: PropTypes.oneOf(['development', 'test', 'production']),
};

NodeEnv.defaultProps = {
  title: 'NODE_ENV',
  value: process.env.NODE_ENV,
};

export default NodeEnv;
