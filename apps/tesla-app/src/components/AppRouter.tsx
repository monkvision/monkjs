import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthGuard } from '@monkvision/common-ui-web';
import { LoginPage, InspectionReportPage, Page } from '../pages';
import { App } from './App';
import { CreateInspectionPage } from '../pages/CreateInspectionPage';

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
              <AuthGuard redirectTo={Page.LOG_IN}>
                <CreateInspectionPage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.INSPECTION_REPORT}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <InspectionReportPage />
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
