import React, { useCallback, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import DamageImage from '../DamageImage';
import useImageDamage from '../../hooks/useDamageImage';
import useDamageHighlightEvents from './hooks/useDamageHighlightEvents';

function DamageHighlight({ backgroundOpacity, image, polygons, polygonsProps, touchable, width }) {
  const {
    state: { width: imageWidth, height: imageHeight },
    getSvgRatio,
  } = useImageDamage(image, width);

  const [ratioX, ratioY] = getSvgRatio;

  const {
    handleDrag,
    handlePress,
    position,
    zoom,
    showPolygon,
    color,
    getColor,
  } = useDamageHighlightEvents({ image, touchable, ratioX, ratioY });

  const handleMouseUp = useCallback((e) => handlePress(e, 'up'), [handlePress]);
  const handleMouseDown = useCallback((e) => handlePress(e, 'down'), [handlePress]);

  const polygon = useMemo(() => (
    polygons.map((p, index) => (
      <Polygon
        key={`${image.id}-polygon-${String(index)}`}
        points={p.map((card) => `${(card[0])},${(card[1])}`).join(' ')}
        stroke={color}
        fillOpacity={0} // On the web, by default it is fill in black
        strokeWidth={Math.max(polygonsProps.stroke.strokeWidth, image.width * 0.0005)}
      />
    ))
  ), [color, polygons, image.id, image.width, polygonsProps.stroke]);

  useEffect(() => {
    getColor();
  }, [getColor]);

  if (!image) {
    return <View />;
  }

  if (isEmpty(polygons)) {
    return (
      <Svg
        width={imageWidth}
        height={imageHeight}
        onMouseMove={handleDrag}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onTouchMove={handleDrag}
        onTouchEnd={handleMouseUp}
        onTouchStart={handleMouseDown}
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
      onMouseUp={handleMouseUp}
      onMouseDown={handleMouseDown}
      onTouchMove={handleDrag}
      onTouchEnd={handleMouseUp}
      onTouchStart={handleMouseDown}
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
    id: PropTypes.string,
    source: PropTypes.shape({
      uri: PropTypes.string,
    }),
    width: PropTypes.number,
  }),
  polygons: PropTypes.arrayOf(
    PropTypes.arrayOf(
      PropTypes.arrayOf(PropTypes.number),
    ),
  ),
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
export default DamageHighlight;
