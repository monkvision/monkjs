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
import * as config from '../local-config.json';
import { AppContainer } from './AppContainer';
import { authConfigs } from '../auth';
import { Page } from './pages';

const localConfig =
  process.env['REACT_APP_USE_LOCAL_CONFIG'] === 'true'
    ? (config as unknown as LiveConfig)
    : undefined;

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
