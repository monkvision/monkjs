import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, isUserAuthorized } from '@monkvision/network';
import { useMonkAppState } from '@monkvision/common';

/**
 * Props accepted by the AuthGuard component.
 */
export interface AuthGuardProps {
  /**
   * The URL to navigate to in case the user is not authorized to access this resource.
   */
  redirectTo: string;
}

/**
 * This component can be used in your application Routers (react-router-dom v6) to protect a given route and redirect
 * the user to another page if they are not authorized to access this resource.
 *
 * **Note : For this component to work properly, it must be the child of a `MonkAppStateProvider` component.**
 */
export function AuthGuard({ redirectTo, children }: PropsWithChildren<AuthGuardProps>) {
  const { authToken, loading, config } = useMonkAppState();

  if (loading.isLoading) {
    return null;
  }

  if (
    !authToken ||
    (config?.requiredApiPermissions &&
      !isUserAuthorized(authToken, config?.requiredApiPermissions)) ||
    isTokenExpired(authToken)
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
