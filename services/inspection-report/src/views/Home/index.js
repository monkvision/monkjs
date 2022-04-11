import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ResponsiveAppBar, ScrollToTop, View } from 'components';

export default function Home() {
  return (
    <View viewName="home" title={process.env.REACT_APP_BRAND}>
      <CssBaseline />
      <ScrollToTop />
      <ResponsiveAppBar />
    </View>
  );
}
