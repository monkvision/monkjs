import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Polygon, Path, Line, Polyline } from 'react-native-svg';

const styles = StyleSheet.create({
  root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
});

function ClassicFrontMask({ color, style, styleProps }) {
  // eslint-disable-next-line no-param-reassign
  styleProps.cls3.stroke = color;

  return (
    <Svg
      id="ClassicFrontMask"
      data-name="ClassicFrontMask"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1368 1026"
      style={[styles.root, style]}
    >
      <Rect {...styleProps.cls1} width="1368" height="1026" />
      <Rect {...styleProps.cls2} x="245" y="139" width="878" height="748" />
      <Polyline
        {...styleProps.cls3}
        points="312.5 479.81 346.34 506.39 457.53 557.15 476.87 593.41 459.95 615.16 308.39 587.78 290.75 566.82"
      />
      <Polyline
        {...styleProps.cls3}
        points="1041.75 477.78 1003.79 506.39 892.61 557.15 873.27 593.41 890.19 615.16 1041.75 587.78 1064.22 561.99"
      />
      <Rect {...styleProps.cls3} x="556.63" y="687.67" width="239.55" height="52.38" />
      <Path {...styleProps.cls3} d="M873.27,593.41" />
      <Path {...styleProps.cls3} d="M476.87,593.41" />
      <Line {...styleProps.cls3} x1="459.95" y1="615.16" x2="556.63" y2="687.67" />
      <Line {...styleProps.cls3} x1="890.19" y1="615.16" x2="796.19" y2="687.67" />
      <Path {...styleProps.cls3} d="M418.31,607.64" />
      <Path {...styleProps.cls3} d="M430.94,670.76" />
      <Polyline
        {...styleProps.cls3}
        points="363.26 361.37 450.28 182.5 508.29 141.83 843.19 141.83 902.28 177.67 996.54 363.78"
      />
      <Polygon
        {...styleProps.cls3}
        points="396.46 385.54 967.54 385.54 899.86 201.84 459.95 201.84 396.46 385.54"
      />
      <Path {...styleProps.cls3} d="M1092.24,363.78" />
      <Path {...styleProps.cls3} d="M1094.62,363.78" />
      <Path {...styleProps.cls3} d="M1097.53,363.78" />
      <Polyline
        {...styleProps.cls3}
        points="290.75 708.33 290.75 863.33 308.39 884.17 392.83 884.17 404.35 861.71 404.35 830.24"
      />
      <Polyline
        {...styleProps.cls3}
        points="1064.22 708.33 1064.22 863.33 1046.59 884.17 962.14 884.17 950.62 861.71 950.62 830.24"
      />
      <Path {...styleProps.cls3} d="M375.35,368.62" />
      <Polyline {...styleProps.cls3} points="375.35 369.56 356.01 361.37 356.01 335.34 346.34 325.11 293.17 327.53 270.47 347.34 270.47 367.07 288.33 380.7 343.93 390.37 290.75 532.98 290.75 704.25 305.25 781.94 363.26 827.87 1009.34 827.87 1054.55 781.94 1064.22 704.6 1064.22 524.33 1006.21 392.79 1078.72 371.94 1078.72 339.61 1064.22 325.03 1015.88 322.69 1001.38 339.61 1006.21 361.37 977.21 368.62" />
    </Svg>
  );
}

ClassicFrontMask.propTypes = {
  color: PropTypes.string,
  // https://github.com/GeekyAnts/NativeBase/issues/3264
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.any, // ViewPropTypes.style,
  styleProps: PropTypes.shape({
    cls1: PropTypes.shape({
      fill: PropTypes.string,
    }),
    cls2: PropTypes.shape({
      fill: PropTypes.string,
    }),
    cls3: PropTypes.shape({
      fill: PropTypes.string,
      stroke: PropTypes.string,
      strokeMiterlimit: PropTypes.number,
      strokeWidth: PropTypes.number,
    }),
  }),
};

ClassicFrontMask.defaultProps = {
  color: '#000',
  style: {},
  styleProps: {
    cls1: {
      fill: 'transparent',
    },
    cls2: {
      fill: 'transparent',
    },
    cls3: {
      fill: 'none',
      strokeMiterlimit: 10,
      strokeWidth: 6,
    },
  },
};

export default ClassicFrontMask;
