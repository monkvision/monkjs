import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Button from '../UploadCenter/button';
import Models from '../../hooks/useEmbeddedModel/const';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginBottom: 15,
  },
  message: {
    fontSize: 18,
    marginBottom: 15,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function ComplianceCheck({
  image,
  compliance,
  colors,
  onRetakePicture,
  onSkipCompliance,
}) {
  const { width, height } = useWindowDimensions();
  const { t, i18n } = useTranslation();
  const imageRatio = 0.6;

  const complianceErrors = {
    blurriness: compliance.result.details.blurriness_score[0] < Models
      .imageQualityCheck.minConfidence.blurriness,
    overexposure: compliance.result.details.overexposure_score[0] < Models
      .imageQualityCheck.minConfidence.overexposure,
    underexposure: compliance.result.details.underexposure_score[0] < Models
      .imageQualityCheck.minConfidence.underexposure,
  };

  const complianceMessage = useMemo(() => {
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

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          backgroundColor: colors.background,
        }]}
    >
      <Image
        source={image}
        style={[
          styles.image,
          { width: width * imageRatio, height: height * imageRatio },
        ]}
      />
      <Text style={[styles.message, { color: colors.text }]}>{complianceMessage}</Text>
      <View style={styles.buttonContainer}>
        <Button
          colors={colors}
          color={colors.actions.primary}
          disabled={false}
          onPress={onRetakePicture}
        >
          <Text style={{ color: colors.actions.primary.text ?? colors.text }}>
            {t('embeddedModels.retry')}
          </Text>
        </Button>
        <Button
          colors={colors}
          color={colors.actions.secondary}
          disabled={false}
          onPress={onSkipCompliance}
        >
          <Text style={{ color: colors.actions.secondary.text ?? colors.text }}>
            {t('embeddedModels.skip')}
          </Text>
        </Button>
      </View>
    </View>
  );
}

ComplianceCheck.defaultProps = {
  image: undefined,
};

ComplianceCheck.propTypes = {
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
  image: PropTypes.any,
  onRetakePicture: PropTypes.func.isRequired,
  onSkipCompliance: PropTypes.func.isRequired,
};
