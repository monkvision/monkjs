import { PropsWithChildren, useEffect } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { STORAGE_KEY_AUTH_TOKEN } from '@monkvision/common';
import { getAuthConfig, isTokenValid } from './token';
import { AuthConfig } from './authProvider.types';

function AuthValidator({ clientId }: { clientId: string }) {
  const { logout } = useAuth0();

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);

    if (!isTokenValid(clientId) && storedToken) {
      localStorage.removeItem(STORAGE_KEY_AUTH_TOKEN);
      logout({ logoutParams: { returnTo: window.location.href } });
    }
  }, [clientId, logout]);

  return null;
}

/**
 * Props accepted by the AuthProvider component.
 */
export interface AuthProviderProps {
  /**
   * List of Auth0 configurations to choose from based on URL parameters.
   */
  configs: AuthConfig[];
}

/**
 * Authentication provider that selects the appropriate Auth0 configuration based on URL parameters.
 */
export function AuthProvider({ configs, children }: PropsWithChildren<AuthProviderProps>) {
  const config = getAuthConfig(configs);

  if (!config) {
    return <>{children}</>;
  }

  return (
    <Auth0Provider
      domain={config.domain}
      clientId={config.clientId}
      authorizationParams={config.authorizationParams}
      context={config.context}
    >
      <AuthValidator clientId={config.clientId} />
      {children}
    </Auth0Provider>
  );
}
