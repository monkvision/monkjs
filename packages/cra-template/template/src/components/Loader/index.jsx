import React from 'react';
import PropTypes from 'prop-types';

const InnerCircle = ({ animated }) => (
  <circle
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
  </circle>
);

InnerCircle.propTypes = {
  animated: PropTypes.bool,
};

InnerCircle.defaultProps = {
  animated: false,
};

/**
 * Display Monk's SVG logo
 * @param animated {bool}
 * @param color {string}
 * @param passThroughProps {object}
 * @returns {JSX.Element}
 * @constructor
 */
function Loader({
  animated,
  color,
  ...passThroughProps
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={100}
      height={100}
      {...passThroughProps}
    >
      <g>
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={12}
          cx="50"
          cy="50"
          r="38"
        />
        <InnerCircle animated={animated} />
      </g>
    </svg>
  );
}

Loader.propTypes = {
  animated: PropTypes.bool,
  color: PropTypes.string,
};

Loader.defaultProps = {
  animated: true,
  color: '#274b9f',
};

export default Loader;
