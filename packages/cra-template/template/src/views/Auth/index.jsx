import Typography from '@mui/material/Typography';
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import View from 'components/View';

export default function Auth() {
  const { loginWithRedirect } = useAuth0();

  return (
    <View viewName="auth" title="Authentication">
      <CssBaseline />
      <Container maxWidth={false}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.paper',
          }}
        >
          <img
            src={process.env.REACT_APP_LOGO}
            alt={`${process.env.REACT_APP_BRAND} logo`}
            height={150}
          />
          <Typography component="h1" variant="h5" textAlign="center" marginTop={3}>
            {`Welcome to ${process.env.REACT_APP_BRAND}`}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
            <Button
              size="large"
              variant="contained"
              startIcon={<AccountCircleIcon />}
              onClick={loginWithRedirect}
              sx={{ m: 1 }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </View>
  );
}
