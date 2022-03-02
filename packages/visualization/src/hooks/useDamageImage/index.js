import { useCallback, useMemo, useState } from 'react';
import { Dimensions, Platform } from 'react-native';
import PropTypes from 'prop-types';

export default function useImageDamage(image, originalWidth) {
  const computedHeight = image.height * (originalWidth / image.width);
  const isOversize = Dimensions.get('window').width <= originalWidth || Dimensions.get('window').height <= computedHeight;
  const ratio = isOversize ? Math.min((Dimensions.get('window').width * 0.9) / originalWidth, (Dimensions.get('window').height * 0.9) / computedHeight) : 1;
  const width = originalWidth * ratio;
  const height = computedHeight * ratio;

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

  const imageToBase64 = async (img) => {
    const response = await fetch(img.source.uri);
    const buffer = await response.arrayBuffer();

    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    const binary = bytes.reduce((prev, curr, i) => (
      (i < len) ? prev + String.fromCharCode(curr) : prev
    ), '');
    return `data:image/png;base64,${window.btoa(binary)}`;
  };

  const svgToPngWeb = async (img, w, h, id, callback) => {
    const serialize = new XMLSerializer().serializeToString(document.getElementById(`svg-${id}`));
    const b64 = await imageToBase64(img);
    const hrefReg = /href=(["'])(?:(?=(\\?))\2.)*?\1/g;
    const widthReg = /width=(["'])(?:(?=(\\?))\2.)*?\1/;
    const heightReg = /height=(["'])(?:(?=(\\?))\2.)*?\1/;
    const svgSerialized = serialize.replaceAll(hrefReg, `href="${b64}"`).replace(widthReg, `width="${img.width}"`).replace(heightReg, `height="${img.height}"`);
    const imgSrc = (`data:image/svg+xml;base64,${window.btoa(svgSerialized)}`);
    const imageHtml = new Image();

    imageHtml.crossOrigin = 'anonymous';

    imageHtml.onerror = () => {
      console.error('Picture could not load');
    };

    imageHtml.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const context = canvas.getContext('2d');
      context.drawImage(imageHtml, 0, 0);
      const t = canvas.toDataURL('image/png');
      // Call the callback with the png picture
      callback(t, id);
    };

    imageHtml.src = imgSrc;
  };

  const svgToPngNative = (ref, w, h, callback, id) => {
    if (ref) {
      ref?.toDataURL(
        (base64) => callback(`data:image/png;base64,${base64}`, id),
        { width: w, height: h },
      );
    }
  };

  const svgToPng = Platform.select({
    web: svgToPngWeb,
    native: svgToPngNative,
  });

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
