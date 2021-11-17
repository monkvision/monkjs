import auth0Discovery from 'config/discoveries';
import { revokeAsync } from 'expo-auth-session';
import Constants from 'expo-constants';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authSlice } from 'store/slices/auth';

export default function useAuth() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isAuthenticated = useMemo(() => Boolean(auth.accessToken), [auth]);

  // signout
  const [isLoggingOut, setLoggingOut] = useState(false);

  const signout = useCallback(async () => {
    setLoggingOut(true);
    const clientId = Constants.manifest.extra.AUTH_CLIENT_ID;
    try {
      await revokeAsync(
        {
          client_id: clientId,
          token: auth.accessToken,
          tokenType: auth.tokenType,
        },
        auth0Discovery,
      );

      dispatch(authSlice.actions.reset({ isSignedOut: true }));
    } catch (e) {
      setLoggingOut(false);
    }
  }, [auth.accessToken, auth.tokenType, dispatch]);

  return { ...auth, signout, isLoggingOut, isAuthenticated };
}
