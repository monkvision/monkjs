export const light = {
  palette: {
    mode: 'light',
    primary: {
      main: process.env.REACT_APP_PRIMARY_COLOR_LIGHT || '#274b9f',
    },
    secondary: { main: '#7af7ff' },
    success: { main: '#5ccc68' },
    warning: { main: '#ff9800' },
    error: { main: '#fa603d' },
    info: { main: '#bbbdbf' },
  },
};

export const dark = {
  palette: {
    mode: 'dark',
    primary: {
      main: process.env.REACT_APP_PRIMARY_COLOR_DARK || '#6682C1',
    },
  },
};

export default light;
