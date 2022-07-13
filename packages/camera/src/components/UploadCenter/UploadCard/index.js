import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from './styles';
import useSubtitle from './hooks/useSubtitle';
import useStatus from './hooks/useStatus';
import Motion from '../motion/index';
import useVariant from './hooks/useVariant';

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
  const { i18n } = useTranslation();
  const { uri } = picture;

  const {
    isPending,
    isUploadFailed,
    isComplianceIdle,
    isComplianceFailed,
    isComplianceUnknown,
  } = useStatus({ compliance, upload });

  const subtitle = useSubtitle({
    isComplianceUnknown, isComplianceIdle, isPending, isUploadFailed, compliance });

  const handleReupload = useCallback(
    () => onReupload(id, picture, i18n.language),
    [id, picture, onReupload, i18n.language],
  );
  const handleRecheck = useCallback(() => onRecheck(id), [onRecheck, id]);
  const handleRetake = useCallback(() => onRetake(id), [onRetake, id]);

  const variant = useVariant({
    colors,
    isPending,
    isComplianceFailed,
    isComplianceIdle,
    isComplianceUnknown,
    isUploadFailed,
    handleReupload,
    handleRecheck,
    handleRetake,
  });

  return (
    <View style={styles.upload}>
      {/* variant */}
      <TouchableOpacity
        style={styles.imageLayout}
        onPress={variant.callback}
        disabled={!variant.callback || isPending}
      >
        <Motion.Initiator
          style={styles.imageOverlay}
          extraData={[isPending, variant.icon]}
          minOpacity={0}
        >
          {isPending
            ? <ActivityIndicator style={styles.activityIndicator} color={colors.background} />
            : <MaterialCommunityIcons name={variant.icon} size={24} color={colors.background} />}
          <Text style={[styles.retakeText, { color: colors.background }]}>{variant.label}</Text>
        </Motion.Initiator>
        <Motion.Initiator
          maxOpacity={0.7}
          minOpacity={0.4}
          style={[
            styles.imageOverlay, styles.opacityOverlay, { backgroundColor: variant.color }]}
          extraData={[variant.color]}
        />
        <Image style={styles.image} source={{ uri }} />
      </TouchableOpacity>

      {/* text */}
      <Motion.Initiator
        minOpacity={0}
        style={[styles.textsLayout, { flexDirection: 'row' }]}
        extraData={[subtitle]}
      >
        <View style={styles.textsLayout}>
          <Text style={[styles.title, { color: colors.text }]}>{label}</Text>
          <Text style={[styles.subtitle, { color: colors.placeholder }]}>
            {subtitle}
            {variant?.callback
              ? (
                <TouchableOpacity onPress={variant.callback}>
                  <Text style={{ fontWeight: 'bold' }}>{`, ${variant.sublable}`}</Text>
                </TouchableOpacity>
              )
              : null}
          </Text>
        </View>
      </Motion.Initiator>
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
    error: PropTypes.objectOf(PropTypes.any),
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
