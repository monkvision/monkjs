import { useError } from '@monkvision/toolkit';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import monk from '@monkvision/corejs';
import discoveries from 'config/discoveries';

import { revokeAsync } from 'expo-auth-session';
import { authSlice } from 'store/slices/auth';

export default function useAuth() {
  const dispatch = useDispatch();

  const auth = useSelector((state) => state.auth);
  const { accessToken, tokenType } = auth;
  const isAuthenticated = useMemo(() => Boolean(accessToken), [accessToken]);
  const errorHandler = useError();

  // signOut
  const [isLoggingOut, setLoggingOut] = useState(false);

  const signOut = useCallback(async () => {
    setLoggingOut(true);
    try {
      await revokeAsync({
        clientId: monk.config.authConfig.clientId,
        token: accessToken,
        tokenTypeHint: tokenType,
      }, discoveries);

      dispatch(authSlice.actions.reset({ isSignedOut: true }));
    } catch (e) {
      errorHandler(e);
      setLoggingOut(false);
    }
  }, [accessToken, dispatch, tokenType]);

  return { ...auth, signOut, isLoggingOut, isAuthenticated };
}
