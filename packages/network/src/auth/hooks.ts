import { useAuth0 } from '@auth0/auth0-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { STORAGE_KEY_AUTH_TOKEN, useMonkAppParams } from '@monkvision/common';

/**
 * Parameters of the `useAuth` hook.
 */
export interface UseAuthParams {
  /**
   * Boolean indicating if the authentication token should be stored in the local storage or not.
   *
   * @default true
   */
  storeToken?: boolean;
}

/**
 * Handle used to manage the authentication state of a Monk app using the `useAuth` hook.
 */
export interface MonkAuthHandle {
  /**
   * The current authentication token. This value is `null` if the user is not logged in.
   *
   * **Warning : If, like in most Monk apps, you plan on using both the `useMonkAppParams` and the `useAuth` hooks, then
   * only the token stored and returned by the `useMonkAppParams` should be used. The token of this hook must only be
   * used when using the `useAuth` hook only.**
   */
  authToken: string | null;
  /**
   * Callback used to ask the user to log in using an Auth0 pop-up window. This callback returns the resulting token if
   * the process was successful, but it also automatically stores the token in the local storage (if `storeToken` is
   * `true`) and updates the current auth token value (both in this hook and in the `useMonkAppParams` hook.)
   */
  login: () => Promise<string | null>;
  /**
   * Callback used to log out the user, both from this application and from Auth0. It also automatically removes the
   * token in the local storage (if `storeToken` is `true`) and clears the current auth token value (both in this hook
   * and in the `useMonkAppParams` hook.)
   */
  logout: () => Promise<void>;
}

const defaultOptions = {
  storeToken: true,
};

/**
 * Custom hook used to easily handle authentication in Monk applications. It stores the current user's authentication
 * token, and returns callbacks used to log in and out of the application using Auth0 pop-ups.
 *
 * **Warning : If, like in most Monk apps, you plan on using both the `useMonkAppParams` and the `useAuth` hooks, then
 * only the token stored and returned by the `useMonkAppParams` should be used. The token of this hook must only be
 * used when using the `useAuth` hook only.**
 */
export function useAuth(params?: UseAuthParams): MonkAuthHandle {
  const options = { ...defaultOptions, ...(params ?? {}) };
  const { getAccessTokenWithPopup, logout } = useAuth0();
  const { setAuthToken: setAuthTokenParam } = useMonkAppParams();
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (options.storeToken) {
      const token = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
      if (token) {
        setAuthTokenParam(token);
        setAuthToken(token);
      }
    }
  }, []);

  const handleLogin = useCallback(async () => {
    const token = await getAccessTokenWithPopup();
    if (token) {
      setAuthTokenParam(token);
      setAuthToken(token);
      if (options.storeToken) {
        localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
      }
      return token;
    }
    return null;
  }, [getAccessTokenWithPopup, options.storeToken, setAuthTokenParam]);

  const handleLogout = useCallback(async () => {
    setAuthTokenParam(null);
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    await logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout, setAuthTokenParam]);

  return useMemo(
    () => ({
      authToken,
      login: handleLogin,
      logout: handleLogout,
    }),
    [authToken, handleLogin, handleLogout],
  );
}
