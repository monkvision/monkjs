import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Switch, Route } from 'react-router-dom';

import useMinLoadingTime from 'hooks/useMinLoadingTime';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import View from 'components/View';
import Landing from 'views/Landing';
import Loading from 'views/Loading';

export const ROUTE_PATHS = {
  home: '/',
};

export default function App() {
  const { isAuthenticated, isLoading: authenticating } = useAuth0();
  const isLoading = useMinLoadingTime(authenticating);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? (
    <div className="App">
      <Switch>

        <Route exact path={ROUTE_PATHS.home}>
          <View viewName="home" title="Home">
            <Container maxWidht="md">
              <Typography component="h3" variant="h3">
                Home
              </Typography>
            </Container>
          </View>
        </Route>

      </Switch>
    </div>
  ) : <Landing />;
}
