import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';
import { useMonkAppParams } from '@monkvision/common';
import { isTokenExpired, isUserAuthorized } from '@monkvision/network';
import { Page } from '../../pages';
import { REQUIRED_AUTHORIZATIONS } from '../../config';

export function AuthGuard({ children }: PropsWithChildren<unknown>) {
  const { authToken } = useMonkAppParams();

  if (
    !authToken ||
    !isUserAuthorized(authToken, REQUIRED_AUTHORIZATIONS) ||
    isTokenExpired(authToken)
  ) {
    return <Navigate to={Page.LOG_IN} replace />;
  }

  return <>{children}</>;
}
