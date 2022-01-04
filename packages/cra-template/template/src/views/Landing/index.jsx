import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import View from 'components/View';
import LogoIcon from 'components/LogoIcon';
import BrandIcon from 'components/BrandIcon';

import undrawSvg from './undraw_coolness_dtmq.svg';

export default function Landing() {
  const { loginWithRedirect } = useAuth0();
  const { palette } = useTheme();

  return (
    <View viewName="landing" title="Monk">
      <CssBaseline />
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
        <BrandIcon sx={{ width: 250, height: 64 }} />
        <Box sx={{ display: 'flex', justifyContent: 'center', m: 3 }}>
          <Button
            size="large"
            variant="contained"
            color="inherit"
            startIcon={<LogoIcon outerColor={palette.primary.main} />}
            component="a"
            href="https://monkvision.github.io/monkjs/"
            target="_blank"
            rel="noreferrer noopener"
            sx={{ m: 1 }}
          >
            Documentation
          </Button>
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
        <img src={undrawSvg} alt="artwork" height={250} />
      </Box>
    </View>
  );
}
