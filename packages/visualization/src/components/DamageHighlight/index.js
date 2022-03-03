import React, { useEffect, useMemo } from 'react';
import { Platform, View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg, Text } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import noop from 'lodash.noop';
import DamageImage from '../DamageImage';
import useImageDamage from '../../hooks/useDamageImage';
import useDamageHighlightEvents from './hooks/useDamageHighlightEvents';

function DamageHighlight(
  { backgroundOpacity, image, polygons, polygonsProps, touchable, width, savePng, damage },
) {
  const {
    state: { width: imageWidth, height: imageHeight },
    getSvgRatio,
    svgToPng,
  } = useImageDamage(image, width);

  const [ratioX, ratioY] = getSvgRatio;

  const {
    position,
    zoom,
    showPolygon,
    color,
    getColor,
    measureText,
  } = useDamageHighlightEvents({ image, touchable, ratioX, ratioY });

  const ref = Platform.select({
    native: {
      ref: (svgRef) => {
        svgToPng(svgRef, image.width, image.height, image.id)
          .then((url) => savePng(url, image.id));
      },
    },
  });

  const polygon = useMemo(() => (
    polygons.map((p, index) => (
      <Polygon
        key={`${image.id}-polygon-${String(index)}`}
        points={p.map((card) => `${(card[0])},${(card[1])}`).join(' ')}
        stroke={polygonsProps.stroke.color}
        fillOpacity={0} // On the web, by default it is fill in black
        strokeWidth={Math.max(polygonsProps.stroke.strokeWidth, image.width * 0.0005)}
        strokeDasharray={damage.damageType === 'dent' ? '5, 5' : ''}
      />
    ))
  ), [damage, polygons, image.id, image.width, polygonsProps.stroke]);

  const tagPos = useMemo(() => ({
    x: polygons.reduce((prev, curr) => (
      Math.min(prev, curr.reduce((p, c) => (
        Math.min(p, c[0])), Number.MAX_VALUE))), Number.MAX_VALUE),
    y: polygons.reduce((prev, curr) => (
      Math.min(prev, curr.reduce((p, c) => (
        Math.min(p, c[1])), Number.MAX_VALUE))), Number.MAX_VALUE),
    maxY: polygons.reduce((prev, curr) => (
      Math.max(prev, curr.reduce((p, c) => (
        Math.max(p, c[1])), Number.MIN_VALUE))), Number.MIN_VALUE) + image.height * 0.02,
  }), [image.height, polygons]);

  // useEffect(() => {
  //   getColor();
  // }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      svgToPng(image, image.id).then((url) => {
        savePng(url, image.id);
      });
    }
  }, [image, savePng, svgToPng, color]);

  if (!image) {
    return <View />;
  }

  return (
    <Svg
      {...ref}
      id={`svg-${image.id}`}
      width={imageWidth}
      height={imageHeight}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox={`${position.x} ${position.y} ${image.width * zoom} ${image.height * zoom}`}
    >
      <Defs>
        <ClipPath id={`clip${image.id}`}>{polygon}</ClipPath>
      </Defs>
      {/* Show background image with a low opacity */}
      <DamageImage
        name={image.id}
        source={image.source}
        opacity={showPolygon || !isEmpty(polygons) ? backgroundOpacity : 1}
      />
      <Text paintOrder="stroke" stroke="black" strokeWidth={5} fill="white" fontSize={image.width * 0.02} x={tagPos.x} y={(tagPos.y - image.height * 0.02) <= 0 ? tagPos.maxY : tagPos.y} textAnchor={(tagPos.x + measureText(damage.damageType, image.width * 0.02)) >= image.width ? 'end' : 'start'}>{damage.damageType.charAt(0).toUpperCase() + damage.damageType.slice(1).replace(/[-_]/g, ' ')}</Text>
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
  damage: PropTypes.string,
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
  savePng: PropTypes.func,
  touchable: PropTypes.bool,
  width: PropTypes.number,
};

DamageHighlight.defaultProps = {
  backgroundOpacity: 0.35,
  damage: '',
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
  savePng: noop,
  touchable: false,
  width: 400,
};
export default DamageHighlight;
