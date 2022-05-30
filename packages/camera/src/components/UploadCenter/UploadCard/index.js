import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';
import useSubtitle from './hooks/useSubtitle';
import useStatus from './hooks/useStatus';

const errorColor = 'rgba(255, 69, 0, 0.4)';
const warningColor = 'rgba(255, 152, 0, 0.4)';
const neutralColor = 'rgba(211, 211, 211, 0.4)';

function UploadCard({ compliance, id, label, onRetake, onReupload, picture, upload }) {
  const { uri } = picture;

  const { isPending, isUnknown, isFailure } = useStatus({ compliance, upload });
  const subtitle = useSubtitle({ isUnknown, isPending, isFailure, compliance });

  const statusColor = useMemo(() => {
    if (isFailure) { return errorColor; } if (isPending) { return neutralColor; }
    return warningColor;
  }, [upload.error, isPending]);

  const handlePress = useCallback((e) => {
    e.preventDefault();
    if (isFailure) { onReupload(id, picture); } else { onRetake(id); }
  }, [isFailure, id, onReupload, onRetake, picture]);

  return (
    <View style={styles.upload}>
      {/* preview image with a loading indicator */}
      {isPending && (
        <View style={styles.imageLayout}>
          <View style={[styles.imageOverlay, { backgroundColor: neutralColor }]}>
            <ActivityIndicator style={styles.activityIndicator} color="#FFF" />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </View>
      )}

      {!isPending && (
        <TouchableOpacity style={styles.imageLayout} onPress={handlePress}>
          <View style={[styles.imageOverlay, { backgroundColor: statusColor }]}>
            <MaterialCommunityIcons name="camera-retake" size={24} color="#FFF" />
            <Text style={styles.retakeText}>{isFailure ? 'Reupload picture' : 'Retake picture'}</Text>
          </View>
          <Image style={styles.image} source={{ uri }} />
        </TouchableOpacity>
      )}

      {/* text indicating the status of uploading and the non-compliance reasons */}
      <View style={[styles.textsLayout, { flexDirection: 'row' }]}>
        <View style={styles.textsLayout}>
          <Text style={styles.title}>{label}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
    </View>
  );
}

UploadCard.propTypes = {
  compliance: PropTypes.shape({
    error: PropTypes.string,
    result: PropTypes.shape({
      data: PropTypes.shape({
        compliances: PropTypes.shape({
          coverage_360: PropTypes.shape({
            is_compliant: PropTypes.bool,
            reasons: PropTypes.arrayOf(PropTypes.string),
            status: PropTypes.string,
          }),
          image_quality_assessment: PropTypes.shape({
            is_compliant: PropTypes.bool,
            reasons: PropTypes.arrayOf(PropTypes.string),
            status: PropTypes.string,
          }),
        }),
      }),
    }),
    status: PropTypes.string,
  }).isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onRetake: PropTypes.func,
  onReupload: PropTypes.func,
  picture: PropTypes.shape({
    uri: PropTypes.string,
  }).isRequired,
  upload: PropTypes.shape({
    error: PropTypes.objectOf(PropTypes.any),
    picture: PropTypes.shape({ uri: PropTypes.string }),
    status: PropTypes.string,
  }).isRequired,
};

UploadCard.defaultProps = {
  onRetake: () => {},
  onReupload: () => {},
};
export default UploadCard;
