import PropTypes from 'prop-types';
import React from 'react';
import { SvgIcon } from '@mui/material';

export default function LogoIcon({ innerColor, outerColor, ...passThroughProps }) {
  return (
    <SvgIcon
      width={1024}
      height={1024}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1024 1024"
      {...passThroughProps}
    >
      <g>
        <circle
          stroke={outerColor}
          strokeWidth="124"
          fill="transparent"
          cx="512"
          cy="512"
          r="390"
        />
        <circle
          fill={innerColor}
          cx="512"
          cy="512"
          r="102"
        />
      </g>
    </SvgIcon>
  );
}

LogoIcon.propTypes = {
  innerColor: PropTypes.string,
  outerColor: PropTypes.string,
};

LogoIcon.defaultProps = {
  innerColor: '#000',
  outerColor: '#274b9f',
};
