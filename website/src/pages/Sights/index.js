import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

import Layout from '@theme/Layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import ReactJson from 'react-json-view';

import sightsData from '@monkvision/sights/dist';

// eslint-disable-next-line react/prop-types
function SightCard({ id, label, category, vehicleType, overlay }) {
  const base64 = btoa(unescape(encodeURIComponent(overlay)));

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
          <Chip label={id} />
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
    </Card>
  );
}

function Sights() {
  const context = useDocusaurusContext();
  const { siteConfig: { customFields = {}, tagline } = {} } = context;

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Layout title={tagline} description={customFields.description}>
        <Container
          sx={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            paddingTop: '8px',
            paddingBottom: '8px',
          }}
          disableGutters
        >
          <CssBaseline />
          {Object.values(sightsData).map((sight) => (
            <SightCard key={sight.id} {...sight} />
          ))}
        </Container>
      </Layout>
    </ThemeProvider>
  );
}

export default Sights;
