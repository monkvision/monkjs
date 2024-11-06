import { MemoryRouter, Navigate, Route, Routes } from 'react-router-dom';
import { CameraPage, Page } from '../pages';
import { App } from './App';

export function AppRouter() {
  return (
    <MemoryRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/' element={<Navigate to={Page.CAMERA} />} />
          <Route path={Page.CAMERA} element={<CameraPage />} />
          <Route path='*' element={<Navigate to={Page.CAMERA} />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
