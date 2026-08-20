import { Outlet, useNavigate } from 'react-router-dom';
import {
  getEnvOrThrow,
  MonkProvider,
  MonkSearchParam,
  useMonkSearchParams,
} from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { LiveConfigAppProvider } from '@monkvision/common-ui-web';
import { LiveConfig } from '@monkvision/types';
import { getAuthConfig } from '@monkvision/network';
import config from '../local-config.json';
import configE2e from '../local-config-e2e.json';
import { AppContainer } from './AppContainer';
import { authConfigs } from '../auth';
import { Page } from './pages';

const getLocalConfig = (): LiveConfig | undefined => {
  if (process.env['VITE_USE_LOCAL_CONFIG'] === 'true') {
    return config as unknown as LiveConfig;
  }
  if (process.env['VITE_USE_LOCAL_E2E_CONFIG'] === 'true') {
    return { ...config, ...configE2e } as unknown as LiveConfig;
  }
  return undefined;
};

const localConfig = getLocalConfig();

export function App() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const monkSearchParams = useMonkSearchParams();

  return (
    <LiveConfigAppProvider
      id={monkSearchParams.get(MonkSearchParam.LIVE_CONFIG) ?? getEnvOrThrow('VITE_LIVE_CONFIG_ID')}
      localConfig={localConfig}
      apiDomain={getAuthConfig(authConfigs)?.apiDomain}
      thumbnailDomain={getAuthConfig(authConfigs)?.thumbnailDomain}
      onFetchAuthToken={() => navigate(Page.CREATE_INSPECTION)}
      onFetchLanguage={(lang) => i18n.changeLanguage(lang)}
      lang={i18n.language}
    >
      <MonkProvider>
        <AppContainer>
          <Outlet />
        </AppContainer>
      </MonkProvider>
    </LiveConfigAppProvider>
  );
}
