import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Platform, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import monk from '@monkvision/corejs';
import { useSentry } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';
import useEmbeddedModel from '../../hooks/useEmbeddedModel';
import Models from '../../hooks/useEmbeddedModel/const';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  p: {
    color: 'rgba(250, 250, 250, 0.87)',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 30,
    letterSpacing: 0.15,
    fontSize: 16,
    marginBottom: 10,
  },
});

export default function ModelManager({ backgroundColor, onSuccess, Sentry }) {
  const [hasModelsBeenProcessed, setHasModelsBeenProcessed] = useState(false);
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { downloadThenSaveModelAsync } = useEmbeddedModel();
  const { Span, errorHandler } = useSentry(Sentry);
  const { t } = useTranslation();
  const { height, width } = useWindowDimensions();
  const uriKey = Platform.OS === 'web' ? 'web' : 'native';

  const downloadAndProcessModel = (model) => downloadThenSaveModelAsync(
    model.name,
    model.uri[uriKey],
    {
      headers: monk.config.axiosConfig.headers,
    },
  );
  const tryDownloading = () => {
    setLoading(true);
    setError(false);
    const downloadSpan = new Span('embedded-models-download-time', SentryConstants.operation.HTTP);
    downloadAndProcessModel(Models.imageQualityCheck)
      .then(() => {
        downloadSpan.addDataToSpan('embedded-models-download-time', 'imageQualityCheck', 'success');
        setHasModelsBeenProcessed(true);
        setLoading(false);
        onSuccess();
      }).catch((err) => {
        downloadSpan.addDataToSpan('embedded-models-download-time', 'imageQualityCheck', 'error');
        const additionalTags = { model: Models.imageQualityCheck };
        errorHandler(err, SentryConstants.type.COMPLIANCE, null, additionalTags);
        setHasModelsBeenProcessed(false);
        setError(true);
        setLoading(false);
      }).finally(() => {
        downloadSpan.finish();
      });
  };

  useEffect(() => {
    if (!hasModelsBeenProcessed && !isError && !isLoading) {
      tryDownloading();
    }
  }, [hasModelsBeenProcessed, isError, isLoading]);

  const handleRetry = () => {
    if (!hasModelsBeenProcessed) {
      tryDownloading();
    }
  };

  if (hasModelsBeenProcessed) {
    return null;
  }

  if (isError) {
    return (
      <View
        accessibilityLabel="Model Manager"
        style={[{ height, width }, { backgroundColor }, styles.container]}
      >
        <Text style={styles.p}>{t('embeddedModels.error.message')}</Text>
        <Button onPress={handleRetry} title={t('embeddedModels.error.retry')} />
      </View>
    );
  }

  return (
    <View
      accessibilityLabel="Model Manager"
      style={[{ height, width }, { backgroundColor }, styles.container]}
    >
      <ActivityIndicator size="large" />
    </View>
  );
}

ModelManager.propTypes = {
  backgroundColor: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  Sentry: PropTypes.any,
};

ModelManager.defaultProps = {
  Sentry: null,
};
