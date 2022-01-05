import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const damagePicturesPropType = PropTypes.arrayOf(PropTypes.shape({
  Base64: PropTypes.string,
  exif: PropTypes.shape({
    aspectRatio: PropTypes.number,
    deviceId: PropTypes.string,
    frameRate: PropTypes.number,
    groupId: PropTypes.string,
    height: PropTypes.number,
    resizeMode: PropTypes.string,
    width: PropTypes.number,
  }),
  height: PropTypes.number,
  uri: PropTypes.string,
  width: PropTypes.number,
}));
