import { utils } from '@monkvision/toolkit';
import React, { useCallback, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Button, Paragraph, Title, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';
import { useMonitoring } from '@monkvision/corejs';

import * as names from 'screens/names';

import useAuth from 'hooks/useAuth';
import useSignIn from 'hooks/useSignIn';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: utils.styles.spacing(2),
  },
  p: {
    textAlign: 'center',
  },
  button: {
    marginTop: utils.styles.spacing(2),
  },
});

export default function SignIn() {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const { height } = useWindowDimensions();
  const { colors, loaderDotsColors } = useTheme();
  const { errorHandler } = useMonitoring();
  const { t } = useTranslation();

  const route = useRoute();
  const { inspectionId, afterSignin, ...rest } = route.params || {};

  const [authError, setAuthError] = useState(false);
  const [signIn, isSigningIn] = useSignIn({
    onStart: () => { utils.log(['[Click] Signing in']); },
    onError: (err) => {
      setAuthError(true);
      utils.log(['[Event] Sign in failed']);
      errorHandler(err);
    },
  });

  const handleGoBack = useCallback(
    () => navigation.navigate(names.LANDING),
    [navigation],
  );

  const handleNext = useCallback(
    () => navigation.navigate(afterSignin || names.INSPECTION_CREATE, { inspectionId, ...rest }),
    [navigation, inspectionId, rest],
  );

  if (isAuthenticated) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>{t('signin.success.title')}</Title>
        <Paragraph style={styles.p}>
          {t('signin.success.message')}
        </Paragraph>
        <Button mode="contained" color={colors.primary} style={styles.button} onPress={handleNext}>
          {t('signin.success.button')}
        </Button>
      </View>
    );
  }

  if (isSigningIn) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Loader
          texts={[
            t('signin.loader.signingIn'),
            t('signin.loader.authenticating'),
            t('signin.loader.robot'),
            t('signin.loader.loading'),
          ]}
          colors={loaderDotsColors}
        />
      </View>
    );
  }

  if (authError === true) {
    return (
      <View style={[styles.root, { backgroundColor: colors.background, height }]}>
        <Title>{t('signin.error.title')}</Title>
        <Paragraph style={styles.p}>
          {t('signin.error.message')}
        </Paragraph>
        <Button style={styles.button} onPress={handleGoBack}>
          {t('signin.error.button')}
        </Button>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.background, height }]}>
      <Title>{t('signin.authRequested.title')}</Title>
      <Paragraph style={styles.p}>
        {t('signin.authRequested.message')}
      </Paragraph>
      <Button mode="contained" style={styles.button} onPress={signIn}>{t('signin.authRequested.button')}</Button>
    </View>
  );
}
