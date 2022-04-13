import { useAuth0 } from '@auth0/auth0-react';
import monk from '@monkvision/corejs';

import useLoading from 'hooks/useLoading';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Auth from 'views/Auth';

import Home from 'views/Home';
import Loading from 'views/Loading';

export const ROUTE_PATHS = {
  home: '/',
};

export default function App() {
  const { search } = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(search), [search]);

  const { isAuthenticated, isLoading: authenticating, getAccessTokenSilently } = useAuth0();
  const [isGettingToken, setIsGettingToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const loading = useLoading(authenticating && isGettingToken);

  const handleToken = useCallback(async (token) => {
    setIsGettingToken(true);

    try {
      if (token !== undefined) {
        monk.config.accessToken = token;
      } else {
        monk.config.accessToken = await getAccessTokenSilently();
      }

      setHasToken(true);
      setIsGettingToken(false);
    } catch (e) {
      setIsGettingToken(false);
    }
  }, [getAccessTokenSilently]);

  useEffect(() => {
    handleToken(queryParams.get('access_token'));
  }, [handleToken, queryParams]);

  useEffect(() => {
    if (isAuthenticated) { handleToken(); }
  }, [isAuthenticated, handleToken]);

  if (loading) {
    return <Loading />;
  }

  if (hasToken) {
    return (
      <Routes>
        <Route exact path={ROUTE_PATHS.home} element={<Home />} />
      </Routes>
    );
  }

  return <Auth />;
}
