import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useMonkApplicationState } from '@monkvision/common';
import { isTokenExpired, isUserAuthorized } from '@monkvision/network';
import { Page } from '../../pages';
import { REQUIRED_AUTHORIZATIONS } from '../../config';

export function AuthGuard({ children }: PropsWithChildren<unknown>) {
  const { authToken } = useMonkApplicationState();

  if (
    !authToken ||
    !isUserAuthorized(authToken, REQUIRED_AUTHORIZATIONS) ||
    isTokenExpired(authToken)
  ) {
    return <Navigate to={Page.LOG_IN} replace />;
  }

  return <>{children}</>;
}
