import { useSentry, SentryConstants } from '@monkvision/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sentry from 'config/sentry';
import { TokenResponse } from 'expo-auth-session/src/TokenRequest';
import { ASYNC_STORAGE_AUTH_KEY, onAuthenticationSuccess } from 'hooks/useSignIn';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function SilentAuth() {
  const [hasBeenDone, setHasBeenDone] = useState(false);
  const dispatch = useDispatch();
  const { errorHandler } = useSentry(Sentry);

  useEffect(() => {
    if (!hasBeenDone) {
      AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY).then((value) => {
        if (value != null) {
          const authentication = JSON.parse(value);
          authentication.issuedAt = Number(authentication.issuedAt);
          authentication.expiresIn = Number(authentication.expiresIn);
          if (TokenResponse.isTokenFresh(authentication) && !!authentication.accessToken) {
            onAuthenticationSuccess(authentication, dispatch);
          } else {
            AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY)
              .catch((err) => errorHandler(err, SentryConstants.type.APP));
          }
          setHasBeenDone(true);
        }
      }).catch((err) => errorHandler(err, SentryConstants.type.APP));
    }
  }, []);

  return null;
}
