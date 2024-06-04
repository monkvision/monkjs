import { Outlet, useNavigate } from 'react-router-dom';
import { MonkAppStateProvider, MonkProvider, useMonkTheme } from '@monkvision/common';
import { useTranslation } from 'react-i18next';
import { Page } from '../pages';
import { AppConfig } from '../config';

export function App() {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { rootStyles } = useMonkTheme();

  return (
    <MonkAppStateProvider
      config={AppConfig}
      onFetchAuthToken={() => navigate(Page.CREATE_INSPECTION)}
      onFetchLanguage={(lang) => i18n.changeLanguage(lang)}
    >
      <MonkProvider>
        <div className='app-container' style={rootStyles}>
          <Outlet />
        </div>
      </MonkProvider>
    </MonkAppStateProvider>
  );
}
