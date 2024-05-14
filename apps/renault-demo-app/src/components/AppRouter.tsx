import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@monkvision/common-ui-web';
import { CreateInspectionPage, LoginPage, Page, PhotoCapturePage } from '../pages';
import { App } from './App';
import { REQUIRED_PERMISSIONS } from '../config';

export function AppRouter() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Navigate to={Page.CREATE_INSPECTION} />} />
          <Route path={Page.LOG_IN} element={<LoginPage />} />
          <Route
            path={Page.CREATE_INSPECTION}
            element={
              <AuthGuard redirectTo={Page.LOG_IN} requiredPermissions={REQUIRED_PERMISSIONS}>
                <CreateInspectionPage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.PHOTO_CAPTURE}
            element={
              <AuthGuard redirectTo={Page.LOG_IN} requiredPermissions={REQUIRED_PERMISSIONS}>
                <PhotoCapturePage />
              </AuthGuard>
            }
            index
          />
          <Route path='*' element={<Navigate to={Page.CREATE_INSPECTION} />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
