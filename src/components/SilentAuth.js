import AsyncStorage from '@react-native-async-storage/async-storage';
import { TokenResponse } from 'expo-auth-session/src/TokenRequest';
import { ASYNC_STORAGE_AUTH_KEY, onAuthenticationSuccess } from 'hooks/useSignIn';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useMonitoring } from '@monkvision/corejs';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';

export default function SilentAuth() {
  const [hasBeenDone, setHasBeenDone] = useState(false);
  const dispatch = useDispatch();
  const { errorHandler, setMonitoringUser } = useMonitoring();

  useEffect(() => {
    if (!hasBeenDone) {
      AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY).then((value) => {
        if (value != null) {
          const authentication = JSON.parse(value);
          authentication.issuedAt = Number(authentication.issuedAt);
          authentication.expiresIn = Number(authentication.expiresIn);
          if (TokenResponse.isTokenFresh(authentication) && !!authentication.accessToken) {
            const loggedInUser = jwt_decode(authentication.accessToken);
            if (loggedInUser && loggedInUser.sub) {
              setMonitoringUser(loggedInUser.sub);
            }

            onAuthenticationSuccess(authentication, dispatch);
          } else {
            AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY)
              .catch((err) => {
                errorHandler(err);
              });
          }
          setHasBeenDone(true);
        }
      }).catch((err) => {
        errorHandler(err);
      });
    }
  }, []);

  return null;
}
