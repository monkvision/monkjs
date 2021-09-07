import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import Svg, { Rect, Path, Ellipse, Polyline, Line, Polygon } from 'react-native-svg';

const styles = StyleSheet.create({
  root: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
});

function ClassicFrontLeftMask({ color, style, styleProps }) {
  // eslint-disable-next-line no-param-reassign
  styleProps.cls3.stroke = color;

  return (
    <Svg
      id="ClassicFrontLeftMask"
      data-name="ClassicFrontLeftMask"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1368 1026"
      style={[styles.root, style]}
    >
      <Rect {...styleProps.cls1} width="1368" height="1026" />
      <Rect {...styleProps.cls2} x="245" y="139" width="878" height="748" />
      <Polygon
        {...styleProps.cls3}
        points="793.61 315.36 549.15 302.74 429.29 422.61 732.1 455.73 793.61 315.36"
      />
      <Path
        {...styleProps.cls3}
        d="M1104.31,567.71l17.35-26.82L1113,389.07l-89.11-106.83-47.32-11S719.49,246,553.88,293.28c0,0-112,102.52-129.32,129.33L295.23,471.5l-31.54,37.85-7.89,77.28-9.46,25.24,1.58,41L284.19,686s216.07,44.16,342.24,22.08l22.08-18.92s12.62-130.91,88.32-130.91c0,0,56.78-3.5,36.28,111l235-68.43,9.46-20.51S1027,481,1080.66,477.81C1080.66,477.81,1116.93,473.08,1104.31,567.71Z"
      />
      <Path
        {...styleProps.cls3}
        d="M859,420.69l130.16-32.78,36.27-28.39-48.89-63.08s-105.67,4.73-164,14.19c0,0-52,127.75-55.2,137.21l19.71-5.52"
      />
      <Path {...styleProps.cls3} d="M886.39,302.74s19.2,56.78,23.93,97.79l17.77,26.81V624.13" />
      <Polyline
        {...styleProps.cls3}
        points="1094.95 367.44 1083.81 387.91 1087.63 432.86 1115.96 441.16"
      />
      <Polygon
        {...styleProps.cls3}
        points="437.18 616.6 318.89 600.83 318.89 635.1 437.18 651.96 437.18 616.6"
      />
      <Path {...styleProps.cls3} d="M515.78,542.13" />
      <Path {...styleProps.cls3} d="M519.19,542.47" />
      <Path {...styleProps.cls3} d="M647.21,503.38" />
      <Polygon
        {...styleProps.cls3}
        points="519.19 542.47 519.19 564.55 637.47 555.09 657.98 534.59 647.21 503.38 519.19 542.47"
      />
      <Polyline {...styleProps.cls3} points="261.89 526.97 282.61 539.88 282.61 518.81 272.25 500.7" />
      <Line {...styleProps.cls3} x1="519.19" y1="564.55" x2="437.17" y2="616.6" />
      <Line {...styleProps.cls3} x1="282.61" y1="539.88" x2="318.89" y2="600.83" />
      <Ellipse
        {...styleProps.cls3}
        cx="713.97"
        cy="671.8"
        rx="89.9"
        ry="52.83"
        transform="translate(-11.1 1331.6) rotate(-85.56)"
      />
      <Polyline {...styleProps.cls3} points="707 761.43 653.07 761.43 629.59 739.62 626.43 708.07" />
      <Polyline
        {...styleProps.cls3}
        points="396.15 703.86 378.03 717.61 328.35 717.54 300.75 703.86 292.44 687.6"
      />
      <Ellipse
        {...styleProps.cls3}
        cx="1062.35"
        cy="578.78"
        rx="78.9"
        ry="37.13"
        transform="translate(416.68 1601.86) rotate(-86.33)"
      />
      <Polyline
        {...styleProps.cls3}
        points="1057.3 657.52 1021.98 657.52 1000.22 641.83 989.18 619.75 989.18 606.34"
      />
      <Polyline
        {...styleProps.cls3}
        points="466.84 376.12 455.54 372.14 434.24 379.24 429.29 401.49 437.18 407.01"
      />
      <Path
        {...styleProps.cls3}
        d="M784.94,423.4s-11,0-11,9.46c0,0,0,7.88,9.46,7.88h69.91l10.53-11-7.89-18.92-50.47-11-18.92,12.62Z"
      />
    </Svg>
  );
}

ClassicFrontLeftMask.propTypes = {
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

ClassicFrontLeftMask.defaultProps = {
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

export default ClassicFrontLeftMask;
