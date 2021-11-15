import React, { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import { authSlice } from 'store/slices/auth';

import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

import discoveries from 'config/discoveries';

import styles from '../styles';

if (Platform.OS === 'web') { WebBrowser.maybeCompleteAuthSession(); }

const useProxy = Platform.select({
  native: true,
  default: false,
});

const redirectUri = makeRedirectUri({
  useProxy,
});

export default function SignIn() {
  const dispatch = useDispatch();

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: Constants.manifest.extra.AUTH_CLIENT_ID,
      scopes: ['openid', 'email', 'profile', 'read:current_user', 'update:current_user_metadata'],
      redirectUri,
      extraParams: {
        audience: Constants.manifest.extra.AUTH_AUDIENCE,
      },
    },
    discoveries,
  );

  const handlePress = useCallback(() => {
    promptAsync({ useProxy });
  }, [promptAsync]);

  useEffect(() => {
    if (response?.type === 'success') {
      if (response.authentication?.accessToken) {
        dispatch(authSlice.actions.update({
          ...response.authentication,
          isLoading: false,
          isSignedOut: false,
        }));
      }
    }
  }, [dispatch, request, response]);

  return (
    <Button
      icon={(props) => <MaterialCommunityIcons name="account-circle" {...props} />}
      size="large"
      mode="contained"
      disabled={!request}
      onPress={handlePress}
      style={styles.signIn}
    >
      Sign In
    </Button>
  );
}
