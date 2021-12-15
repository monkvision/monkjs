import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';

import DamageImage from './DamageImage';

export default function DamagePolygon({ width, height, currentImage, view, style }) {
  const getDamagePolygons = useMemo(() => {
    const { imageWidth, imageHeight } = currentImage;
    const specification = view.map((v) => v.image_region.specification);
    return specification.map((spec) => spec.polygons.map((polygon) => <Polygon points={polygon.map((card) => `${(card[0] * width) / imageWidth},${(card[1] * height) / imageHeight}`).join(' ')} fill="red" stroke="black" strokeWidth="1" />));
  }, [currentImage, height, view, width]);

  return (
    currentImage && (
    <View style={style}>
      <Svg width={width} height={height}>
        <Defs>
          <ClipPath id={`clip${currentImage.name}`}>
            {getDamagePolygons}
          </ClipPath>
        </Defs>
        {/* Show Damages Polygon */}
        <DamageImage name={currentImage.name} path={currentImage.path} clipId={`clip${currentImage.name}`} />
        {/* Show background image with a low opacity */}
        <DamageImage name={currentImage.name} path={currentImage.path} opacity={0.15} />
      </Svg>
    </View>
    )
  );
}

DamagePolygon.propTypes = {
  currentImage: {
    imageWidth: PropTypes.number,
    imageHeight: PropTypes.number,
    name: PropTypes.string,
    path: PropTypes.string,
  },
  height: PropTypes.number,
  view: [{
    element_id: PropTypes.string,
    image_region: {
      specification: [{
        bounding_box: PropTypes.object,
        polygons: PropTypes.array,
      }],
    },
  }],
  width: PropTypes.number,
};

DamagePolygon.defaultProps = {
  currentImage: {
    imageWidth: 0,
    imageHeight: 0,
    name: '',
    path: '',
  },
  height: 300,
  view: [],
  width: 400,
};
