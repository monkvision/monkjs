import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import { useParams } from 'react-router-dom';

import { ResponsiveAppBar, ScrollToTop, View } from 'components';

const url = 'https://images.unsplash.com/photo-1621712151262-60bd142ba19f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8d2hlZWwlMjBjYXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60';

export default function WheelAnalysis() {
  const { inspectionId: id, wheelAnalysisId } = useParams();

  console.log({ id, wheelAnalysisId });

  return (
    <View viewName="wheelAnalysis" title={process.env.REACT_APP_BRAND}>
      <CssBaseline />
      <ScrollToTop />
      <ResponsiveAppBar />
      <Container maxWidth="xl">
        <Stack spacing={4} mt={4}>
          <Typography variant="h4">Front right wheel</Typography>

          {/* damage */}
          <Stack spacing={1}>
            <Typography variant="h6">Damages detected</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="Damaged" variant="outlined" />
              <Chip label="Not damaged" />
            </Stack>
          </Stack>

          {/* rim/hubcap material */}
          <Stack spacing={1}>
            <Typography variant="h6">Rim/hubcap material </Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="Steel" />
              <Chip label="Aluminium" variant="outlined" />
              <Chip label="Emb" variant="outlined" />
            </Stack>
          </Stack>

          {/* severity */}
          <Stack spacing={1}>
            <Typography variant="h6">Severity</Typography>
            <Stack direction="row" spacing={1}>
              <Chip label="Minor" variant="outlined" />
              <Chip label="Moderate" variant="outlined" />
              <Chip label="Major" variant="outlined" />
            </Stack>
          </Stack>

          {/* images */}
          <Stack spacing={1}>
            <Typography variant="h6">Photos of part</Typography>
            <img src={url} alt="Part image1" />
            <img src={url} alt="Part imag2" />
          </Stack>
        </Stack>
      </Container>
    </View>
  );
}
