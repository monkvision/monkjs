import monk, { useMonitoring } from '@monkvision/corejs';
import AsyncStorage from '@react-native-async-storage/async-storage';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

import discoveries from 'config/discoveries';
import { makeRedirectUri, Prompt, ResponseType, revokeAsync, useAuthRequest } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

import { useDispatch } from 'react-redux';
import { authSlice } from 'store/slices/auth';

if (Platform.OS === 'web') { WebBrowser.maybeCompleteAuthSession(); }

const useProxy = Platform.select({
  native: true,
  default: false,
});

const redirectUri = makeRedirectUri({
  useProxy,
});

const scopes = ['openid', 'email', 'profile', 'read:current_user', 'update:current_user_metadata'];

export const ASYNC_STORAGE_AUTH_KEY = '@auth_Storage';

export async function dispatchSignOut(dispatch) {
  const revokeResponse = await revokeAsync(
    {
      clientId: monk.config.authConfig.clientId,
      token: monk.config?.accessToken,
    },
    discoveries
  );

  if (revokeResponse) {
    dispatch(authSlice.actions.update({
      accessToken: null,
      isLoading: false,
      isSignedOut: true,
    }));
  }
}

export function onAuthenticationSuccess(authentication, dispatch) {
  const { accessToken } = authentication;
  monk.config.accessToken = accessToken;

  dispatch(authSlice.actions.update({
    ...authentication,
    isLoading: false,
    isSignedOut: false,
  }));
}

export default function useSignIn(callbacks = {}) {
  const { onStart, onError, onSuccess } = callbacks;

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const start = () => setIsLoading(true);
  const stop = () => setIsLoading(false);
  const { errorHandler, setMonitoringUser } = useMonitoring();

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Token,
      clientId: monk.config.authConfig.clientId,
      scopes,
      redirectUri,
      prompt: Prompt.Login,
      extraParams: {
        audience: monk.config.authConfig.audience,
      },
    },
    discoveries,
  );

  const handleStart = useCallback(() => {
    if (request) {
      start();
      promptAsync({ useProxy });
      if (typeof onStart === 'function') { onStart(); }
    }
  }, [onStart, promptAsync, request]);

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      stop();
      onAuthenticationSuccess(response.authentication, dispatch);

      const loggedInUser = jwt_decode(response.authentication.accessToken);
      if (loggedInUser && loggedInUser.sub) {
        setMonitoringUser(loggedInUser.sub);
      }

      const dataToStore = JSON.stringify(response.authentication);
      AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, dataToStore).then(() => {
        if (typeof onSuccess === 'function') { onSuccess(response); }
      }).catch((err) => {
        errorHandler(err);
        if (typeof onSuccess === 'function') { onSuccess(response); }
      });
    }
  }, [dispatch, onSuccess, request, response]);

  useEffect(() => {
    if (response?.type === 'error') {
      stop();

      if (typeof onError === 'function') {
        onError(response, request);
      } else { throw Error('Error while signing in'); }
    }
  }, [onError, request, response]);

  useEffect(() => {
    if (response?.type === 'dismiss') {
      stop();
    }
  }, [request, response]);

  return [handleStart, isLoading];
}
