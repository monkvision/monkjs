import { Auth0ContextInterface, useAuth0 } from '@auth0/auth0-react';
import { Context, useCallback, useEffect } from 'react';
import { STORAGE_KEY_AUTH_TOKEN, useMonkAppState, useObjectMemo } from '@monkvision/common';

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
  /**
   * Optional custom Auth0 context that will be passed through to the `useAuth0` hook.
   */
  context?: Context<Auth0ContextInterface>;
}

/**
 * Handle used to manage the authentication state of a Monk app using the `useAuth` hook.
 */
export interface MonkAuthHandle {
  /**
   * Callback used to ask the user to log in using an Auth0 pop-up window. This callback returns the resulting token if
   * the process was successful, but it also automatically stores the token in the local storage (if `storeToken` is
   * `true`) and updates the current auth token value in the `useMonkAppState` hook.
   */
  login: () => Promise<string | null>;
  /**
   * Callback used to log out the user, both from this application and from Auth0. It also automatically removes the
   * token in the local storage (if `storeToken` is `true`) and clears the current auth token value in the
   * `useMonkAppState` hook.
   */
  logout: () => Promise<void>;
}

const defaultOptions = {
  storeToken: true,
};

/**
 * Custom hook used to easily handle authentication in Monk applications. It stores the current user's authentication
 * token in the `useMonkAppState` hook, and returns callbacks used to log in and out of the application using Auth0
 * pop-ups.
 */
export function useAuth(params?: UseAuthParams): MonkAuthHandle {
  const options = { ...defaultOptions, ...(params ?? {}) };
  const { getAccessTokenWithPopup, logout } = useAuth0(params?.context);
  const { setAuthToken } = useMonkAppState();

  useEffect(() => {
    if (options.storeToken) {
      const token = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
      if (token) {
        setAuthToken(token);
      }
    }
  }, []);

  const handleLogin = useCallback(async () => {
    const token = await getAccessTokenWithPopup();
    if (token) {
      setAuthToken(token);
      if (options.storeToken) {
        localStorage.setItem(STORAGE_KEY_AUTH_TOKEN, token);
      }
      return token;
    }
    return null;
  }, [getAccessTokenWithPopup, options.storeToken, setAuthToken]);

  const handleLogout = useCallback(async () => {
    setAuthToken(null);
    localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
    await logout({ logoutParams: { returnTo: window.location.origin } });
  }, [logout, setAuthToken]);

  return useObjectMemo({
    login: handleLogin,
    logout: handleLogout,
  });
}
