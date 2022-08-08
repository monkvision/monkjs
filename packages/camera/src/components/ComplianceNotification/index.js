import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';
import Button from '../UploadCenter/button';
import Models from '../../hooks/useEmbeddedModel/const';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 20,
    marginBottom: 20,
    marginLeft: 20,
    backgroundColor: '#15172d',
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacing: {
    marginRight: 20,
  },
  message: {
    fontSize: 16,
    color: '#e0e0e0',
  },
});

export default function ComplianceNotification({
  compliance,
  image,
  colors,
  onSkipCompliance,
  onCloseNotification,
}) {
  const { t, i18n } = useTranslation();
  const imageHeight = 40;
  const imageRatio = 2560 / 1440;
  const imageWidth = imageHeight * imageRatio;

  let complianceMessage = '';
  if (compliance?.result?.details) {
    const complianceErrors = {
      blurriness: compliance.result.details.blurriness_score[0] < Models
        .imageQualityCheck.minConfidence.blurriness,
      overexposure: compliance.result.details.overexposure_score[0] < Models
        .imageQualityCheck.minConfidence.overexposure,
      underexposure: compliance.result.details.underexposure_score[0] < Models
        .imageQualityCheck.minConfidence.underexposure,
    };

    complianceMessage = useMemo(() => {
      const reasonsStart = t('uploadCenter.subtitle.reasonsStart');
      let message = reasonsStart;
      Object.entries(complianceErrors)
        .filter(([, isCompliant]) => !isCompliant)
        .forEach(([reason]) => {
          if (message !== reasonsStart) {
            message = `${message} ${t('uploadCenter.subtitle.reasonsJoin')}`;
          }
          message = `${message} ${t(`uploadCenter.subtitle.reasons.${reason}`)}`;
        });
      return `${message}.`;
    }, [compliance, i18n.language]);
  }

  return (
    <View style={styles.container}>
      <Image
        source={image}
        style={[
          styles.spacing,
          { width: imageWidth, height: imageHeight },
        ]}
      />
      <Text style={[styles.message, styles.spacing]}>{complianceMessage}</Text>
      <Button
        colors={colors}
        color={colors.actions.secondary}
        disabled={false}
        onPress={onSkipCompliance}
        extraStyle={[{ marginTop: 0, marginBottom: 0, marginLeft: 0 }, styles.spacing]}
      >
        <Text style={{ color: colors.actions.secondary.text ?? colors.text }}>
          {t('embeddedModels.skip')}
        </Text>
      </Button>
      <Button
        colors={colors}
        color={colors.actions.primary}
        disabled={false}
        onPress={onCloseNotification}
        style={{ margin: 0, padding: 10 }}
      >
        <Text style={{ color: colors.actions.primary.text ?? colors.text }}>
          ✖
        </Text>
      </Button>
    </View>
  );
}

ComplianceNotification.defaultProps = {};

ComplianceNotification.propTypes = {
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
    result: PropTypes.shape({
      details: PropTypes.shape({
        blurriness_score: PropTypes.array.isRequired,
        overexposure_score: PropTypes.array.isRequired,
        underexposure_score: PropTypes.array.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
  image: PropTypes.any.isRequired,
  onCloseNotification: PropTypes.func.isRequired,
  onSkipCompliance: PropTypes.func.isRequired,
};
