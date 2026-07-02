import { Outlet, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { getEnvOrThrow, MonkProvider } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { LiveConfigAppProvider } from '@monkvision/common-ui-web';
import { LiveConfig } from '@monkvision/types';
import { Page } from '../pages';
import config from '../local-config.json';
import configE2e from '../local-config-e2e.json';
import { AppContainer } from './AppContainer';

const getLocalConfig = (): LiveConfig | undefined => {
  if (process.env['REACT_APP_USE_LOCAL_CONFIG'] === 'true') {
    return config as unknown as LiveConfig;
  }
  if (process.env['REACT_APP_USE_LOCAL_E2E_CONFIG'] === 'true') {
    return { ...config, ...configE2e } as unknown as LiveConfig;
  }

  return undefined;
};

export function App() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const localConfig = useMemo(() => getLocalConfig(), []);

  return (
    <LiveConfigAppProvider
      id={getEnvOrThrow('REACT_APP_LIVE_CONFIG_ID')}
      localConfig={localConfig}
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
