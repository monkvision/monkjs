import React, { useCallback, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { authSlice } from 'store/slices/auth';

import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';

import styles from '../styles';

WebBrowser.maybeCompleteAuthSession();
const useProxy = true;
const redirectUri = makeRedirectUri({
  useProxy,
});

const discovery = {
  authorizationEndpoint: `https://${Constants.manifest.extra.AUTH_DOMAIN}/authorize`,
};

export default function SignIn() {
  const dispatch = useDispatch();

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: Constants.manifest.extra.AUTH_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
    },
    discovery,
  );

  const handlePress = useCallback(() => {
    promptAsync({ useProxy });
  }, [promptAsync]);

  useEffect(() => {
    if (response && response.type === 'success') {
      const payload = {
        ...response.params,
        isLoading: false,
        isSignedOut: false,
      };

      dispatch(authSlice.actions.update(payload));
    }
  }, [dispatch, response]);

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
