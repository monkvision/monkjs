import React, { useCallback, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Routes, Route } from 'react-router-dom';
import { axiosConfig } from 'config/corejs';

import useLoading from 'hooks/useLoading';

import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import View from 'components/View';

import Home from 'views/Home';
import Landing from 'views/Landing';
import Loading from 'views/Loading';

export const ROUTE_PATHS = {
  home: '/',
  loginCallback: '/login/callback',
};

function LoginCallback() {
  return (
    <View viewName="loginCallback" title="Logged in">
      <CssBaseline />
      <Container maxWidht="md">
        <Typography component="h3" variant="h3">
          You are logged in!
        </Typography>
      </Container>
    </View>
  );
}

export default function App() {
  const { isAuthenticated, isLoading: authenticating, getAccessTokenSilently } = useAuth0();
  const [isGettingToken, setIsGettingToken] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const loading = useLoading(authenticating && isGettingToken);

  const handleToken = useCallback(async () => {
    setIsGettingToken(true);
    try {
      axiosConfig.accessToken = await getAccessTokenSilently();
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
        <Route path={ROUTE_PATHS.loginCallback} element={<LoginCallback />} />
      </Routes>
    );
  }

  return <Landing />;
}
