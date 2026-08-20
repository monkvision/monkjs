import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "@monkvision/common-ui-web";
import {
  CreateInspectionPage,
  LoginPage,
  Page,
  PhotoCapturePage,
  VehicleTypeSelectionPage,
  CaptureSelectionPage,
  DamageDisclosurePage,
} from ".";
import { App } from "./App";

export function AppRouter() {
  return (
    <MemoryRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Navigate to={Page.CREATE_INSPECTION} />} />
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
            path={Page.VEHICLE_TYPE_SELECTION}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <VehicleTypeSelectionPage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.CAPTURE_SELECTION}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <CaptureSelectionPage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.PHOTO_CAPTURE}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <PhotoCapturePage />
              </AuthGuard>
            }
            index
          />
          <Route
            path={Page.DAMAGE_DISCLOSURE}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <DamageDisclosurePage />
              </AuthGuard>
            }
            index
          />
          <Route path="*" element={<Navigate to={Page.CREATE_INSPECTION} />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}
