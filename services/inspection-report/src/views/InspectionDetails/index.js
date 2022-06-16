import { Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { ScrollToTop, View } from 'components';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import ImageList from 'views/InspectionDetails/ImageList';
import useGetInspection from './useGetInspection';
import useGetPdfReport from './useGetPdfReport';

export default function InspectionDetails() {
  const { id } = useParams();

  const { state, images, damages } = useGetInspection(id);
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
          <Typography variant="h4">Inspection details</Typography>
          <Stack spacing={2}>
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
