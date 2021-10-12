import * as React from 'react';
import { SvgXml } from 'react-native-svg';

const xml = `
  <svg xmlns="http://www.w3.org/2000/svg" width="502" height="376" fill="none">
    <path stroke="#fff" stroke-width="3.32868" d="M525 40.1005c-21.082-10.5408-84.993-27.4061-171.982-10.5408l21.636 50.4848c5.733 7.2122 22.857 22.1915 45.492 24.4105L525 112.777M401.834 220.959c-9.801-.37-29.958-1.11-32.177-1.11M401.279 369.639c-10.171 3.699-36.726 7.989-61.58-4.438-6.288-5.548-19.529-21.858-22.191-42.718M244.831 158.268v19.972l-224.1311-3.328v-24.411m11.0956-35.506 8.8765 18.308-4.993 17.198H14.5974M265.913 96.1329l47.711-7.2122 7.767 25.5203-4.993 32.732-36.061 9.986-72.676-2.219v-25.52l58.252-33.2871ZM157.176 269.779l4.993-29.404-88.7649-5.547-4.4382 27.739 88.2101 7.212ZM97.2596 40.6551C119.451 16.2448 243.352 19.7584 302.528 24.5665c7.952 2.404 17.531 15.8667-7.767 50.485-14.239 8.6915-53.702 25.8525-97.641 24.9655L63.973 103.9c-5.7328.555-15.8667-.999-10.5409-11.6504"/>
    <path stroke="#fff" stroke-width="3.32868" d="M525 33.9976C503.178 22.5322 425.805.82177 290.882 5.70383 122.229 11.8064 100.038 19.5732 92.8259 26.7854c.5548 3.3287 2.441 10.8737 5.5478 14.4243-12.9449 12.2051-40.1661 39.7222-45.492 52.1493l-34.9511 33.842-12.75995 88.764 4.99305 13.315-4.99305 7.212c-1.10956 19.418 2.66294 59.14 26.62945 62.69l287.3759 22.192c5.178.924 18.419-8.1 29.958-51.595 0-3.883 11.651-67.128 57.697-69.902 16.829-.37 47.268 17.531 34.397 92.093l82.107-11.095"/>
    <path stroke="#fff" stroke-width="3.32868" d="M360.78 295.299c0 20.767 4.55 39.486 11.824 52.953 7.311 13.533 17.132 21.388 27.565 21.388 10.434 0 20.255-7.855 27.565-21.388 7.275-13.467 11.825-32.186 11.825-52.953 0-20.767-4.55-39.485-11.825-52.952-7.31-13.534-17.131-21.388-27.565-21.388-10.433 0-20.254 7.854-27.565 21.388-7.274 13.467-11.824 32.185-11.824 52.952Z"/>
    <rect width="36.6155" height="11.0956" x="1.70427" y="-1.62343" stroke="#fff" stroke-width="3.32868" rx="5.5478" transform="matrix(-.9997 -.02429 -.02429 .9997 467.893 138.036)"/>
    <path stroke="#fff" stroke-width="3.32868" d="M64.2577 302.511c7.4766 25.019 30.8483 43.273 58.5223 43.273 24.72 0 46.007-14.565 55.599-35.506"/>
  </svg>
`;

export default (props) => <SvgXml xml={xml} height="100%" {...props} />;
