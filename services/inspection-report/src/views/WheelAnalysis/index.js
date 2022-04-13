import React from 'react';
import startCase from 'lodash.startcase';
import isEmpty from 'lodash.isempty';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

import { ScrollToTop, View } from 'components';
import useGetInspection from './useGetInspection';
import useGetWheelAnalysis from './useGetWheelAnalysis';

export default function WheelAnalysis() {
  const { inspectionId: id, wheelAnalysisId } = useParams();

  const { imageEntities, inspection } = useGetInspection(id);

  const { wheelAnalysis, images } = useGetWheelAnalysis(imageEntities, wheelAnalysisId);

  console.log({ images, wheelAnalysis, inspection, wheelAnalysisId });

  return (
    <View viewName="wheelAnalysis" title={process.env.REACT_APP_BRAND}>
      <CssBaseline />
      <ScrollToTop />
      <Container maxWidth="xl">
        <Stack spacing={4} mt={4}>
          <Typography variant="h4">{startCase(wheelAnalysis?.wheelName)}</Typography>

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
          {!isEmpty(images) ? (
            <Stack spacing={1}>
              <Typography variant="h6">Photos of part</Typography>
              {images.map((image) => (
                <img src={image.path} alt="Part image1" key={image.id} />
              ))}
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </View>
  );
}
