import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="502" height="380" fill="none">
    <path stroke="#fff" stroke-linecap="round" stroke-width="3.6365" d="M9.64775 293.451c-2.2223 21.617-3.51528 69.094 9.09125 86.064h57.5779c1.2122-3.232 3.6365-11.637 3.6365-19.395M480.351 293.223c2.223 21.617 3.516 69.093-9.091 86.064h-57.578c-1.212-3.233-3.636-11.637-3.636-19.395M55.4864 119.378c-3.4345-4.849-11.7577-21.3338-10.3031-36.3647-6.869-1.0101-22.7891-1.0909-31.5166 6.6669L8.21191 107.863l5.45479 11.515 24.2433 3.637 6.6669 10.303M434.288 116.247c3.434-4.849 12.97-19.6428 11.515-34.6737 6.869-1.0101 22.789-1.0909 31.517 6.6669l5.454 18.1828-5.454 11.515-24.244 3.637-7.273 11.515M138.52 17.4554c-13.334 10.5319-33.334 25.0779-69.0932 92.1246 55.3552-4.647 190.4312-11.1519 350.9222 0-8.082-17.5764-31.153-60.6083-58.79-92.1246M45.1822 133.446l46.6684 52.123 8.4854 36.365-88.4883-20.607M444.592 134.429l-46.668 52.123-8.485 36.365 88.488-20.607M319.132 264.131H162.763v34.547h156.369v-34.547Z"/>
    <path stroke="#fff" stroke-linecap="round" stroke-width="3.6365" d="M225.189 8.62268c40.425-.08631 86.645 2.19012 134.55 8.83242 15.758 12.3237 52.366 49.699 72.73 100.6099l38.789 41.214c10.506 34.546 23.516 121.216-8.485 191.522-50.446 8.289-142.916 18.522-240.008 18.737"/>
    <path stroke="#fff" stroke-linecap="round" stroke-width="3.6365" d="M232.463 8.59238c-40.425-.08631-54.297 2.22042-102.202 8.86272-15.759 12.3238-52.3659 49.699-72.7303 100.6099l-38.7893 41.214C8.23599 193.825-4.77458 280.495 27.2266 350.801c50.4468 8.289 109.9614 18.802 207.0544 19.017"/>
  </svg>
`;

export default (props) => <SvgXml xml={xml} height="100%" {...props} />;
