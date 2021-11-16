import PropTypes from 'prop-types';

const errorMessage = (propFullName, componentName) => `
  Invalid prop \`${propFullName}\` supplied to \`${componentName}\`.
`;

export const Listeners = PropTypes.exact({
  onError: PropTypes.func,
  onStart: PropTypes.func,
  onSuccess: PropTypes.func,
});

export const Sight = (propValue, key, componentName, location, propFullName) => {
  const keys = ['id', 'poz', 'label', 'flags'];

  switch (keys[key]) {
    case 'id':
      if (typeof propValue[key] !== 'string') {
        const msg = '1st arg `id` must be of type `string`.';
        return new Error(errorMessage(propFullName, componentName) + msg);
      }
      break;
    case 'poz':
      if (!Array.isArray(propValue[key])) {
        const msg = '2nd arg `poz` must be of type `Array[number]`.';
        return new Error(errorMessage(propFullName, componentName) + msg);
      }
      if (propValue[key].length !== 3) {
        const msg = '2nd arg `poz` must be of length `3`.';
        return new Error(errorMessage(propFullName, componentName) + msg);
      }
      break;
    case 'label':
      if (typeof propValue[key] !== 'string') {
        const msg = '3rd arg `label` must be of type `string`.';
        return new Error(errorMessage(propFullName, componentName) + msg);
      }
      break;
    case 'flags':
      if (!Array.isArray(propValue[key])) {
        const msg = '4th arg `flags` must be of type `Array[string]`.';
        return new Error(errorMessage(propFullName, componentName) + msg);
      }
      break;
    default:
      break;
  }

  return true;
};
