import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import { authSlice } from 'store/slices/auth';

import monk from '@monkvision/corejs';
import { utils } from '@monkvision/toolkit';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, ResponseType } from 'expo-auth-session';

import discoveries from 'config/discoveries';

if (Platform.OS === 'web') { WebBrowser.maybeCompleteAuthSession(); }

const useProxy = Platform.select({
  native: true,
  default: false,
});

const redirectUri = makeRedirectUri({
  useProxy,
});

const scopes = ['openid', 'email', 'profile', 'read:current_user', 'update:current_user_metadata'];

export default function useSignIn(callbacks = {}) {
  const { onStart, onError, onSuccess } = callbacks;

  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const start = () => setIsLoading(true);
  const stop = () => setIsLoading(false);

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: monk.config.authConfig.clientId,
      scopes,
      redirectUri,
      extraParams: {
        audience: monk.config.authConfig.audience,
      },
    },
    discoveries,
  );

  const handleStart = useCallback(() => {
    try {
      if (request) {
        promptAsync({ useProxy });
        start();
        if (typeof onStart === 'function') { onStart(); }
      }
    } catch (err) {
      utils.log([`Error signing in: ${err}`], 'error');
      stop();
    }
  }, [onStart, promptAsync, request]);

  useEffect(() => {
    try {
      if (response?.type === 'success' && response.authentication?.accessToken) {
        const { accessToken } = response.authentication;
        monk.config.accessToken = accessToken;

        dispatch(authSlice.actions.update({
          ...response.authentication,
          isLoading: false,
          isSignedOut: false,
        }));

        if (typeof onSuccess === 'function') {
          stop();
          onSuccess(response);
        }
      } else if (typeof onError === 'function') {
        stop();
        setError(response);
        onError();
      }
    } catch (err) {
      setError(err);
      utils.log([`Error signing in: ${err}`], 'error');
      throw err;
    }
  }, [dispatch, onError, onSuccess, request, response]);

  return [handleStart, isLoading, error];
}
