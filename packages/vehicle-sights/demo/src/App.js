import React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import sights from '@monkvision/vehicle-sights/index.json';
import assets from '@monkvision/vehicle-sights/assets';

import SightCard from './SightCard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <CssBaseline />
        <Container maxWidth="sm" disableGutters>
          {Object.keys(sights).map((key) => (
            <SightCard
              key={key}
              id={key}
              image={assets[key]}
              {...sights[key]}
            />
          ))}
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
