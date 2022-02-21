import React, { useMemo } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { utils } from '@monkvision/toolkit';

const { spacing } = utils.styles;

const styles = StyleSheet.create({
  upload: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    height: 100,
    padding: spacing(1),
    marginVertical: spacing(0.4),
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
    justifyContent: 'center',
  },
  imageOverlay: {
    width: 80,
    height: 80,
    position: 'absolute',
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  text: {
    flexGrow: 1,
    flex: 1,
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
});

export default function UploadCard({ uri, status }) {
  const { error, isLoading, fulfilled } = useMemo(() => ({ error: status === 'declined', isLoading: status === 'pending', fulfilled: status === 'fulfilled' }), [status]);

  const text = useMemo(() => {
    if (isLoading) { return 'Uploading...'; }
    if (error) { return 'Image has not been uploaded'; }
    return 'Image has been uploaded successfully';
  }, [error, isLoading]);

  return (
    <View style={styles.upload}>
      {error ? (
        <TouchableOpacity style={styles.imageLayout}>
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(255, 69, 0,0.4)' }]}>
            <MaterialCommunityIcons name="camera-retake" size={24} color="#FFF" />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </TouchableOpacity>
      ) : null}

      {isLoading ? (
        <View style={styles.imageLayout}>
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(211, 211, 211, 0.4)' }]}>
            <ActivityIndicator style={styles.activityIndicator} color="#FFF" />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </View>
      ) : null}

      {fulfilled ? (
        <View style={styles.imageLayout}>
          <Image style={styles.image} source={{ uri }} />
        </View>
      ) : null}

      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

UploadCard.propTypes = {
  status: PropTypes.string,
  uri: PropTypes.string,

};

UploadCard.defaultProps = {
  uri: '',
  status: '',
};
