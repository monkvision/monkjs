import {
  MonkAppStateProvider,
  MonkAppStateProviderProps,
  useAsyncEffect,
  useI18nSync,
  useLoadingState,
} from '@monkvision/common';
import { PropsWithChildren, useState } from 'react';
import { LiveConfig } from '@monkvision/types';
import { MonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { styles } from './LiveConfigAppProvider.styles';
import { Spinner } from '../Spinner';
import { Button } from '../Button';

function validateRequiredDomains(
  apiDomain: string | undefined,
  thumbnailDomain: string | undefined,
  configId: string,
): Error | null {
  if (!apiDomain) {
    return new Error(
      `Missing required apiDomain: provide it as a LiveConfigAppProvider prop or define it in the JSON live config file: "${configId}".`,
    );
  }
  if (!thumbnailDomain) {
    return new Error(
      `Missing required thumbnailDomain: provide it as a LiveConfigAppProvider prop or define it in the JSON live config file: "${configId}".`,
    );
  }
  return null;
}

/**
 * Props accepted by the LiveConfigAppProvider component.
 */
export interface LiveConfigAppProviderProps extends Omit<MonkAppStateProviderProps, 'config'> {
  /**
   * The ID of the application's live configuration.
   */
  id: string;
  /**
   * The API domain used to communicate with the API.
   */
  apiDomain?: string;
  /**
   * The domain used to fetch image thumbnails (served by the image_resize microservice).
   */
  thumbnailDomain?: string;
  /**
   * Use this prop to configure a configuration on your local environment. Using this prop will prevent this component
   * from fetching a local config from the API.
   */
  localConfig?: LiveConfig;
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
export function LiveConfigAppProvider({
  id,
  apiDomain,
  thumbnailDomain,
  localConfig,
  lang,
  children,
  ...passThroughProps
}: PropsWithChildren<LiveConfigAppProviderProps>) {
  useI18nSync(lang);
  const loading = useLoadingState(true);
  const [config, setConfig] = useState<LiveConfig | null>(null);
  const { handleError } = useMonitoring();
  const [retry, setRetry] = useState(0);

  useAsyncEffect(
    () => {
      if (localConfig) {
        return Promise.resolve(localConfig);
      }
      loading.start();
      setConfig(null);
      return MonkApi.getLiveConfig(id);
    },
    [id, localConfig, retry],
    {
      onResolve: (result: LiveConfig) => {
        loading.onSuccess();
        const finalApiDomain = result.apiDomain ?? apiDomain;
        const finalThumbnailDomain = result.thumbnailDomain ?? thumbnailDomain;

        const missingDomain = validateRequiredDomains(finalApiDomain, finalThumbnailDomain, id);
        if (missingDomain) {
          handleError(missingDomain);
          loading.onError();
          return;
        }

        setConfig({ ...result, apiDomain: finalApiDomain, thumbnailDomain: finalThumbnailDomain });
      },
      onReject: (err) => {
        handleError(err);
        loading.onError();
      },
    },
  );

  if (loading.isLoading || loading.error || !config) {
    return (
      <div style={styles['container']}>
        {loading.isLoading && <Spinner primaryColor='primary' size={70} />}
        {!loading.isLoading && (
          <>
            <div style={styles['errorMessage']} data-testid='error-msg'>
              Unable to fetch application configuration. Please try again in a few minutes.
            </div>
            <Button variant='outline' icon='refresh' onClick={() => setRetry((value) => value + 1)}>
              Retry
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
}
