import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@monkvision/common-ui-web';
import { LiveConfigsPage, LoginPage, Page } from '../pages';
import { App } from './App';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Navigate to={Page.LIVE_CONFIGS} replace />} />
          <Route path={Page.LOG_IN} element={<LoginPage />} />
          <Route
            path={Page.LIVE_CONFIGS}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <LiveConfigsPage />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
