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
  onRecheck,
  picture,
  upload,
  colors,
}) {
  const { uri } = picture;

  const {
    isPending, isUploadFailed, isComplianceIdle, isComplianceFailed, isComplianceUnknown,
  } = useStatus({ compliance, upload });

  const subtitle = useSubtitle({
    isComplianceUnknown, isComplianceIdle, isPending, isUploadFailed, compliance });

  const statusColor = useMemo(() => {
    if (isUploadFailed) { return colors.error; }
    if (isPending) { return colors.placeholder; }
    if (isComplianceFailed || isComplianceIdle) { return colors.disabled; }
    return colors.accent;
  }, [isComplianceFailed, isComplianceIdle, isPending, isUploadFailed]);

  const handleReupload = useCallback(() => onReupload(id, picture), [id, picture, onReupload]);
  const handleRecheck = useCallback(() => onRecheck(id), [onRecheck, id]);
  const handleRetake = useCallback(() => onRetake(id), [onRetake, id]);

  const thumbnail = useMemo(() => {
    if (isPending) { return { callback: null }; }
    if (isUploadFailed) {
      return {
        label: 'Reupload picture',
        icon: 'refresh-circle',
        callback: handleReupload,
        sublable: 'press here to reupload...',
      };
    }
    if (isComplianceIdle) {
      return {
        label: 'In queue',
        icon: 'clock',
        callback: null,
      };
    }
    if (isComplianceFailed) {
      return {
        label: 'Recheck picture',
        icon: 'alert-circle',
        callback: handleRecheck,
        sublable: 'press here to recheck...',
      };
    }

    return { label: 'Retake picture',
      icon: 'camera-retake',
      callback: handleRetake,
      sublable: 'press here to retake...',
    };
  }, [isComplianceFailed, isComplianceIdle, isUploadFailed,
    handleReupload, handleRecheck, handleRetake]);

  return (
    <View style={styles.upload}>
      {/* preview image with a loading indicator */}
      {isPending && (
        <View style={styles.imageLayout}>
          <View style={styles.imageOverlay}>
            <ActivityIndicator style={styles.activityIndicator} color={colors.background} />
          </View>
          <View style={[
            styles.imageOverlay,
            styles.opacityOverlay,
            { backgroundColor: colors.placeholder }]}
          />
          <Image style={styles.image} source={{ uri }} />
        </View>
      )}

      {!isPending && (
        <TouchableOpacity
          style={styles.imageLayout}
          onPress={thumbnail.callback}
          disabled={!thumbnail.callback}
        >
          <View style={styles.imageOverlay}>
            <MaterialCommunityIcons name={thumbnail.icon} size={24} color={colors.background} />
            <Text style={[styles.retakeText, { color: colors.background }]}>{thumbnail.label}</Text>
          </View>
          <View style={[
            styles.imageOverlay,
            styles.opacityOverlay,
            { backgroundColor: statusColor }]}
          />
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
              {thumbnail?.callback
                ? (
                  <TouchableOpacity onPress={thumbnail.callback}>
                    <Text style={{ fontWeight: 'bold' }}>{`, ${thumbnail.sublable}`}</Text>
                  </TouchableOpacity>
                )
                : null}
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
  onRecheck: PropTypes.func,
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
  onRecheck: () => {},
};
export default UploadCard;
