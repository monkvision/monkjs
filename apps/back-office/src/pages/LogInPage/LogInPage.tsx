import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@monkvision/common-ui-web';
import { isTokenExpired, useAuth } from '@monkvision/network';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { Page } from '../pages';
import styles from './LogInPage.module.css';

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
    if (authToken && isTokenExpired(authToken)) {
      setIsExpired(true);
    }
  }, [authToken, loading]);

  const handleLogin = () => {
    setIsExpired(false);
    loading.start();
    login()
      .then(() => {
        loading.onSuccess();
        navigate(Page.LIVE_CONFIGS);
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
