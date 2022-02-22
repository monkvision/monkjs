import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import isEmpty from 'lodash.isempty';
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
  textsLayout: {
    flexGrow: 1,
    flex: 1,
  },
  subtitle: {
    color: 'gray',
    fontWeight: '500',
    fontSize: 12,
    marginVertical: spacing(0.6),
  },
  activityIndicator: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 10,
  },
});

const reasonsVariants = {
  blurriness: 'blurry',
  overexposure: 'overexposed',
  underexposure: 'underexposed',
};
export default function UploadCard({ uri, status, onRetake, id, iqaCompliance }) {
  const { error, isLoading, fulfilled } = useMemo(() => ({ error: status === 'rejected', isLoading: status === 'pending', fulfilled: status === 'fulfilled' }), [status]);

  const title = useMemo(() => {
    if (isLoading) { return 'Uploading...'; }
    if (error) { return 'Image has not been uploaded'; }
    return 'Image has been uploaded successfully';
  }, [error, isLoading]);

  const subtitle = useMemo(() => {
    if (isLoading) { return null; }
    if (error) { return 'Image has an error, please retake'; }
    if (!isEmpty(iqaCompliance.reasons)) {
      const distReasons = iqaCompliance.reasons.map((reason, index) => {
        if (index === iqaCompliance.reasons.length - 1 && iqaCompliance.reasons.length > 1) { return `and ${reasonsVariants[reason]}`; }
        return reasonsVariants[reason];
      });
      return `This image is ${distReasons}`;
    }
    return `This image is compliant`;
  }, [error, iqaCompliance.reasons, isLoading]);

  const handleRetake = useCallback(() => onRetake(id), [id, onRetake]);

  return (
    <View style={styles.upload}>
      {error ? (
        <TouchableOpacity style={styles.imageLayout} onPress={handleRetake}>
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

      <View style={styles.textsLayout}>
        <Text>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

UploadCard.propTypes = {
  id: PropTypes.string,
  iqaCompliance: PropTypes.shape({
    is_compliant: PropTypes.bool,
    reasons: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
  }),
  onRetake: PropTypes.func,
  status: PropTypes.string,
  uri: PropTypes.string,

};

UploadCard.defaultProps = {
  id: '',
  iqaCompliance: {
    is_compliant: true,
    reason: [],
    status: null,
  },
  onRetake: () => {},
  status: '',
  uri: '',
};
