import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { ScrollToTop, View } from 'components';
import React, { useMemo } from 'react';
import { useParams } from 'react-router';
import ImageList from 'views/InspectionDetails/ImageList';
import useGetInspection from './useGetInspection';

export default function InspectionDetails() {
  const { id } = useParams();
  const { state, images, damages } = useGetInspection(id);

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
        <ImageList itemData={imageItems} />
      </Container>
    </View>
  );
}
