import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, isUserAuthorized, MonkApiPermission } from '@monkvision/network';
import { useMonkApplicationState } from '@monkvision/common';

/**
 * Props accepted by the AuthGuard component.
 */
export interface AuthGuardProps {
  /**
   * The URL to navigate to in case the user is not authorized to access this resource.
   */
  redirectTo: string;
  /**
   * The list of required permissions that the user needs to have to access the given page.
   */
  requiredPermissions?: MonkApiPermission[];
}

/**
 * This component can be used in your application Routers (react-router-dom v6) to protect a given route and redirect
 * the user to another page if they are not authorized to access this resource.
 *
 * **Note : For this component to work properly, it must be the child of a `MonkApplicationStateProvider` component.**
 */
export function AuthGuard({
  redirectTo,
  requiredPermissions,
  children,
}: PropsWithChildren<AuthGuardProps>) {
  const { authToken, loading } = useMonkApplicationState();

  if (loading.isLoading) {
    return null;
  }

  if (
    !authToken ||
    (requiredPermissions && !isUserAuthorized(authToken, requiredPermissions)) ||
    isTokenExpired(authToken)
  ) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
