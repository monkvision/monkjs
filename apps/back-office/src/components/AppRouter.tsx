import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LiveConfigsPage, LogInPage, Page } from '../pages';
import { AuthGuard } from './AuthGuard';
import { App } from './App';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Navigate to={Page.LIVE_CONFIGS} replace />} />
          <Route path={Page.LOG_IN} element={<LogInPage />} />
          <Route
            path={Page.LIVE_CONFIGS}
            element={
              <AuthGuard>
                <LiveConfigsPage />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
