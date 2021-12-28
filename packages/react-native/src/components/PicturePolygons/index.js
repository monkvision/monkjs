import React from 'react';
import { View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';

import DamageImage from './DamageImage';

const width = 400;
const height = 300;
const IMAGE_OPACITY = 0.15;

const styles = {
  content: {
    flex: 1,
    width: 400,
    height: 300,
  },
};

export default function PicturePolygons({ image, polygons }) {
  if (!image && !polygons && !polygons.length <= 0) {
    return <View />;
  }

  return (
    <View style={styles.content}>
      <Svg width={width} height={height} viewBox={`0 0 ${image.imageWidth} ${image.imageHeight}`}>
        <Defs>
          <ClipPath id={`clip${image.id}`}>
            {polygons.map((region) => region.map((polygon, index) => <Polygon key={String(index)} points={polygon.map((card) => `${(card[0])},${(card[1])}`).join(' ')} fill="red" stroke="black" strokeWidth="1" />))}
          </ClipPath>
        </Defs>
        {/* Show Damages Polygon */}
        <DamageImage name={image.id} path={image.path} clipId={`clip${image.id}`} />
        {/* Show background image with a low opacity */}
        <DamageImage name={image.id} path={image.path} opacity={IMAGE_OPACITY} />
      </Svg>
    </View>
  );
}

PicturePolygons.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.string,
    imageHeight: PropTypes.number,
    imageWidth: PropTypes.number,
    path: PropTypes.string,
  }).isRequired,
  polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))).isRequired,
};
