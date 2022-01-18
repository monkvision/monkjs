import React from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import assets from '@monkvision/vehicle/index.js';
import data from '@monkvision/vehicle/index.json';

import SightCard from './SightCard';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  console.log(data, assets);
  return (
    <ThemeProvider theme={darkTheme}>
      <div className="App">
        <CssBaseline />
        <Container maxWidth="sm" disableGutters>
          {Object.keys(data).map((key) => (
            <SightCard
              key={key}
              id={key}
              image={assets[key]}
              {...data[key]}
            />
          ))}
        </Container>
      </div>
    </ThemeProvider>
  );
}

export default App;
