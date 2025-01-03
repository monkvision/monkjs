import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@monkvision/common-ui-web';
import {
  CreateInspectionPage,
  InspectionCompletePage,
  LoginPage,
  Page,
  VideoCapturePage,
} from '../pages';
import { App } from './App';

export function AppRouter() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Navigate to={Page.CREATE_INSPECTION} />} />
          <Route path={Page.LOG_IN} element={<LoginPage />} />
          <Route path={Page.INSPECTION_COMPLETE} element={<InspectionCompletePage />} />
          <Route
            path={Page.CREATE_INSPECTION}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <CreateInspectionPage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.VIDEO_CAPTURE}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <VideoCapturePage />
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
