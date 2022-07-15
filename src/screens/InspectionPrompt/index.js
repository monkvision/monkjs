import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useError, useTimeout } from '@monkvision/toolkit';
import { SpanConstants } from '@monkvision/toolkit/src/hooks/useError';

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
  const navigation = useNavigation();
  const route = useRoute();
  const { Span } = useError(Sentry);

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
    if (!transaction) { setTransaction(new Span('manual-vin-insertion', SpanConstants.operation.USER_TIME)); }
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
        Please fill the needed content on the prompt
      </Text>
      <Card.Actions style={styles.actions}>
        <Button mode="contained" color={colors.text} onPress={handleGoBack}>Go back</Button>
      </Card.Actions>
    </View>
  );
}
