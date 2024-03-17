import { Outlet, useNavigate } from 'react-router-dom';
import { MonkAppParamsProvider, MonkProvider, useMonkTheme } from '@monkvision/common';
import { Page } from '../pages';

export function App() {
  const navigate = useNavigate();
  const { rootStyles } = useMonkTheme();

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
