import * as React from 'react';
import PropTypes from 'prop-types';

export default function AbstractFrontLateralLeft({ color, ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="502" height="376" fill="none" {...props}>
      <path stroke={color} strokeLinecap="round" strokeWidth="3.32459" d="m98.3817 146.282 31.5833 4.433-71.4784 45.99-49.92985 7.853" />
      <path stroke={color} strokeWidth="3.32459" d="m342.185 124.671 171.217-12.19M514.51 12.7443c-48.392.7388-176.758 26.8183-303.092 125.2267l83.115-7.204" />
      <path stroke={color} strokeWidth="3.32459" d="m296.194 132.984 44.882-6.095c6.649-19.061.554-34.1698-3.324-39.3414h-14.407c-22.607 6.2059-27.52 32.8764-27.151 45.4364Z" />
      <path stroke={color} strokeWidth="3.32459" d="M516.171 0c-49.684 2.21639-184.847 29.0348-328.026 118.577L23.0236 169.554C9.35586 191.349-12.5495 250.896 9.17116 314.728L86.1909 328.58c-6.2798-40.818 1.3298-121.901 82.0061-119.685 26.412.739 81.785 22.94 91.981 105.833h251.561" />
      <circle r="74.2492" stroke={color} strokeWidth="3.32459" transform="matrix(-1 0 0 1 169.859 299.767)" />
      <rect width="57.771" height="9.30912" x="1.60067" y="-1.72172" stroke={color} strokeWidth="3.32459" rx="4.65456" transform="matrix(-.99934 .03641 .03641 .99934 503.811 153.774)" />
    </svg>
  );
}
AbstractFrontLateralLeft.propTypes = {
  color: PropTypes.string,
};
AbstractFrontLateralLeft.defaultProps = {
  color: '#fff',
};
