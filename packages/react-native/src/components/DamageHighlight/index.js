import React, { useMemo } from 'react';
import { Dimensions, Platform, View } from 'react-native';
import { ClipPath, Defs, G, Image, Polygon, Svg } from 'react-native-svg';
import PropTypes from 'prop-types';
import isEmpty from 'lodash.isempty';

const width = Math.min(Dimensions.get('window').width - 50, 400);
const height = 300;
const IMAGE_OPACITY = '0.15';

const styles = {
  content: {
    flex: 1,
    width,
    height,
  },
};

function Wrapper({ children, name }) {
  if (Platform.OS === 'ios') {
    return <G clipPath={name && `url(#clip${name})`}>{children}</G>;
  }

  return children;
}

Wrapper.propTypes = {
  name: PropTypes.string.isRequired,
};

function DamageImage({ clip, name, source, opacity }) {
  const href = useMemo(
    () => (Platform.OS === 'web' ? source.uri : source),
    [source],
  );

  const clipPath = useMemo(
    () => (Platform.OS !== 'ios' ? clip && `url(#clip${name})` : undefined),
    [clip, name],
  );

  return (
    <Wrapper name={name}>
      <Image
        key={name}
        x="0"
        y="0"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        opacity={opacity}
        href={href}
        clipPath={clipPath}
      />
    </Wrapper>
  );
}

DamageImage.propTypes = {
  clip: PropTypes.bool,
  name: PropTypes.string,
  opacity: PropTypes.string,
  source: PropTypes.shape({ uri: PropTypes.string }),
};

DamageImage.defaultProps = {
  clip: false,
  name: '',
  opacity: '1',
  source: { uri: '' },
};

export default function DamageHighlight({ image, polygons }) {
  if (!image || isEmpty(polygons)) {
    return <View />;
  }

  return (
    <View style={styles.content}>
      <Svg width={width} height={height} viewBox={`0 0 ${image.width} ${image.height}`}>
        <Defs>
          <ClipPath id={`clip${image.id}`}>
            {polygons.map((polygon, index) => (
              <Polygon
                key={`${image.id}-polygon-${String(index)}`}
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
