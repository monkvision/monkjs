import React, { useCallback, useMemo } from 'react';
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
function UploadCard({ upload, onRetake, iqaCompliance, sightLabel }) {
  const { picture: { uri }, status } = upload;
  const iqa = iqaCompliance?.result?.data?.compliances?.image_quality_assessment;

  const { error, isLoading, fulfilled, iqaLoading } = useMemo(() => ({
    error: status === 'rejected',
    isLoading: status === 'pending',
    fulfilled: status === 'fulfilled',
    iqaLoading: iqa?.status === 'pending',
  }), [iqa?.status, status]);

  const { isNotCompliant, isCompliant } = useMemo(() => ({
    isNotCompliant: iqa && iqa.is_compliant === false && iqa.status === 'DONE',
    isCompliant: iqa && iqa.is_compliant === true && iqa.status === 'DONE',
  }),
  [iqa]);

  const title = useMemo(() => {
    if (isLoading) { return 'Uploading...'; }
    if (error) { return 'Image has not been uploaded'; }
    return 'Image has been uploaded successfully';
  }, [error, isLoading]);

  const subtitle = useMemo(() => {
    if (isLoading) { return null; }
    if (error) { return 'Image has an error, please retake'; }
    if (isCompliant) { return `This image is compliant`; }
    if (iqaLoading) { return 'Checking the image quality...'; }
    if (isNotCompliant) {
      const length = iqa?.reasons.length;
      const distReasons = iqa?.reasons.map((reason, index) => ((index === length - 1 && length > 1) ? `and ${reasonsVariants[reason]}` : reasonsVariants[reason]));
      return `This image is ${distReasons}`;
    }
    return null;
  }, [isLoading, error, isCompliant, iqaLoading, isNotCompliant, iqa?.reasons]);

  const handleRetake = useCallback((id) => {
    if (fulfilled) { onRetake(id, iqaCompliance?.id); } else { onRetake(id); }
  }, [fulfilled, iqaCompliance?.id, onRetake]);

  return (
    <View style={styles.upload}>

      {/* preview image for error or non compliant images */}
      {error || (isNotCompliant && !isLoading) ? (
        <TouchableOpacity style={styles.imageLayout} onPress={() => handleRetake(upload.id)}>
          <View style={[styles.imageOverlay, { backgroundColor: error ? 'rgba(255, 69, 0, 0.4)' : 'rgba(255, 152, 0, 0.4)' }]}>
            <MaterialCommunityIcons name="camera-retake" size={24} color="#FFF" />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </TouchableOpacity>
      ) : null}

      {/* preview image with a loading indicator */}
      {isLoading ? (
        <View style={styles.imageLayout}>
          <View style={[styles.imageOverlay, { backgroundColor: 'rgba(211, 211, 211, 0.4)' }]}>
            <ActivityIndicator style={styles.activityIndicator} color="#FFF" />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </View>
      ) : null}

      {/* preview image for compliant fulfilled images */}
      {fulfilled && !isNotCompliant ? (
        <View style={styles.imageLayout}>
          <Image style={styles.image} source={{ uri }} />
        </View>
      ) : null}

      {/* test indicating the status of uploading and the non-compliance reasons */}
      <View style={[styles.textsLayout, { flexDirection: 'row' }]}>
        <View style={styles.textsLayout}>
          <Text>{`${sightLabel} - ${title}`}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {error ? <MaterialCommunityIcons name="close-circle" size={24} color="#fa603d" /> : null}
        {isNotCompliant && fulfilled ? <MaterialCommunityIcons name="information" size={24} color="#ff9800" /> : null}
      </View>
    </View>
  );
}

UploadCard.propTypes = {
  iqa: PropTypes.shape({
    is_compliant: PropTypes.bool,
    reasons: PropTypes.arrayOf(PropTypes.string),
    status: PropTypes.string,
  }),
  iqaCompliance: PropTypes.shape({
    error: PropTypes.objectOf(PropTypes.any),
    id: PropTypes.string,
    requestCount: PropTypes.number,
    result: PropTypes.objectOf(PropTypes.any),
    status: PropTypes.string,
  }),
  onRetake: PropTypes.func,
  sightLabel: PropTypes.string,
  upload: PropTypes.shape({
    id: PropTypes.string,
    picture: PropTypes.shape({ uri: PropTypes.string }),
    status: PropTypes.string,
  }),
};

UploadCard.defaultProps = {
  iqa: null,
  iqaCompliance: null,
  onRetake: () => {},
  sightLabel: '',
  upload: {
    id: '',
    status: '',
    picture: { uri: '' },
  },
};
export default UploadCard;
