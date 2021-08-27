import PropTypes from 'prop-types';

export function progress(props, propName, componentName) {
  const value = props[propName];

  const notANumber = typeof value !== 'number';
  const notInTheRange = !notANumber && (value < 0 || value > 99);

  if (notANumber || notInTheRange) {
    return new Error(
      `
        Invalid prop \`${propName}\` supplied to\`${componentName}\`.
        It must be a number between 0 and 99 included.
      `,
    );
  }

  return null;
}

export const nodeEnv = PropTypes.oneOf(['development', 'test', 'production']);
