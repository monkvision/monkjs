import * as React from 'react';
import PropTypes from 'prop-types';
import Fab from '@mui/material/Fab';
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

export default function HomeFab({ loading, ...props }) {
  return (
    <Fab
      sx={{ position: 'fixed', bottom: 0, right: 0, m: 2 }}
      variant="extended"
      color="primary"
      aria-label="New inspection"
      disabled={loading}
      {...props}
    >
      {loading ? <CircularProgress color="inherit" /> : <PhotoCameraIcon sx={{ mr: 1 }} />}
      New inspection
    </Fab>
  );
}

HomeFab.propTypes = {
  loading: PropTypes.bool,
};

HomeFab.defaultProps = {
  loading: false,
};
