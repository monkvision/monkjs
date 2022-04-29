import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { ScrollToTop, View } from 'components';
import React from 'react';
import { useParams } from 'react-router';
import ImageList from 'views/InspectionDetails/ImageList';
import useGetInspection from './useGetInspection';

export default function InspectionDetails() {
  const { id } = useParams();
  const { state, images } = useGetInspection(id);

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
        <ImageList itemData={images} />
      </Container>
    </View>
  );
}
