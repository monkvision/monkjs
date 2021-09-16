import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Loader from '../Loader';
import isEmpty from '../../functions/isEmpty';

export const AVAILABLE_CARS = [
  'ClassicCar',
];

/**
 * Display an overlay of a car
 * @param activeMask {number}
 * @param carType {AVAILABLE_CARS}
 * @param maskColor {string}
 * @returns {JSX.Element}
 * @constructor
 */
function CarMask({ activeMask, carType, maskColor }) {
  const [masks, setMasks] = useState([]);

  async function getMasks(path) {
    const ClassicCarMask = await import(`./${path}/index.jsx`);
    setMasks(Object.values(ClassicCarMask.default));
  }

  const Component = useMemo(() => masks[activeMask], [activeMask, masks]);

  useEffect(() => {
    getMasks(carType);
  }, [carType]);

  return isEmpty(masks) ? <Loader centered /> : <Component color={maskColor} />;
}

CarMask.propTypes = {
  activeMask: PropTypes.number,
  carType: PropTypes.oneOf(AVAILABLE_CARS),
  maskColor: PropTypes.string,
};

CarMask.defaultProps = {
  activeMask: 0,
  carType: 'ClassicCar',
  maskColor: '#417aff95',
};

export default CarMask;
