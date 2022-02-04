import React, { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom';
import { config as corejs } from '@monkvision/corejs';

import useLoading from 'hooks/useLoading';

import Home from 'views/Home';
import Auth from 'views/Auth';
import Loading from 'views/Loading';
import Inspector from 'views/Inspector';

export const ROUTE_PATHS = {
  home: '/',
  inspector: '/inspector',
};

export default function App() {
  const { isAuthenticated, isLoading: authenticating, getAccessTokenSilently } = useAuth0();
  const [isGettingToken, setIsGettingToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const loading = useLoading(authenticating && isGettingToken);

  const handleToken = useCallback(async () => {
    setIsGettingToken(true);
    try {
      corejs.accessToken = await getAccessTokenSilently();

      setHasToken(true);
      setIsGettingToken(false);
    } catch (e) {
      setIsGettingToken(false);
    }
  }, [getAccessTokenSilently]);

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
        <Route path={ROUTE_PATHS.inspector} element={<Inspector />} />
      </Routes>
    );
  }

  return <Auth />;
}
