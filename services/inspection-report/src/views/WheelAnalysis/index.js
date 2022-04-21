import React, { useMemo } from 'react';
import startCase from 'lodash.startcase';
import isEmpty from 'lodash.isempty';
import { useParams } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Grid from '@mui/material/Grid';

import { ScrollToTop, View } from 'components';
import { capitalize } from 'lodash';
import { styled } from '@mui/system';
import useGetInspection from './useGetInspection';
import useGetWheelAnalysis from './useGetWheelAnalysis';

const chipProps = (data, name) => {
  switch (data?.prediction) {
    case name:
      return {
        label: capitalize(startCase(name)),
        variant: 'filled',
        style: { opacity: 1 },
      };
    case 'UNKNOWN':
    case 'NOT_APPLICABLE':
    default:
      return {
        label: capitalize(startCase(name)),
        variant: 'outlined',
        style: { opacity: 0.4 },
        icon: <DoNotDisturbIcon />,
      };
  }
};

export default function WheelAnalysis() {
  const { inspectionId: id, wheelAnalysisId } = useParams();

  const { imageEntities, inspection } = useGetInspection(id);

  const { wheelAnalysis, images } = useGetWheelAnalysis(imageEntities, wheelAnalysisId);

  const noHubcapDetected = useMemo(() => wheelAnalysis?.hubcapOverRim?.prediction === 'NOT_APPLICABLE'
  || wheelAnalysis?.hubcapOverRim?.prediction === 'RIM_ONLY'
  || wheelAnalysis?.hubcapOverRim?.prediction === 'UNKNOWN', [wheelAnalysis?.hubcapOverRim]);

  console.log({ images, wheelAnalysis, inspection, wheelAnalysisId, noHubcapDetected });

  return (
    <View viewName="wheelAnalysis" title={process.env.REACT_APP_BRAND}>
      <CssBaseline />
      <ScrollToTop />
      <Container maxWidth="xl">
        <Stack spacing={4} mt={4}>
          <Typography variant="h4">{startCase(wheelAnalysis?.wheelName)}</Typography>

          {/* rim description */}
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="overline" color="gray">Rim description</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Rim condition</Typography>
                    <Chip {...chipProps(wheelAnalysis?.rimCondition, 'NOT_DAMAGED')} />
                    <Chip {...chipProps(wheelAnalysis?.rimCondition, 'DAMAGED')} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Rim material</Typography>
                    <Chip {...chipProps(wheelAnalysis?.rimMaterial, 'STEEL')} />
                    <Chip {...chipProps(wheelAnalysis?.rimMaterial, 'ALU')} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Rim visual aspect</Typography>
                    <Chip {...chipProps(wheelAnalysis?.rimVisualAspect, 'BICOLOR')} />
                    <Chip {...chipProps(wheelAnalysis?.rimVisualAspect, 'CLASSIC')} />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          {/* hubcap description (hubcap present) */}
          {!noHubcapDetected && (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="overline" color="gray">Hubcap description</Typography>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Hubcap condition</Typography>
                    <Chip {...chipProps(wheelAnalysis?.hubcapCondition, 'NOT_DAMAGED')} />
                    <Chip {...chipProps(wheelAnalysis?.hubcapCondition, 'DAMAGED')} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Hubcap over rim</Typography>
                    <Chip {...chipProps(wheelAnalysis?.hubcapOverRim, 'HUBCAP_OVER_RIM')} />
                    <Chip {...chipProps(wheelAnalysis?.hubcapOverRim, 'RIM_ONLY')} />
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Typography variant="subtitle1">Hubcap visual aspect</Typography>
                    <Chip {...chipProps(wheelAnalysis?.hubcapVisualAspect, 'BICOLOR')} />
                    <Chip {...chipProps(wheelAnalysis?.hubcapVisualAspect, 'CLASSIC')} />
                  </Stack>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
          )}

          {/* hubcap description (no hubcap) */}
          {noHubcapDetected && (
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="overline" color="gray">Hubcap description</Typography>
                <Typography variant="body1">No hubcap detected</Typography>
              </Stack>
            </CardContent>
          </Card>
          )}

          {/* images */}
          {!isEmpty(images) ? (
            <Stack spacing={1}>
              <Typography variant="overline" color="gray">Damages photos</Typography>
              <div>
                <Grid container columns={12} spacing={1}>
                  {images.map((image) => (
                    <>
                      <Grid item xs={4}>
                        <Img src={image.path} alt="Part image1" key={image.id} />
                      </Grid>
                      <Grid item xs={4}>
                        <Img src={image.path} alt="Part image1" key={image.id} />
                      </Grid>
                      <Grid item xs={4}>
                        <Img src={image.path} alt="Part image1" key={image.id} />
                      </Grid>
                      <Grid item xs={4}>
                        <Img src={image.path} alt="Part image1" key={image.id} />
                      </Grid>
                    </>
                  ))}
                </Grid>
              </div>
            </Stack>
          ) : null}
        </Stack>
      </Container>
    </View>
  );
}

const Img = styled('img')`
  width: 100%;
  border-radius: 4px;
  object-fit: cover;
`;
