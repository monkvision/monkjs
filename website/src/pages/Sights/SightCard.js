import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Snackbar from '@mui/material/Snackbar';
import Typography from '@mui/material/Typography';

import ReactJson from 'react-json-view';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// eslint-disable-next-line react/prop-types
export default function SightCard({ id, label, category, vehicleType, overlay }) {
  const base64 = btoa(unescape(encodeURIComponent(overlay)));

  const [open, setOpen] = React.useState(false);

  const handleCopy = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Card sx={{
      width: '100%',
      maxWidth: '320px',
      margin: '8px',
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
          {label.charAt(0).toUpperCase() + label.slice(1)}
          <CopyToClipboard text={id} onCopy={handleCopy}>
            <Chip label={id} />
          </CopyToClipboard>
        </Typography>
        <ReactJson
          style={{
            margin: 0,
            marginTop: '8px',
          }}
          src={{ id, category, vehicleType }}
          theme="harmonic"
          enableClipboard={false}
          displayDataTypes={false}
          displayObjectSize={false}
          collapseStringsAfterLength={20}
        />
      </CardContent>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={`${id} copied!`}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      />
    </Card>
  );
}
