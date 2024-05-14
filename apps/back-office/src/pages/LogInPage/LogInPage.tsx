import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@monkvision/common-ui-web';
import { isTokenExpired, isUserAuthorized, useAuth } from '@monkvision/network';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { Page } from '../pages';
import { REQUIRED_AUTHORIZATIONS } from '../../config';
import styles from './LogInPage.module.css';

const insufficientAuthErrorMsg =
  'You do not have the required authorizations to use this application. Please log out and use a different account.';

function getLoginErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === 'Popup closed') {
      return "Oops! We couldn't log you in because the popup was closed. Let's try again!";
    }
  }
  return "Oops! An unexpected error occurred during the log in. Let's try again!";
}

export function LogInPage() {
  const [isExpired, setIsExpired] = useState(false);
  const loading = useLoadingState();
  const { handleError } = useMonitoring();
  const { login, logout } = useAuth();
  const { authToken } = useMonkApplicationState();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken && !isUserAuthorized(authToken, REQUIRED_AUTHORIZATIONS)) {
      loading.onError(insufficientAuthErrorMsg);
    }
    if (authToken && isTokenExpired(authToken)) {
      setIsExpired(true);
    }
  }, [authToken, loading]);

  const handleLogin = () => {
    setIsExpired(false);
    loading.start();
    login()
      .then((token) => {
        if (isUserAuthorized(token, REQUIRED_AUTHORIZATIONS)) {
          loading.onSuccess();
          navigate(Page.LIVE_CONFIGS);
        } else {
          loading.onError(insufficientAuthErrorMsg);
        }
      })
      .catch((err) => {
        const message = getLoginErrorMessage(err);
        loading.onError(message);
        handleError(err);
      });
  };

  return (
    <div className={styles['container']}>
      {isExpired && (
        <div className={styles['error-message']}>
          Your authentication token is expired. Please log-in again.
        </div>
      )}
      {loading.error && <div className={styles['error-message']}>{loading.error}</div>}
      {authToken ? (
        <Button primaryColor='alert' loading={loading} onClick={logout}>
          Log Out
        </Button>
      ) : (
        <Button loading={loading} onClick={handleLogin}>
          Log In
        </Button>
      )}
    </div>
  );
}
