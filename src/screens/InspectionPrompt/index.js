import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useSentry, useTimeout } from '@monkvision/toolkit';
import { SentryConstants } from '@monkvision/toolkit/src/hooks/useSentry';

import * as names from 'screens/names';
import Alert from '../../components/Alert';
import Sentry from '../../config/sentry';

const styles = StyleSheet.create({
  root: {
    position: 'relative',
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    margin: 10,
  },
});

export default function InspectionPrompt() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();
  const { Span } = useSentry(Sentry);

  const { inspectionId, options, to } = route.params || {};
  const { key, ...rest } = options;

  const [value, callback] = useState(null);
  const [transaction, setTransaction] = useState(null);

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING, { inspectionId }),
    [inspectionId, navigation],
  );

  useTimeout(() => { Alert.prompt({ ...rest, callback }); }, 100);

  useEffect(() => {
    // eslint-disable-next-line max-len
    if (!transaction) { setTransaction(new Span('manual-vin-insertion', SentryConstants.operation.USER_TIME)); }
  }, [transaction]);

  useEffect(() => {
    if (value) {
      if (transaction) { transaction.finish(); }
      navigation.navigate(to || names.LANDING, { [key]: value, inspectionId, ...route.params });
    }
  }, [value, transaction]);

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('vinModal.prompt.backgroundMessage')}
      </Text>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" color={colors.text} onPress={handleGoBack}>{t('vinModal.prompt.backgroundGoBack')}</Button>
      </Card.Actions>
    </View>
  );
}
