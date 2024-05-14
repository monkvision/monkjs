import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { isTokenExpired, isUserAuthorized } from '@monkvision/network';
import { useMonkApplicationState } from '@monkvision/common';
import { Page } from '../../pages';
import { REQUIRED_AUTHORIZATIONS } from '../../config';

export function AuthGuard({ children }: PropsWithChildren<unknown>) {
  const { authToken, loading } = useMonkApplicationState();

  if (loading.isLoading) {
    return null;
  }

  if (
    !authToken ||
    !isUserAuthorized(authToken, REQUIRED_AUTHORIZATIONS) ||
    isTokenExpired(authToken)
  ) {
    return <Navigate to={Page.LOG_IN} replace />;
  }

  return <>{children}</>;
}
