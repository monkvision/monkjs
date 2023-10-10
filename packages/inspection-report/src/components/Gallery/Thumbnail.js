import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Image, Text, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  noImageWrapper: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
});

const responsiveImageSizes = [
  { breakpoint: 480, width: 109 },
  { breakpoint: 768, width: 140 },
  { breakpoint: null, width: 109 },
];

function Thumbnail({ image, click }) {
  const { i18n, t } = useTranslation();
  const { width } = useWindowDimensions();
  const label = useMemo(() => (image.label ? image.label[i18n.language] : ''), [i18n]);

  const imageSize = useMemo(
    () => responsiveImageSizes.find((r) => (!r.breakpoint || width <= r.breakpoint)).width,
    [width],
  );

  return (
    <TouchableOpacity onPress={() => click(image)}>
      <View style={{ width: imageSize }}>
        {
          !image.url ? (
            <View style={[{ width: imageSize, height: imageSize }, styles.noImageWrapper]}>
              <MaterialIcons
                name="add-a-photo"
                size={imageSize / 3}
                color="#757575"
              />
            </View>
          ) : (
            <Image
              source={{
                width: imageSize,
                height: imageSize,
                uri: image.url,
              }}
            />
          )
        }
        <Text style={styles.text}>
          {label}
          {' '}
          {image?.isRendered && t('gallery.renderedOutput')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

Thumbnail.propTypes = {
  click: PropTypes.func,
  image: PropTypes.shape({
    isRendered: PropTypes.bool,
    label: PropTypes.shape({
      en: PropTypes.string,
      fr: PropTypes.string,
    }),
    url: PropTypes.string,
  }),
};

Thumbnail.defaultProps = {
  click: null,
  image: {
    label: {
      en: '',
      fr: '',
    },
    url: '',
    isRendered: false,
  },
};

export default Thumbnail;
