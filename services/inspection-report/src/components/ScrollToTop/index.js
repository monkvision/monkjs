import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Set scroll position to top when location (usually from router) has changed.
 * @returns {null}
 * @constructor
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
