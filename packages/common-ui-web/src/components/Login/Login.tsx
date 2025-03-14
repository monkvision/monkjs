import { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { decodeMonkJwt, isTokenExpired, isUserAuthorized, useAuth } from '@monkvision/network';
import {
  i18nWrap,
  useI18nSync,
  useLoadingState,
  useMonkAppState,
  useMonkTheme,
} from '@monkvision/common';
import { useMonitoring } from '@monkvision/monitoring';
import { useAnalytics } from '@monkvision/analytics';
import { Button } from '../Button';
import { i18nLogin } from './i18n';
import { styles } from './Login.styles';

/**
 * Props accepted by the Login component.
 */
export interface LoginProps {
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
   * Custom style applied to the main container of the page.
   */
  style?: CSSProperties;
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
 *
 * **Note : For this component to work properly, it must be the child of a `MonkAppStateProvider` component.**
 */
export const Login = i18nWrap(function Login({ onLoginSuccessful, lang, style = {} }: LoginProps) {
  useI18nSync(lang);
  const [isExpired, setIsExpired] = useState(false);
  const loading = useLoadingState();
  const { authToken, setAuthToken, config } = useMonkAppState();
  const { handleError, setUserId } = useMonitoring();
  const analytics = useAnalytics();
  const { login, logout } = useAuth();
  const { t } = useTranslation();
  const { rootStyles } = useMonkTheme();

  useEffect(() => {
    if (!authToken && !config?.allowManualLogin) {
      setAuthToken(null);
      setIsExpired(false);
      loading.onError('errors.missing-token');
    }
    if (
      config?.requiredApiPermissions &&
      authToken &&
      !isUserAuthorized(authToken, config.requiredApiPermissions)
    ) {
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
        if (
          config?.requiredApiPermissions &&
          !isUserAuthorized(token, config.requiredApiPermissions)
        ) {
          loading.onError('errors.insufficient-authorization');
        } else {
          loading.onSuccess();
          onLoginSuccessful?.();
          const userId = token ? decodeMonkJwt(token) : undefined;
          if (userId?.sub) {
            setUserId(userId.sub);
            analytics.setUserProperties({ authToken: userId.sub });
          }
        }
      })
      .catch((err) => {
        const message = getLoginErrorMessage(err);
        loading.onError(message);
        handleError(err);
      });
  };

  return (
    <div style={{ ...rootStyles, ...styles['container'], ...style }}>
      {isExpired && <div style={styles['errorMessage']}>{t('errors.token-expired')}</div>}
      {String(loading.error) && (
        <div style={styles['errorMessage']}>{t(String(loading.error))}</div>
      )}
      {authToken && config?.allowManualLogin && (
        <Button primaryColor='alert' loading={loading} onClick={logout}>
          {t('actions.log-out')}
        </Button>
      )}
      {!authToken && config?.allowManualLogin && (
        <Button loading={loading} onClick={handleLogin}>
          {t('actions.log-in')}
        </Button>
      )}
    </div>
  );
}, i18nLogin);
