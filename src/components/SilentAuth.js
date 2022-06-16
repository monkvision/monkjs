import { useError } from '@monkvision/toolkit';
import Sentry from 'config/sentry';
import { TokenResponse } from 'expo-auth-session/src/TokenRequest';
import { ASYNC_STORAGE_AUTH_KEY, onAuthenticationSuccess } from 'hooks/useSignIn';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as LocalStorage from 'config/localStorage';

export default function SilentAuth() {
  const [hasBeenDone, setHasBeenDone] = useState(false);
  const dispatch = useDispatch();
  const { errorHandler, Constants } = useError(Sentry);

  useEffect(() => {
    if (!hasBeenDone) {
      LocalStorage.getItem(ASYNC_STORAGE_AUTH_KEY).then((value) => {
        if (value != null) {
          const authentication = JSON.parse(value);
          authentication.issuedAt = Number(authentication.issuedAt);
          authentication.expiresIn = Number(authentication.expiresIn);
          if (TokenResponse.isTokenFresh(authentication) && !!authentication.accessToken) {
            onAuthenticationSuccess(authentication, dispatch);
          } else {
            LocalStorage.removeItem(ASYNC_STORAGE_AUTH_KEY)
              .catch((err) => errorHandler(err, Constants.type.APP));
          }
          setHasBeenDone(true);
        }
      }).catch((err) => errorHandler(err, Constants.type.APP));
    }
  }, []);

  return null;
}
