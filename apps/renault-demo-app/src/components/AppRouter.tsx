import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CreateInspectionPage, LogInPage, Page, PhotoCapturePage } from '../pages';
import { AuthGuard } from './AuthGuard';
import { App } from './App';

export function AppRouter() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Navigate to={Page.CREATE_INSPECTION} />} />
          <Route path={Page.LOG_IN} element={<LogInPage />} />
          <Route
            path={Page.CREATE_INSPECTION}
            element={
              <AuthGuard>
                <CreateInspectionPage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.PHOTO_CAPTURE}
            element={
              <AuthGuard>
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
