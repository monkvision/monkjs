import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import moment from 'moment';
import { Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';

import { ScrollToTop, View } from 'components';
import ImageList from 'views/InspectionDetails/ImageList';

import useGetInspection from './useGetInspection';
import useGetPdfReport from './useGetPdfReport';

import Field from './Field';
import VinForm from './VinForm';

export default function InspectionDetails() {
  const { id } = useParams();

  const { state, images, damages, tasks, vehicle, inspection } = useGetInspection(id);
  const {
    reportUrl,
    handleDownLoad,
    loading: getPdfLoading,
  } = useGetPdfReport(id);

  const imageItems = useMemo(() => {
    if (!images) { return {}; }
    return { images, damages };
  }, [images, damages]);

  const inspectionIsNotCompleted = useMemo(() => tasks.some((t) => t.status !== 'DONE'), [tasks]);

  if (state.loading) {
    return (
      <Stack alignItems="center" mt="50vh">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <View viewName="inspectionDetails" title="Inspection Details">
      <CssBaseline />
      <ScrollToTop />

      <Container maxWidth="xl">
        <Stack spacing={4} mt={4}>
          <Typography variant="h4">{`Inspection ${moment(inspection?.createdAt).format('L')}`}</Typography>
          <Stack spacing={2}>
            {/* general */}
            <Stack spacing={1.6}>
              <Typography variant="h5">Details</Typography>
              <VinForm label="Vin" vin={vehicle?.vin} inspectionId={id} />
              <Field label="Inspection ID" value={id} readOnly />
              <Field label="Creator ID" value={inspection?.creatorId || ''} readOnly />
            </Stack>

            {/* report */}
            <Stack spacing={1.6}>
              <Typography variant="h5">Report</Typography>
              <Typography variant="body1">
                A PDF report file, containing all the insights about your inspection.
              </Typography>
              {getPdfLoading ? (
                <Typography variant="subtitle2" color="info">
                  Requesting the pdf...
                </Typography>
              ) : null}
              {!reportUrl && !getPdfLoading && !inspectionIsNotCompleted ? (
                <Typography variant="subtitle2" color="info">
                  Your report is not available yet, try refresh after a minute
                </Typography>
              ) : null}
              {!reportUrl && !getPdfLoading && inspectionIsNotCompleted ? (
                <Typography variant="subtitle2" color="info">
                  Please make sure that all the inspection tasks are done in order to generate
                  the report
                </Typography>
              ) : null}
              <Button variant="outlined" disabled={!reportUrl} onClick={handleDownLoad}>
                {getPdfLoading ? 'Loading...' : 'Download report'}
              </Button>
            </Stack>

            {/* images */}
            <Stack spacing={1.6}>
              <Typography variant="h5">Images</Typography>
              <Typography variant="body1">
                All inspection images
              </Typography>
              <ImageList itemData={imageItems} />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </View>
  );
}
