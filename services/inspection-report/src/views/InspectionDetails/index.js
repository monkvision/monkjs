import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import { Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';

import { ScrollToTop, View } from 'components';
import ImageList from 'views/InspectionDetails/ImageList';
import moment from 'moment';
import useGetInspection from './useGetInspection';
import useGetPdfReport from './useGetPdfReport';
import IdField from './IdField';

export default function InspectionDetails() {
  const { id } = useParams();

  const { state, images, damages, inspection } = useGetInspection(id);
  const { pdfUrl, handleDownLoad } = useGetPdfReport(id);

  const imageItems = useMemo(() => {
    if (!images) { return []; }
    return images.map((image) => (
      { ...image, damages: damages.filter(({ imageRegion }) => imageRegion.imageId === image.id) }
    ));
  }, [images]);

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
              <IdField label="Inspection ID" id={id} />
              <IdField label="Creator ID" id={inspection?.creatorId || ''} />
            </Stack>

            {/* report */}
            <Stack spacing={1.6}>
              <Typography variant="h5">Report</Typography>
              <Typography variant="body1">
                A PDF report file, containing all the insights about your inspection.
              </Typography>
              {!pdfUrl ? (
                <Typography variant="subtitle2" color="info">
                  Your report is not available yet
                </Typography>
              ) : null}
              <Button variant="outlined" disabled={!pdfUrl} onClick={handleDownLoad}>Download report</Button>
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
