import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';

import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

import View from 'components/View';
import Loader from 'components/Loader';

import isEmpty from 'lodash.isempty';

export default function Loading({ text }) {
  const { palette } = useTheme();

  return (
    <View viewName="loading" title="Loading...">
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
        <Loader animated width={100} height={100} color={palette.primary.main} />
        {!isEmpty(text) ? <Typography variant="subtitle1">{text}</Typography> : null}
      </Box>
    </View>
  );
}

Loading.propTypes = {
  text: PropTypes.string,
};

Loading.defaultProps = {
  text: 'Loading...',
};
