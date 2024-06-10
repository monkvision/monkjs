import {
  i18nWrap,
  MonkAppStateProvider,
  MonkAppStateProviderProps,
  useI18nSync,
  useLoadingState,
} from '@monkvision/common';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { CaptureAppConfig } from '@monkvision/types';
import { MonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useTranslation } from 'react-i18next';
import { styles } from './LiveConfigAppProvider.styles';
import { Spinner } from '../Spinner';
import { i18nLiveConfigAppProvider } from './i18n';
import { Button } from '../Button';

/**
 * Props accepted by the LiveConfigAppProvider component.
 */
export interface LiveConfigAppProviderProps extends Omit<MonkAppStateProviderProps, 'config'> {
  /**
   * The ID of the application's live configuration.
   */
  id: string;
  /**
   * Use this prop to configure a configuration on your local environment. Using this prop will prevent this component
   * from fetching a local config from the API.
   */
  localConfig?: CaptureAppConfig;
  /**
   * The language used by this component.
   *
   * @default en
   */
  lang?: string | null;
}

/**
 * This component is used in Monk web applications that support Live Configurations. It acts as both an automatic
 * live configuration fetcher and a MonkAppStateProvider.
 *
 * @see MonkAppStateProvider
 */
export const LiveConfigAppProvider = i18nWrap<
  unknown,
  PropsWithChildren<LiveConfigAppProviderProps>
>(
  ({
    id,
    localConfig,
    lang,
    children,
    ...passThroughProps
  }: PropsWithChildren<LiveConfigAppProviderProps>) => {
    useI18nSync(lang);
    const loading = useLoadingState(true);
    const [config, setConfig] = useState<CaptureAppConfig | null>(null);
    const { handleError } = useMonitoring();
    const { t } = useTranslation();

    const fetchLiveConfig = useCallback(() => {
      if (localConfig) {
        loading.onSuccess();
        setConfig(localConfig);
        return;
      }
      loading.start();
      setConfig(null);
      MonkApi.getLiveConfig(id)
        .then((result) => {
          loading.onSuccess();
          setConfig(result);
        })
        .catch((err) => {
          handleError(err);
          loading.onError();
        });
    }, [id, localConfig]);

    useEffect(() => {
      fetchLiveConfig();
    }, [fetchLiveConfig]);

    if (loading.isLoading || loading.error || !config) {
      return (
        <div style={styles['container']}>
          {loading.isLoading && <Spinner primaryColor='primary' size={70} />}
          {!loading.isLoading && (
            <>
              <div style={styles['errorMessage']}>{t('error.message')}</div>
              <Button variant='outline' icon='refresh' onClick={fetchLiveConfig}>
                {t('error.retry')}
              </Button>
            </>
          )}
        </div>
      );
    }

    return (
      <MonkAppStateProvider config={config} {...passThroughProps}>
        {children}
      </MonkAppStateProvider>
    );
  },
  i18nLiveConfigAppProvider,
);
