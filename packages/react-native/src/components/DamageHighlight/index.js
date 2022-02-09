import React, { useCallback, useMemo, useState } from 'react';
import { Platform, View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import DamageImage from '../DamageImage';
import useImageDamage from '../../hooks/useDamageImage';

const DELAY_TAP = 500;

export default function DamageHighlight({
  backgroundOpacity,
  image,
  polygons,
  polygonsProps,
  touchable,
  width,
}) {
  const {
    state: {
      width: imageWidth,
      height: imageHeight,
    },
    getSvgRatio,
  } = useImageDamage(image, width);
  const [press, setPress] = useState(false);
  const [showPolygon, setShowPolygon] = useState(true);
  const [lastPress, setLastPress] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const [RATIO_X, RATIO_Y] = getSvgRatio;

  const handlePress = useCallback(
    (e, type) => {
      if (touchable) {
        if (type === 'up') {
          setPress(false);
          setShowPolygon(true);
          const now = Date.now();
          if (lastPress && now - lastPress < DELAY_TAP) {
            setZoom((prevState) => (prevState === 1 ? 0.35 : 1));
            if (zoom === 1) {
              const {
                x,
                y,
              } = Platform.select({
                native: {
                  x: e.nativeEvent.locationX,
                  y: e.nativeEvent.locationY,
                },
                default: {
                  x: e.nativeEvent.layerX,
                  y: e.nativeEvent.layerY,
                },
              });
              setPosition({
                x: (x - 100) * RATIO_X,
                y: (y - 100) * RATIO_Y,
              });
            } else {
              setPosition({
                x: 0,
                y: 0,
              });
            }
          } else {
            setLastPress(now);
          }
        }
        if (type === 'down') {
          setPress(true);
          setShowPolygon(false);
        }
      }
    },
    [touchable, lastPress, zoom, RATIO_X, RATIO_Y],
  );

  const handleDrag = useCallback(
    (e) => {
      if (!press || !touchable) {
        return;
      }
      const {
        x,
        y,
      } = Platform.select({
        native: {
          x: e.nativeEvent.locationX,
          y: e.nativeEvent.locationY,
        },
        default: {
          x: e.nativeEvent.layerX,
          y: e.nativeEvent.layerY,
        },
      });
      setPosition((prevstate) => (Platform.select({
        default: {
          x: prevstate.x - x * (e.movementX / 100),
          y: prevstate.y - y * (e.movementY / 100),
        },
        native: {
          x: prevstate.x + (x * ((x - prevstate.x) / 500)),
          y: prevstate.y + (y * ((y - prevstate.y) / 500)),
        },
      })));
    },
    [press, touchable],
  );

  const polygon = useMemo(() => (
    polygons.map((p, index) => (
      <Polygon
        key={`${image.id}-polygon-${String(index)}`}
        points={p.map((card) => `${(card[0])},${(card[1])}`)
          .join(' ')}
        stroke={polygonsProps.stroke.color}
        fillOpacity={0} // On the web, by default it is fill in black
        strokeWidth={Math.max(polygonsProps.stroke.strokeWidth, image.width * 0.0005)}
      />
    ))
  ), [polygons, image.id, image.width, polygonsProps.stroke]);

  if (!image) {
    return <View />;
  }

  if (isEmpty(polygons)) {
    return (
      <Svg
        width={imageWidth}
        height={imageHeight}
        onMouseMove={handleDrag}
        onMouseUp={(e) => handlePress(e, 'up')}
        onMouseDown={(e) => handlePress(e, 'down')}
        onTouchMove={handleDrag}
        onTouchEnd={(e) => handlePress(e, 'up')}
        onTouchStart={(e) => handlePress(e, 'down')}
        viewBox={`${position.x} ${position.y} ${image.width * zoom} ${image.height * zoom}`}
      >
        <DamageImage name={image.id} source={image.source} />
      </Svg>
    );
  }

  return (
    <Svg
      width={imageWidth}
      height={imageHeight}
      onMouseMove={handleDrag}
      onMouseUp={(e) => handlePress(e, 'up')}
      onMouseDown={(e) => handlePress(e, 'down')}
      onTouchMove={handleDrag}
      onTouchEnd={(e) => handlePress(e, 'up')}
      onTouchStart={(e) => handlePress(e, 'down')}
      viewBox={`${position.x} ${position.y} ${image.width * zoom} ${image.height * zoom}`}
    >
      <Defs>
        <ClipPath id={`clip${image.id}`}>{polygon}</ClipPath>
      </Defs>
      {/* Show background image with a low opacity */}
      <DamageImage
        name={image.id}
        source={image.source}
        opacity={showPolygon ? backgroundOpacity : 1}
      />
      {showPolygon && (
        <>
          {/* Show Damages Polygon */}
          <DamageImage name={image.id} source={image.source} clip opacity={polygonsProps.opacity} />
          {polygon}
        </>
      )}
    </Svg>
  );
}

DamageHighlight.propTypes = {
  backgroundOpacity: PropTypes.number,
  height: PropTypes.number,
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size of the image
  }),
  polygons: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number),
    ),
  ), // [[[0, 0], [1, 0], [0, 1]], [[2, 0], [1, 1], [0, 2]]]
  polygonsProps: PropTypes.shape({
    opacity: PropTypes.number,
    stroke: PropTypes.shape({
      color: PropTypes.string,
      strokeWidth: PropTypes.number,
    }),
  }),
  touchable: PropTypes.bool,
  width: PropTypes.number,
};

DamageHighlight.defaultProps = {
  backgroundOpacity: 0.35,
  height: 300,
  image: null,
  polygons: [],
  polygonsProps: {
    opacity: 1,
    stroke: {
      color: 'yellow',
      strokeWidth: 2.5,
    },
  },
  touchable: false,
  width: 400,
};
