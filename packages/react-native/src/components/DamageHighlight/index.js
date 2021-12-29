import React from 'react';
import { Dimensions, View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';

import DamageImage from './DamageImage';

const width = Math.min(Dimensions.get('window').width - 50, 400);
const height = 300;
const IMAGE_OPACITY = 0.15;

const styles = {
  content: {
    flex: 1,
    width,
    height,
  },
};

export default function DamageHighlight({ image, polygons }) {
  if (!image && !polygons && !polygons.length <= 0) {
    return <View />;
  }

  return (
    <View style={styles.content}>
      <Svg width={width} height={height} viewBox={`0 0 ${image.width} ${image.height}`}>
        <Defs>
          <ClipPath id={`clip${image.id}`}>
            {polygons?.map((polygon, index) => (
              <Polygon
                key={String(index)}
                points={polygon.map((card) => `${(card[0])},${(card[1])}`).join(' ')}
                fill="red"
                stroke="black"
                strokeWidth="1"
              />
            ))}
          </ClipPath>
        </Defs>
        {/* Show Damages Polygon */}
        <DamageImage name={image.id} source={image.source} clip />
        {/* Show background image with a low opacity */}
        <DamageImage name={image.id} source={image.source} opacity={IMAGE_OPACITY} />
      </Svg>
    </View>
  );
}

DamageHighlight.propTypes = {
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string,
    source: {
      uri: PropTypes.string,
    },
    width: PropTypes.number,
  }).isRequired,
  polygons: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number))).isRequired,
};
// Values example

// const image = {
//   id: "uuid", // image's uuid
//   width: 0, // original size of the image
//   height: 0,
//   source: {
//     uri: "https://my_image_path.monk.ai"
//   },
// };

// const polygons = [[[0, 0], [1, 0], [0, 1]], [[2, 0], [1, 1], [0, 2]]];
