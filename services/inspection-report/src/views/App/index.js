import { useAuth0 } from '@auth0/auth0-react';
import monk from '@monkvision/corejs';
import { View } from 'components';

import useLoading from 'hooks/useLoading';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Auth from 'views/Auth';

import Home from 'views/Home';
import Inspections from 'views/Inspections';
import InspectionDetails from 'views/InspectionDetails';
import Loading from 'views/Loading';
import WheelAnalysis from 'views/WheelAnalysis';
import { ResponsiveAppBar } from '../../components';

export const ROUTE_PATHS = {
  home: '/',
  wheelAnalysis: '/wheelAnalysis/:inspectionId/:wheelAnalysisId',
  inspections: '/inspections',
  inspectionDetails: '/inspections/:id',
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
      <View style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }} viewName="app">
        <ResponsiveAppBar />
        <Routes>
          <Route exact path={ROUTE_PATHS.home} element={<Home />} />
          <Route exact path={ROUTE_PATHS.inspections} element={<Inspections />} />
          <Route path={ROUTE_PATHS.wheelAnalysis} element={<WheelAnalysis />} />
          <Route exact path={ROUTE_PATHS.inspectionDetails} element={<InspectionDetails />} />
        </Routes>
      </View>
    );
  }

  return <Auth />;
}
