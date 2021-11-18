import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';

import { config } from '@monkvision/corejs';
import discoveries from 'config/discoveries';
import { useFakeActivity } from '@monkvision/react-native-views';

import { revokeAsync } from 'expo-auth-session';
import { authSlice } from 'store/slices/auth';
import useAuth from 'hooks/useAuth';

import { Button } from 'react-native-paper';

export default function SignOut(props) {
  const dispatch = useDispatch();
  const { accessToken, tokenType } = useAuth();

  const [isLoggingOut, setLoggingOut] = useState(false);
  const [isLoading] = useFakeActivity(isLoggingOut);

  const handlePress = useCallback(async () => {
    setLoggingOut(true);

    try {
      await revokeAsync({
        clientId: config.authConfig.clientId,
        token: accessToken,
        tokenTypeHint: tokenType,
      }, discoveries);

      dispatch(authSlice.actions.reset({ isSignedOut: true }));
    } catch (e) {
      setLoggingOut(false);
    }
  }, [accessToken, dispatch, tokenType]);

  return (
    <Button onPress={handlePress} loading={isLoading} {...props}>
      Sign out
    </Button>
  );
}
