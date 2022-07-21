import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
  },
  buttonContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBtn: {
    marginLeft: 10,
  },
});

export default function ComplianceCheck({ imageUri, compliance, colors }) {
  const { width, height } = useWindowDimensions();
  const { t, i18n } = useTranslation();

  const complianceMessage = useMemo(() => {
    const reasonsStart = t('uploadCenter.subtitle.reasonsStart');
    let message = reasonsStart;
    Object.entries(compliance)
      .filter(([, isCompliant]) => !isCompliant)
      .forEach(([criteria]) => {
        if (message !== reasonsStart) {
          message = `${message} ${t('uploadCenter.subtitle.reasonsJoin')}`;
        }
        message = `${message} ${t(`uploadCenter.subtitle.reasons.${criteria}`)}`;
      });
    return message;
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
        height={height * 0.4}
        source={imageUri}
        style={{ width: width * 0.4, height: height * 0.4 }}
        width={width * 0.4}
      />
      <Text style={[styles.message, { color: colors.text }]}>{complianceMessage}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={t('embeddedModels.retry')}
          colors={colors}
          color={colors.actions.primary}
        />
        <Button
          title={t('embeddedModels.skip')}
          colors={colors}
          color={colors.actions.secondary}
          style={styles.rightBtn}
        />
      </View>
    </View>
  );
}

ComplianceCheck.defaultProps = {
  imageUri: { uri: '' },
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
    blurriness: PropTypes.bool,
    overexposure: PropTypes.bool,
    underexposure: PropTypes.bool,
  }).isRequired,
  imageUri: PropTypes.shape({
    uri: PropTypes.string,
  }),
};
