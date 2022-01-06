import { useCallback, useMemo, useState } from 'react';
import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';

export default function useImageDamage(image) {
  const width = Math.min(Dimensions.get('window').width - 50, 400);
  const height = image.height * (width / image.width);

  const [ellipseW, setEllipseW] = useState(null);
  const [ellipseH, setEllipseH] = useState(null);
  const [location, setLocation] = useState(null);
  const [dragX, setDragX] = useState(false);
  const [dragY, setDragY] = useState(false);
  const [dragLocation, setDragLocation] = useState(false);

  const getOriginalRatio = useMemo(() => {
    const RATIO_X = width / image.width;
    const RATIO_Y = height / image.height;

    return [RATIO_X, RATIO_Y];
  }, [image, width, height]);

  const getSvgRatio = useMemo(() => {
    const RATIO_X = image.width / width;
    const RATIO_Y = image.height / height;

    return [RATIO_X, RATIO_Y];
  }, [image, width, height]);

  const saveEllipse = useCallback((updatedWidth, updatedHeight) => {
    const [ORATIO_X, ORATIO_Y] = getOriginalRatio;
    return {
      cx: location.cx * ORATIO_X,
      cy: location.cy * ORATIO_Y,
      rx: updatedWidth * ORATIO_X,
      ry: updatedHeight * ORATIO_Y,
    };
  }, [getOriginalRatio, location.cx, location.cy]);

  return {
    state: {
      width,
      height,
      dragX,
      dragY,
      dragLocation,
      ellipseH,
      ellipseW,
      location,
    },
    setter: {
      setDragX,
      setDragY,
      setDragLocation,
      setEllipseW,
      setEllipseH,
      setLocation,
    },
    getOriginalRatio,
    getSvgRatio,
    saveEllipse,
  };
}

useImageDamage.propTypes = {
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size of the image
  }),
};

useImageDamage.defaultProps = {
  image: null,
};
