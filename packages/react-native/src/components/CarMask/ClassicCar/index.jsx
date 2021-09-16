import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import noop from '../../../functions/noop';

import ClassicFrontLeftMask from './FrontLeftMask';
import ClassicFrontMask from './FrontMask';
import ClassicFrontRightMask from './FrontRightMask';
import ClassicLateralFrontLeftMask from './LateralFrontLeftMask';
import ClassicLateralFrontRightMask from './LateralFrontRightMask';
import ClassicLateralRearLeftMask from './LateralRearLeftMask';
import ClassicLateralRearRightMask from './LateralRearRightMask';
import ClassicRearLeftMask from './RearLeftMask';
import ClassicRearRightMask from './RearRightMask';

/**
 * Classic car masks
 * @type {string[]}
 * @sorted {clockwise}
 */
export const CLASSIC_CAR_MASKS = [
  'front',
  'frontRight',
  'lateralFrontRight',
  'lateralRearRight',
  'rearRight',
  'rear',
  'rearLeft',
  'lateralRearLeft',
  'lateralFrontLeft',
  'frontLeft',
];

const mks = CLASSIC_CAR_MASKS;

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
});

/**
 * Display a wheel of car parts
 * @param colors {{}}
 * @param onPress {func}
 * @param parts {{}}
 * @param style {{}}
 * @param passThoughProps
 * @returns {JSX.Element}
 * @constructor
 */
export function ClassicPartsWheel({ colors, onPress, parts, style, ...passThoughProps }) {
  function getColorFor(part) {
    let color = 'transparent';

    if (parts.success.includes(part)) {
      color = colors.success;
    } else if (parts.error.includes(part)) {
      color = colors.error;
    } else if (parts.warning.includes(part)) {
      color = colors.warning;
    } else if (parts.active === part) {
      color = colors.active;
    }

    // Dominance = success > error > warning > active > visited
    return color;
  }

  return (
    <Pressable
      onPress={onPress}
      style={() => [
        styles.root,
        style,
      ]}
      {...passThoughProps}
    >
      <Svg
        fill="none"
        height="125"
        viewBox="0 0 153 153"
        width="125"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Circle cx="76.4939" cy="75.8754" r="54.093" fill={colors.background} />

        <Path
          fill={getColorFor(mks.indexOf('front'))}
          d="M60.671 24.1483C71.5947 20.8068 83.2958 21.0094 94.0973 24.7269L88.6096 40.6719C81.1754 38.1133 73.122 37.9739 65.6036 40.2737L60.671 24.1483Z"
        />

        <Path
          fill={getColorFor(mks.indexOf('frontRight'))}
          d="M94.3041 24.7984C105.091 28.5596 114.409 35.6389 120.925 45.0218L107.074 54.6401C102.59 48.1822 96.1758 43.3098 88.752 40.7211L94.3041 24.7984Z"
        />
        <Path
          fill={getColorFor(mks.indexOf('lateralFrontRight'))}
          d="M120.858 44.9256C127.394 54.2944 130.796 65.4918 130.577 76.913L113.717 76.5895C113.868 68.7287 111.526 61.022 107.028 54.5739L120.858 44.9256Z"
        />
        <Path
          fill={getColorFor(mks.indexOf('lateralRearRight'))}
          d="M130.435 76.7994C130.339 88.2223 126.629 99.3215 119.837 108.506L106.278 98.48C110.953 92.1585 113.506 84.5193 113.573 76.6574L130.435 76.7994Z"
        />
        <Path
          fill={getColorFor(mks.indexOf('rearRight'))}
          d="M119.78 108.582C112.972 117.755 103.435 124.537 92.5354 127.957L87.4879 111.867C94.9897 109.514 101.554 104.846 106.24 98.5324L119.78 108.582Z"
        />

        <Path
          fill={getColorFor(mks.indexOf('rear'))}
          d="M92.9153 127.836C82.0412 131.335 70.3384 131.303 59.4841 127.742L64.74 111.719C72.2106 114.17 80.2652 114.192 87.7494 111.784L92.9153 127.836Z"
        />

        <Path
          fill={getColorFor(mks.indexOf('rearLeft'))}
          d="M59.392 127.712C48.5441 124.132 39.108 117.21 32.4361 107.937L46.124 98.0883C50.716 104.47 57.2104 109.234 64.6766 111.698L59.392 127.712Z"
        />
        <Path
          fill={getColorFor(mks.indexOf('lateralRearLeft'))}
          d="M32.5397 108.081C25.8375 98.8301 22.2359 87.6952 22.2511 76.2719L39.114 76.2943C39.1036 84.1565 41.5824 91.8202 46.1952 98.187L32.5397 108.081Z"
        />
        <Path
          fill={getColorFor(mks.indexOf('lateralFrontLeft'))}
          d="M22.2514 76.15C22.2924 64.7268 25.9486 53.6097 32.6961 44.3922L46.3029 54.3528C41.6589 60.6969 39.1424 68.3483 39.1143 76.2104L22.2514 76.15Z"
        />
        <Path
          fill={getColorFor(mks.indexOf('frontLeft'))}
          d="M32.9767 44.0123C39.8045 34.854 49.3563 28.0924 60.2632 24.6965L65.2762 40.797C57.7694 43.1343 51.1953 47.7881 46.496 54.0913L32.9767 44.0123Z"
        />

        <Path
          d="M89.4763 87.6214V71.7026C84.778 78.7502 85.9732 86.488 87.158 89.476L89.4763 87.6214Z"
          stroke="#000"
          strokeWidth="0.927308"
        />
        <Path
          d="M86.3852 92.4125H66.6027V98.9037C67.7154 101.747 73.6605 102.458 76.4939 102.458C82.9233 102.706 85.767 100.192 86.3852 98.9037V92.4125Z"
          stroke="#000"
          strokeWidth="0.927308"
        />
        <Path
          d="M84.2358 48.239C86.6557 49.416 89.1018 51.2575 91.4996 53.952L91.5898 55.1884M84.2358 48.239C83.8837 50.4009 84.8616 54.8175 91.5898 55.1884M84.2358 48.239C78.5713 45.4837 73.0501 46.3696 68.6262 48.4788M91.5898 55.1884L92.5815 68.7889C93.921 68.7889 96.6617 69.3762 96.9089 71.7254C96.8059 72.3436 95.8889 73.3327 93.0452 72.3436V94.599C93.2512 97.8961 91.8088 104.676 84.3903 105.418C80.475 105.727 72.0263 105.727 68.4715 105.418C65.226 104.954 59.693 103.378 59.8166 94.599L60.1258 72.3436C58.5802 73.1164 55.551 73.92 55.7983 70.9526C56.0044 70.2314 57.1583 68.8198 60.1258 68.9435L61.163 54.5702M68.6262 48.4788C65.4875 49.9753 62.9011 52.0875 61.2076 53.952L61.163 54.5702M68.6262 48.4788C68.8539 50.7153 67.6802 55.0647 61.163 54.5702M66.4624 66.4707C69.7595 64.0494 78.332 60.6595 86.245 66.4707C85.9874 68.3768 85.225 72.3745 84.2358 73.1164H68.6262C67.9049 71.9315 66.4624 68.9435 66.4624 66.4707ZM63.526 71.7254C65.5866 74.1982 68.9353 81.2149 65.8442 89.4988L63.526 87.6442V71.7254Z"
          stroke="#000"
          strokeWidth="0.927308"
        />
      </Svg>
    </Pressable>
  );
}

ClassicPartsWheel.propTypes = {
  colors: PropTypes.shape({
    active: PropTypes.string,
    background: PropTypes.string,
    error: PropTypes.string,
    success: PropTypes.string,
    warning: PropTypes.string,
  }),
  onPress: PropTypes.func,
  parts: PropTypes.shape({
    active: PropTypes.number,
    error: PropTypes.arrayOf(PropTypes.number),
    success: PropTypes.arrayOf(PropTypes.number),
    warning: PropTypes.arrayOf(PropTypes.number),
  }),
  // https://github.com/GeekyAnts/NativeBase/issues/3264
  // eslint-disable-next-line react/forbid-prop-types
  style: PropTypes.any, // ViewPropTypes.style,
};

ClassicPartsWheel.defaultProps = {
  colors: {
    active: '#274b9f',
    background: '#ffffff',
    error: '#dfbbbb',
    success: '#c9dfbb',
    warning: '#dfcabb',
  },
  onPress: noop,
  parts: {
    active: 0,
    error: [],
    success: [],
    warning: [],
  },
  style: {},
};

const ClassicCarMasks = {
  front: ClassicFrontMask,
  frontRight: ClassicFrontRightMask,
  lateralFrontRight: ClassicLateralFrontRightMask,
  lateralRearRight: ClassicLateralRearRightMask,
  rearRight: ClassicRearRightMask,
  rear: ClassicRearRightMask,
  rearLeft: ClassicRearLeftMask,
  lateralRearLeft: ClassicLateralRearLeftMask,
  lateralFrontLeft: ClassicLateralFrontLeftMask,
  frontLeft: ClassicFrontLeftMask,
};

export default ClassicCarMasks;
