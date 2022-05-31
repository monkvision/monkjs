import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';
import useSubtitle from './hooks/useSubtitle';
import useStatus from './hooks/useStatus';

function UploadCard({
  compliance,
  id,
  label,
  onRetake,
  onReupload,
  picture,
  upload,
  colors,
}) {
  const { uri } = picture;

  const { isPending, isUnknown, isFailure } = useStatus({ compliance, upload });
  const subtitle = useSubtitle({ isUnknown, isPending, isFailure, compliance });

  const statusColor = useMemo(() => {
    if (isFailure) { return colors.error; }
    if (isPending) { return colors.neutral; }
    return colors.warning;
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
          <View style={[styles.imageOverlay, { backgroundColor: `${colors.neutral}64` }]}>
            <ActivityIndicator style={styles.activityIndicator} color={colors.loader} />
          </View>
          <Image style={styles.image} source={{ uri }} />
        </View>
      )}

      {!isPending && (
        <TouchableOpacity style={styles.imageLayout} onPress={handlePress}>
          <View style={[styles.imageOverlay, { backgroundColor: `${statusColor}64` }]}>
            <MaterialCommunityIcons name="camera-retake" size={24} color={colors.background} />
            <Text style={[styles.retakeText, { color: colors.background }]}>{isFailure ? 'Reupload picture' : 'Retake picture'}</Text>
          </View>
          <Image style={styles.image} source={{ uri }} />
        </TouchableOpacity>
      )}

      {/* text indicating the status of uploading and the non-compliance reasons */}
      <View style={[styles.textsLayout, { flexDirection: 'row' }]}>
        <View style={styles.textsLayout}>
          <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.subtitle }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

UploadCard.propTypes = {
  colors: PropTypes.shape({
    actions: PropTypes.shape({
      disabled: PropTypes.string,
      primary: PropTypes.string,
      secondary: PropTypes.string,
    }),
    background: PropTypes.string,
    error: PropTypes.string,
    loader: PropTypes.string,
    neutral: PropTypes.string,
    subtitle: PropTypes.string,
    text: PropTypes.string,
    warning: PropTypes.string,
  }).isRequired,
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
