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
    if (isPending) { return colors.placeholder; }
    return colors.accent;
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
          <View style={styles.imageOverlay}>
            <ActivityIndicator style={styles.activityIndicator} color={colors.background} />
          </View>
          <View style={[styles.imageOverlay,
            { backgroundColor: colors.placeholder, opacity: 0.4, zIndex: 1 }]}
          />
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
            <Text style={[styles.subtitle, { color: colors.placeholder }]}>
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
    accent: PropTypes.string,
    actions: PropTypes.shape({
      primary: PropTypes.shape({
        background: PropTypes.string,
        text: PropTypes.string,
      }),
      secondary: PropTypes.shape({
        background: PropTypes.string,
        text: PropTypes.string,
      }),
    }),
    background: PropTypes.string,
    boneColor: PropTypes.string,
    disabled: PropTypes.string,
    error: PropTypes.string,
    highlightBoneColor: PropTypes.string,
    notification: PropTypes.string,
    onSurface: PropTypes.string,
    placeholder: PropTypes.string,
    primary: PropTypes.string,
    success: PropTypes.string,
    surface: PropTypes.string,
    text: PropTypes.string,
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
