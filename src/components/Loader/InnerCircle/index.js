import React from 'react';
import PropTypes from 'prop-types';
import { Circle } from 'react-native-svg';

export default function InnerCircle({ animated }) {
  return (
    <Circle
      fill="#000"
      cx="0"
      cy="0"
      r="10"
      transform="translate(50 50)"
    >
      <animateTransform
        attributeName="transform"
        type="scale"
        additive="sum"
        begin="0s"
        dur="1.5s"
        repeatCount="indefinite"
        calcMode="spline"
        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
        values={`1; ${animated ? 3 : 1}; 1`}
      />
    </Circle>
  );
}

InnerCircle.propTypes = {
  animated: PropTypes.bool,
};

InnerCircle.defaultProps = {
  animated: false,
};
