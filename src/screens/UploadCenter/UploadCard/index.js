import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { utils } from '@monkvision/toolkit';
import PropTypes from 'prop-types';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  upload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 100,
    padding: spacing(1),
    marginVertical: spacing(1),
    borderRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 4,
    position: 'absolute',
  },
  imageLayout: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginRight: spacing(2),
    position: 'relative',
  },
  imageOverlay: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 69, 0,0.4)',
  },
  text: {
    flexGrow: 1,
    flex: 1,
  },
});

export default function UploadCard({ isCompliant, reason, uri }) {
  return (
    <View style={styles.upload}>
      {isCompliant
        ? (
          <View style={styles.imageLayout}>
            <Image style={styles.image} source={{ uri }} />
          </View>
        )
        : (
          <TouchableOpacity style={styles.imageLayout}>
            <View style={styles.imageOverlay}>
              <IconButton icon="reload" color="#FFF" />
            </View>
            <Image style={styles.image} source={{ uri }} />
          </TouchableOpacity>
        )}
      {isCompliant ? (
        <Text style={styles.text}> Image has been uploaded succefully</Text>
      ) : (
        <Text style={styles.text}>
          {reason}
        </Text>
      )}
    </View>
  );
}

UploadCard.propTypes = {
  isCompliant: PropTypes.bool,
  reason: PropTypes.string,
  uri: PropTypes.string,

};

UploadCard.defaultProps = {
  isCompliant: false,
  reason: '',
  uri: '',
};
