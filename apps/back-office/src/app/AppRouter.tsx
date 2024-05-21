import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@monkvision/common-ui-web';
import { LiveConfigPage, LoginPage, Page } from '../pages';
import { App } from './App';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Navigate to={Page.LIVE_CONFIG} replace />} />
          <Route path={Page.LOG_IN} element={<LoginPage />} />
          <Route
            path={Page.LIVE_CONFIG}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <LiveConfigPage />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
