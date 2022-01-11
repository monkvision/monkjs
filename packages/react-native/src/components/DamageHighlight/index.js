import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import DamageImage from '../DamageImage';
import useImageDamage from '../../hooks/useDamageImage';

const IMAGE_OPACITY = '0.35';

function DamageHighlight({
  image,
  polygons,
}) {
  const {
    state: {
      width,
      height,
    },
  } = useImageDamage(image);

  const polygon = useMemo(() => (
    polygons.map((p, index) => (
      <Polygon
        key={`${image.id}-polygon-${String(index)}`}
        points={p.map((card) => `${(card[0])},${(card[1])}`)
          .join(' ')}
        stroke="yellow"
        fillOpacity={0} // On the web, by default it is fill in black
        strokeWidth={2.5}
      />
    ))
  ), [polygons, image.id]);

  if (!image) {
    return <View />;
  }

  if (isEmpty(polygons)) {
    return (
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${image.width} ${image.height}`}
      >
        <DamageImage name={image.id} source={image.source} />
      </Svg>
    );
  }

  return (
    <View>
      <Svg width={width} height={height} viewBox={`0 0 ${image.width} ${image.height}`}>
        <Defs>
          <ClipPath id={`clip${image.id}`}>{polygon}</ClipPath>
        </Defs>
        {/* Show background image with a low opacity */}
        <DamageImage name={image.id} source={image.source} opacity={IMAGE_OPACITY} />
        {/* Show Damages Polygon */}
        <DamageImage name={image.id} source={image.source} clip />
        {polygon}
      </Svg>
    </View>
  );
}

export default DamageHighlight;

DamageHighlight.propTypes = {
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
};

DamageHighlight.defaultProps = {
  image: null,
  polygons: [],
};
