import React, { useMemo } from 'react';
import { View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';

import DamageImage from './DamageImage';

export default function DamagePolygon({ width, height, currentImage, views, style }) {
  const getDamagePolygons = useMemo(() => {
    if (!(currentImage && width && height)) { return null; }
    const specifications = views.filter((v) => v.image_region)
      .map((v) => v.image_region?.specification)
      .map((spec) => spec.polygons?.map((polygon, index) => <Polygon key={String(index)} points={polygon.map((card) => `${(card[0])},${(card[1])}`).join(' ')} fill="red" stroke="black" strokeWidth="1" />));
    return specifications ?? null;
  }, [currentImage, height, views, width]);

  return (
    currentImage && (
    <View style={style}>
      <Svg width={width} height={height} viewBox={`0 0 ${currentImage.imageWidth} ${currentImage.imageHeight}`}>
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
  currentImage: PropTypes.shape({
    imageHeight: PropTypes.number,
    imageWidth: PropTypes.number,
    name: PropTypes.string,
    path: PropTypes.string,
  }),
  height: PropTypes.number,
  views: PropTypes.arrayOf(PropTypes.shape({
    element_id: PropTypes.string,
    image_region: {
      specification: [{
        bounding_box: PropTypes.object,
        polygons: PropTypes.array,
      }],
    },
  })),
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
  views: [],
  width: 400,
};
