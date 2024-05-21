import { matchPath, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { Page } from '../pages';

const FULLSCREEN_ROUTES = [Page.LOG_IN];

export function useFullscreenRoute() {
  const location = useLocation();

  return useMemo(
    () => FULLSCREEN_ROUTES.some((route) => matchPath(location.pathname, route)),
    [location],
  );
}
