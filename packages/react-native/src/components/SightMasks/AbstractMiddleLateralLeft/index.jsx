import * as React from 'react';
import PropTypes from 'prop-types';

export default function AbstractMiddleLateralLeft({ color, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="504" height="376" fill="none" {...props}>
      <path stroke={color} strokeLinecap="round" strokeWidth="3.45938" d="m80.3932 138.352 413.3958-25.369c7.495-.577 24.446-3.344 32.287-9.802" />
      <path stroke={color} strokeWidth="3.45938" d="m-1.47921 144.693 36.32341-2.882M295.45 20.7322 274.117 126.243c-9.417 31.327-24.677 104.243-10.378 145.294l-4.612 29.405 9.801 29.981" />
      <path stroke={color} strokeLinecap="round" strokeWidth="3.45938" d="M7.74591 108.946C50.4115 78.9652 167.454 19.0027 294.298 19.0027c39.014-2.4984 141.257-3.9206 238.12 10.3781" />
      <path stroke={color} strokeLinecap="round" strokeWidth="3.45938" d="M522.616 13.2371C441.705 4.01213 255.322-6.366 157.075 25.9215 131.13 32.456 57.9067 58.6705-27.4246 111.253M529.535 225.989c-19.603 5.381-60.424 33.21-66.881 101.475l-465.28627 6.918c-1.72969-16.912-8.30253-52.697-20.75623-60.539" />
      <path stroke={color} strokeWidth="3.45938" d="m83.8516 103.757-5.1891-6.3418c-41.5125 0-45.7406 29.5968-42.6656 44.3958h42.6656l5.1891-12.685v-25.369Z" />
      <rect width="58.7796" height="11.0564" x="1.44522" y="-1.5379" stroke={color} strokeWidth="2.98456" rx="5.52822" transform="matrix(-.99952 .03105 .03105 .99952 249.243 166.924)" />
      <rect width="58.7796" height="11.0564" x="1.44522" y="-1.5379" stroke={color} strokeWidth="2.98456" rx="5.52822" transform="matrix(-.99952 .03105 .03105 .99952 487.826 151.567)" />
      <path stroke={color} strokeLinecap="round" strokeWidth="3.45938" d="M523.77 390.697c-26.351-13.447-44.395-40.845-44.395-72.458 0-32.527 19.102-60.592 46.701-73.589" />
    </svg>
  );
}
AbstractMiddleLateralLeft.propTypes = {
  color: PropTypes.string,
};
AbstractMiddleLateralLeft.defaultProps = {
  color: '#fff',
};
