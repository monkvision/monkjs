import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@monkvision/common-ui-web';
import { isTokenExpired, isUserAuthorized, useAuth } from '@monkvision/network';
import { useLoadingState, useMonkApplicationState } from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import styles from './LogInPage.module.css';
import { Page } from '../pages';
import { REQUIRED_AUTHORIZATIONS } from '../../config';

function getLoginErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === 'Popup closed') {
      return 'login.errors.popup-closed';
    }
  }
  return 'login.errors.unknown';
}

export function LogInPage() {
  const [isExpired, setIsExpired] = useState(false);
  const loading = useLoadingState();
  const { authToken, inspectionId, setAuthToken } = useMonkApplicationState();
  const { handleError } = useMonitoring();
  const { login, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken && !isUserAuthorized(authToken, REQUIRED_AUTHORIZATIONS)) {
      loading.onError('login.errors.insufficient-authorization');
    }
    if (authToken && isTokenExpired(authToken)) {
      setIsExpired(true);
      setAuthToken(null);
    }
  }, [authToken, loading]);

  const handleLogin = () => {
    setIsExpired(false);
    loading.start();
    login()
      .then((token) => {
        if (isUserAuthorized(token, REQUIRED_AUTHORIZATIONS)) {
          loading.onSuccess();
          navigate(inspectionId ? Page.PHOTO_CAPTURE : Page.CREATE_INSPECTION);
        } else {
          loading.onError('login.errors.insufficient-authorization');
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
        <div className={styles['error-message']}>{t('login.errors.token-expired')}</div>
      )}
      {loading.error && <div className={styles['error-message']}>{t(loading.error)}</div>}
      {authToken ? (
        <Button primaryColor='alert' loading={loading} onClick={logout}>
          {t('login.actions.log-out')}
        </Button>
      ) : (
        <Button loading={loading} onClick={handleLogin}>
          {t('login.actions.log-in')}
        </Button>
      )}
    </div>
  );
}
