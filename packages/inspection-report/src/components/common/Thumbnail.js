import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image, Text, StyleSheet, TouchableOpacity, View } from 'react-native';
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

function Thumbnail({ image, click }) {
  const { t } = useTranslation();
  const [imageSize, setImageSize] = useState(109);
  const { width } = Dimensions.get('window');

  useEffect(() => {
    if (width < 480) {
      setImageSize(109);
    } else if (width > 480 && width < 768) {
      setImageSize(140);
    } else {
      setImageSize(175);
    }
  }, [width]);

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
        <Text style={styles.text}>{t(`gallery.parts.${image.label}`)}</Text>
      </View>
    </TouchableOpacity>
  );
}

Thumbnail.propTypes = {
  click: PropTypes.func,
  image: PropTypes.shape({
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
  },
};

export default Thumbnail;
