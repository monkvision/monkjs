import { Outlet, useNavigate } from 'react-router-dom';
import { getEnvOrThrow, MonkProvider } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { LiveConfigAppProvider } from '@monkvision/common-ui-web';
import { CaptureAppConfig } from '@monkvision/types';
import { Page } from '../pages';
import * as config from '../local-config.json';
import { AppContainer } from './AppContainer';

const localConfig =
  process.env['REACT_APP_USE_LOCAL_CONFIG'] === 'true' ? (config as CaptureAppConfig) : undefined;

export function App() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

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
