import React from 'react';

import Svg, {
  Mask,
  Path,
  Circle,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import propTypes from '../propTypes';
import pictureSide from './pictureSide';

/**
 * A component to represents sights, in different states, around a vehicle.
 *
 * @param activeSight {{}}
 *    the (optional) id of a sight whose section will get style with the 'active'
 * @param children {node}
 *    the center of the wheel, would typically contain a vehicle
 * @param filledSightIds {[string]}
 *    an array of sight ids, each sight whose id is included
 *    get the applied the 'filled' style from style (other sections get the 'empty' style)
 * @param sights {[{}]}
 *    the ordered array of Sights to represent,
 *    each sight will be represented by a section around the wheel
 * @param theme {{ colors: { accent: string, primary: string }}}
 *    the ordered array of Sights to represent,
 *    each sight will be represented by a section around the wheel
 * @returns {JSX.Element}
 * @constructor
 */
function SightsWheel({ activeSight }) {
  const currentSight = activeSight.id;
  return (
    <Svg
      width="125"
      height="125"
      viewBox="0 0 99 99"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Mask id="a" fill="#fff">
        <Path d="M74.429 24.93c13.57 13.767 13.409 35.929-.36 49.499-13.767 13.57-35.929 13.409-49.499-.36C11 60.303 11.161 38.14 24.93 24.57c13.767-13.57 35.929-13.409 49.499.36zm-49.61 48.894c13.435 13.63 35.375 13.79 49.005.355 13.63-13.434 13.79-35.374.355-49.004-13.434-13.63-35.374-13.79-49.004-.355-13.63 13.434-13.79 35.374-.355 49.004z" />
      </Mask>
      <Path
        d="M74.429 24.93c13.57 13.767 13.409 35.929-.36 49.499-13.767 13.57-35.929 13.409-49.499-.36C11 60.303 11.161 38.14 24.93 24.57c13.767-13.57 35.929-13.409 49.499.36zm-49.61 48.894c13.435 13.63 35.375 13.79 49.005.355 13.63-13.434 13.79-35.374.355-49.004-13.434-13.63-35.374-13.79-49.004-.355-13.63 13.434-13.79 35.374-.355 49.004z"
        stroke="#fff"
        strokeWidth={1.98}
        mask="url(#a)"
      />
      <Circle {...pictureSide[currentSight].circle} fill="#7AF7FF" />
      <Path
        {...pictureSide[currentSight].path}
        fill="url(#paint0_linear_1982_47111)"
      />
      <Path
        d="M40.82 60.341c0 .356.16 1.107.8 1.267m0 0h3.933m-3.934 0v2m3.934-2v2m0-2c.177-.311.466-1.067.2-1.6m-.2 3.6v2m0-2h-3.934m0 0v2m16.4-5.533c.2.6-.185 1.44-.825 1.6m0 0h-3.933m3.933 0v2m-3.933-2v2m0-2c-.178-.311-.442-1.134-.175-1.667m.175 3.667v2m0-2h3.933m0 0v2m-9.708-5.667v5.667m3.733-5.734v5.667m1.934 2.266v-1.266h3.533v1.266m-14.667 0v-1.266h3.667v1.266m2.066 0v-.933h3.134v.933m-9.733-2.2H58.02M40.477 43.98l.733 1.267m0 0h4.6m-4.6 0l.133 2.133m4.467-2.134l.8-1.266m-.8 1.267l-.133 2.133m-4.334 0l.134 2.133m-.134-2.133h4.334m0 0l-.134 2.133m-4.133 2.8v-1.667h3.933v1.667m7.133-8.333l.734 1.266m0 0h4.6m-4.6 0l.133 2.134m4.467-2.134l.8-1.266m-.8 1.266l-.134 2.134m-4.333 0l.133 2.133m-.133-2.133h4.333m0 0l-.133 2.133m-4.134 2.8v-1.667h3.934v1.667M40.534 26.274c.111-1.133 1.187-3.32 4.6-3v1.4c-1.378.534-4.227 1.6-4.6 1.6zm17-.035c-.11-1.133-1.186-3.32-4.6-3v1.4c1.378.533 4.227 1.6 4.6 1.6zm-9.6 5.569v.733H50.8v-.733h-2.866zm-7.334.066l.867 1.4H45.4v-1.4h-4.8zm17.6-.066l-.867 1.4H53.4v-1.4h4.8zM47.934 38.74l.866 1.934h1.334l.733-1.934h.533l-.8 2.134v6.4h-2.466v-6.6L47.4 38.74h.534zm3.6 1.933H58v-1.466h-6.133l-.333 1.466zM41.2 39.141c.156.356.88 1.067 2.533 1.067.49-.023 1.707-.227 2.667-.867h.467v1.333h-6v-1.533h.333zm-.067-.667H40.6c.133-.8.547-2.56 1.133-3.2 2.49-1.067 8.987-2.56 15.067 0a12.43 12.43 0 011.133 3.2H46.467c-.245-.378-1.134-1.133-2.734-1.133-.689-.022-2.173.173-2.6 1.133zm4.8.267c0 .515-.985.933-2.2.933-1.215 0-2.2-.418-2.2-.933 0-.516.985-.933 2.2-.933 1.215 0 2.2.417 2.2.933zm-1.732-16.2c.289-.422 1.16-1.294 2.333-1.4h5.2c.6.178 1.853.707 2.067 1.4 1.333.022 4.227 1.107 5.133 5.267.134 1.288.414 5.093.467 10 .711-.067 2.187.16 2.4 1.6l-2.4-.534v37.8c-3.711 1.334-13 3.2-20.467 0l-.333-37.8-2.4.867c-.022-.533.426-1.747 2.4-2.333.022-2.912.147-8.907.467-9.6.266-1.6 1.666-4.894 5.133-5.267zm-5.6 18.733L35 49.141h.733l2.334-2.733.533-3.267v-1.867zM59.4 40.208l3.6 7.867h-.733l-2.334-2.734-.533-3.267v-1.866zm0 12.533l3.6 7.867h-.733l-2.334-2.733-.533-3.267V52.74zm-20.8.933L35 61.541h.733l2.334-2.733.533-3.267v-1.867zm1.933 22.2c2.578 1.09 9.707 2.614 17.6 0v.8c-3.422.956-11.733 2.294-17.6 0v-.8zm-.132-3.133h17.533v2.333c-3.178.956-11.133 2.294-17.533 0v-2.333zm1.618-4.866h-1.933c-.244-.422-.373-1.454 1.067-2.2-.89-1.111-2.134-3.8 0-5.667h16.8c.666.867 1.6 3.213 0 5.667.444.555 1.2 1.773.666 2.2h-1.933c-.511.733-1.933 1.76-3.533 0h-2.267c-.444.6-1.693 1.44-3.133 0h-2.067c-.467.733-1.853 1.76-3.667 0zm-1.543-18.296h6.067c.645-1.31 1.547-4.266 0-5.6-.844-.733-3.24-1.76-6.067 0-.71.667-1.706 2.72 0 5.6zm-.2.334h6.6c.312.533.747 1.76 0 2.4h-1.6c-.577.578-2.146 1.387-3.8 0h-1.533c-.289-.245-.626-1.067.334-2.4zm.324 3.761h6.8v2.2c-.045.222-.307.667-1 .667h-4.8c-.222.044-.733-.027-1-.667v-2.2zm11.876-4.095h6.067c.644-1.31 1.546-4.266 0-5.6-.845-.733-3.24-1.76-6.067 0-.711.667-1.707 2.72 0 5.6zm-.2.334h6.6c.311.533.747 1.76 0 2.4h-1.6c-.578.578-2.147 1.386-3.8 0h-1.533c-.29-.245-.627-1.067.333-2.4zm-.343 3.761h6.8v2.2c-.044.222-.306.667-1 .667h-4.8c-.222.044-.733-.027-1-.667v-2.2z"
        stroke="#fff"
        strokeWidth={0.25}
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_1982_47111"
          {...pictureSide[currentSight].linearGradient}
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#7AF7FF" />
          <Stop offset={1} stopColor="#7AEFFF" stopOpacity={0} />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

SightsWheel.propTypes = {
  activeSight: propTypes.sight.isRequired,
};

export default SightsWheel;
