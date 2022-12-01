import React from 'react';
import propTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';

export default function SightCard({ id, label, category, vehicleType, overlay }) {
  const base64 = btoa(unescape(encodeURIComponent(overlay)));

  return (
    <Card sx={{
      width: '100%',
      maxWidth: '320px',
      margin: 2,
    }}
    >
      <CardMedia
        component="img"
        alt={label}
        height="240"
        image={`data:image/svg+xml;base64,${base64}`}
      />
      <CardContent sx={{ textAlign: 'left' }}>
        <Typography
          gutterBottom
          variant="h6"
          component="div"
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          {/* eslint-disable-next-line react/prop-types */}
          {label.en ? label.en.charAt(0).toUpperCase() + label.en.slice(1) : 'No label'}
          <Chip label={id} />
        </Typography>
      </CardContent>
      <Box component="pre" sx={{ backgroundColor: 'black', borderRadius: 0 }}>
        {JSON.stringify({ id, label, category, vehicleType }, null, 2)}
      </Box>
    </Card>
  );
};

SightCard.propTypes = {
  category: propTypes.string,
  id: propTypes.string,
  label: propTypes.object,
  overlay: propTypes.any,
  vehicleType: propTypes.string,
};

SightCard.defaultProps = {
  category: '',
  id: '',
  label: {},
  overlay: '',
  vehicleType: '',
};
