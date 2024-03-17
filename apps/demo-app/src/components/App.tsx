import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { i18nInspectionCaptureWeb } from '@monkvision/inspection-capture-web';
import { MonkAppParamsProvider, MonkProvider, useI18nLink, useMonkTheme } from '@monkvision/common';
import { Page } from '../pages';

export function App() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { rootStyles } = useMonkTheme();
  useI18nLink(i18n, [i18nInspectionCaptureWeb]);

  return (
    <MonkAppParamsProvider onFetchAuthToken={() => navigate(Page.CREATE_INSPECTION)}>
      <MonkProvider>
        <div className='app-container' style={rootStyles}>
          <Outlet />
        </div>
      </MonkProvider>
    </MonkAppParamsProvider>
  );
}
