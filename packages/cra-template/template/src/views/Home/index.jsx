import React from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import View from 'components/View';

export default function Home() {
  return (
    <View viewName="home" title="Home">
      <CssBaseline />
      <Container maxWidht="md">
        <Typography component="h3" variant="h3">
          Home
        </Typography>
      </Container>
    </View>
  );
}
