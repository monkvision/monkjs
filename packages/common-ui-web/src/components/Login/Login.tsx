import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isTokenExpired, isUserAuthorized, MonkApiPermission, useAuth } from '@monkvision/network';
import {
  i18nWrap,
  useI18nSync,
  useLoadingState,
  useMonkApplicationState,
  useMonkTheme,
} from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { Button } from '../Button';
import { i18nLoginPage } from './i18n';
import { styles } from './Login.styles';

/**
 * Props accepted by the Login component.
 */
export interface LoginProps {
  /**
   * Boolean indicating if manual login by the user should be allowed. If this prop is set to `false`, we never display
   * a login button to the user.
   *
   * @default true
   */
  allowManualLogin?: boolean;
  /**
   * Callback called when the user successfully logs in.
   */
  onLoginSuccessful?: () => void;
  /**
   * The language used by this component.
   *
   * @default en
   */
  lang?: string | null;
  /**
   * A list of required permissions to access the application.
   */
  requiredPermissions?: MonkApiPermission[];
}

function getLoginErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    if (err.message === 'Popup closed') {
      return 'errors.popup-closed';
    }
  }
  return 'errors.unknown';
}

/**
 * This component is a ready-to-use Login page that is used throughout the different Monk webapps to handle
 * authentication.
 */
export const Login = i18nWrap(
  ({ allowManualLogin = true, onLoginSuccessful, lang, requiredPermissions }: LoginProps) => {
    useI18nSync(lang);
    const [isExpired, setIsExpired] = useState(false);
    const loading = useLoadingState();
    const { authToken, setAuthToken } = useMonkApplicationState();
    const { handleError } = useMonitoring();
    const { login, logout } = useAuth();
    const { t } = useTranslation();
    const { rootStyles } = useMonkTheme();

    useEffect(() => {
      if (!authToken && !allowManualLogin) {
        setAuthToken(null);
        setIsExpired(false);
        loading.onError('errors.missing-token');
      }
      if (requiredPermissions && authToken && !isUserAuthorized(authToken, requiredPermissions)) {
        loading.onError('errors.insufficient-authorization');
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
          if (requiredPermissions && !isUserAuthorized(token, requiredPermissions)) {
            loading.onError('errors.insufficient-authorization');
          } else {
            loading.onSuccess();
            onLoginSuccessful?.();
          }
        })
        .catch((err) => {
          const message = getLoginErrorMessage(err);
          loading.onError(message);
          handleError(err);
        });
    };

    return (
      <div style={{ ...rootStyles, ...styles['container'] }}>
        {isExpired && <div style={styles['error-message']}>{t('errors.token-expired')}</div>}
        {loading.error && <div style={styles['error-message']}>{t(loading.error)}</div>}
        {authToken && allowManualLogin && 'hi'}
        {authToken && allowManualLogin && (
          <Button primaryColor='alert' loading={loading} onClick={logout}>
            {t('actions.log-out')}
          </Button>
        )}
        {!authToken && allowManualLogin && (
          <Button loading={loading} onClick={handleLogin}>
            {t('actions.log-in')}
          </Button>
        )}
      </div>
    );
  },
  i18nLoginPage,
);
