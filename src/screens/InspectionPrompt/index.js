import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useTimeout } from '@monkvision/toolkit';

import * as names from 'screens/names';
import Alert from '../../components/Alert';

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
  const { inspectionId, options, to } = route.params || {};
  const { key, ...rest } = options;
  const [value, callback] = useState(null);

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING, { inspectionId }),
    [inspectionId, navigation],
  );

  useTimeout(() => { Alert.prompt({ ...rest, callback }); }, 100);

  useEffect(() => {
    if (value) {
      navigation.navigate(to || names.LANDING, { [key]: value, inspectionId, ...route.params });
    }
  }, [value]);

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
