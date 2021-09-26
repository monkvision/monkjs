import React, { useCallback, useState } from 'react';
import Constants from 'expo-constants';

import { useDispatch } from 'react-redux';
import useMinLoadingTime from 'hooks/useMinLoadingTime';

import { auth0Discovery } from 'config/discoveries';
import { revokeAsync } from 'expo-auth-session';
import { authSlice } from 'store/slices/auth';
import useAuth from 'hooks/useAuth';

import { Button } from 'react-native-paper';

export default function SignOut() {
  const dispatch = useDispatch();
  const { accessToken, tokenType } = useAuth();

  const [isLoggingOut, setLoggingOut] = useState(false);
  const isLoading = useMinLoadingTime(isLoggingOut);

  const handlePress = useCallback(async () => {
    setLoggingOut(true);
    const clientId = Constants.manifest.extra.AUTH_CLIENT_ID;

    try {
      await revokeAsync({
        client_id: clientId,
        token: accessToken,
        tokenType,
      }, auth0Discovery);

      dispatch(authSlice.actions.reset({ isSignedOut: true }));
    } catch (e) {
      setLoggingOut(false);
    }
  }, [accessToken, dispatch, tokenType]);

  return (
    <Button
      onPress={handlePress}
      loading={isLoading}
    >
      Sign out
    </Button>
  );
}
