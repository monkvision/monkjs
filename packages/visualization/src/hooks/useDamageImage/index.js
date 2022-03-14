import { useCallback, useMemo, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import PropTypes from 'prop-types';

export default function useImageDamage(image, renderWidth) {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const renderHeight = image.height * (renderWidth / image.width);

  const isOversize = windowWidth <= renderWidth || windowHeight <= renderHeight;
  const ratio = isOversize
    ? Math.min((windowWidth * 0.9) / renderWidth, (windowHeight * 0.9) / renderHeight)
    : 1;

  const width = renderWidth * ratio;
  const height = renderHeight * ratio;

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
    if (location) {
      const [ORATIO_X, ORATIO_Y] = getOriginalRatio;

      return {
        cx: location.cx * ORATIO_X,
        cy: location.cy * ORATIO_Y,
        rx: updatedWidth * ORATIO_X,
        ry: updatedHeight * ORATIO_Y,
      };
    }
    return null;
  }, [getOriginalRatio, location]);

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
    svgToPng,
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
