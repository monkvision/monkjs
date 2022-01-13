import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { ClipPath, Defs, Polygon, Svg } from 'react-native-svg';
import { Chip, ToggleButton } from 'react-native-paper';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';
import DamageImage from '../DamageImage';
import useImageDamage from '../../hooks/useDamageImage';

const styles = StyleSheet.create({
  chip: {
    width: 'min-content',
    marginHorizontal: 10,
  },
  label: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default function DamageHighlight({
  backgroundOpacity,
  damageType,
  image,
  partTypes,
  polygons,
  polygonsProps,
}) {
  const [showLabel, setShowLabel] = useState('unchecked');
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
      <Svg
        width={width}
        height={height}
        viewBox={`0 0 ${image.width} ${image.height}`}
      >
        <Defs>
          <ClipPath id={`clip${image.id}`}>{polygon}</ClipPath>
        </Defs>
        {/* Show background image with a low opacity */}
        <DamageImage
          name={image.id}
          source={image.source}
          opacity={backgroundOpacity}
        />
        {/* Show Damages Polygon */}
        <DamageImage name={image.id} source={image.source} clip opacity={polygonsProps.opacity} />
        {polygon}
      </Svg>
      <ScrollView>
        <View style={styles.label}>
          <ToggleButton
            icon="car-door"
            status={showLabel}
            onPress={() => setShowLabel((prevState) => (prevState === 'unchecked' ? 'checked' : 'unchecked'))}
          />
          {showLabel === 'checked' && (
            <>
              <Chip
                icon="alert-circle"
                textStyle={{ fontSize: 12 }}
                style={styles.chip}
              >
                {damageType}
              </Chip>
              {!isEmpty(partTypes) && partTypes.map((part) => (
                <Chip
                  key={`${image.id}-${part}`}
                  icon="car-door"
                  textStyle={{ fontSize: 12 }}
                  style={styles.chip}
                >
                  {part}
                </Chip>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

DamageHighlight.propTypes = {
  backgroundOpacity: PropTypes.number,
  damageType: PropTypes.string,
  image: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string, // image's uuid
    source: PropTypes.shape({
      uri: PropTypes.string, // "https://my_image_path.monk.ai"
    }),
    width: PropTypes.number, // original size of the image
  }),
  partTypes: PropTypes.arrayOf(PropTypes.string),
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
};

DamageHighlight.defaultProps = {
  backgroundOpacity: 0.35,
  damageType: '',
  image: null,
  partTypes: [],
  polygons: [],
  polygonsProps: {
    opacity: 1,
    stroke: {
      color: 'yellow',
      strokeWidth: 2.5,
    },
  },
};
