import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route, useLocation } from 'react-router-dom';
import monk from '@monkvision/corejs';

import useLoading from 'hooks/useLoading';

import Home from 'views/Home';
import Auth from 'views/Auth';
import Loading from 'views/Loading';
import Inspections from 'views/Inspections';
import { ResponsiveAppBar } from '../../components';

export const ROUTE_PATHS = {
  home: '/',
  inspections: '/inspections',
};

// Ajoutez ça dans votre fichier de composant
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);

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
    console.log(queryParams);
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
      <div>
        <ResponsiveAppBar />
        <Routes>
          <Route exact path={ROUTE_PATHS.home} element={<Home />} />
          <Route exact path={ROUTE_PATHS.inspections} element={<Inspections />} />
        </Routes>
      </div>
    );
  }

  return <Auth />;
}