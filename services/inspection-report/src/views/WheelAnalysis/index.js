import { Vehicle } from '@monkvision/visualization';
import DoNotDisturbIcon from '@mui/icons-material/DoNotDisturb';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';

import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';

import { ScrollToTop, View } from 'components';
import { capitalize, isEmpty, startCase } from 'lodash';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
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

const getVehicleSideByWheelName = (wheelName) => {
  switch (wheelName) {
    case 'wheel_front_right':
    case 'wheel_back_right':
      return 'back';

    case 'wheel_front_left':
    case 'wheel_back_left':
    default:
      return 'front';
  }
};

const getActivePartsByWheelName = (wheelName) => {
  switch (wheelName) {
    case 'wheel_front_right':
      return { wheelFrontRight: true, hubcapFrontRight: true };
    case 'wheel_back_right':
      return { wheelBackRight: true, hubcapBackRight: true };
    case 'wheel_back_left':
      return { wheelBackLeft: true, hubcapBackLeft: true };
    case 'wheel_front_left':
      return { wheelFrontLeft: true, hubcapFrontLeft: true };
    default:
      return { wheelFrontLeft: false, hubcapFrontLeft: false };
  }
};

const hasNoHubcapp = (prediction) => (
  prediction === 'NOT_APPLICABLE'
  || prediction === 'RIM_ONLY'
  || prediction
) === 'UNKNOWN';

export default function WheelAnalysis() {
  const { inspectionId: id, wheelAnalysisId } = useParams();

  const { imageEntities, taskEntities, state } = useGetInspection(id);
  const { wheelAnalysis, images } = useGetWheelAnalysis(imageEntities, wheelAnalysisId);

  const currentTask = useMemo(
    () => Object.values(taskEntities).find((task) => task.name === 'wheel_analysis'),
    [taskEntities],
  );

  const vehicleSide = useMemo(
    () => getVehicleSideByWheelName(wheelAnalysis?.wheelName),
    [wheelAnalysis],
  );

  const noHubcapDetected = useMemo(
    () => hasNoHubcapp(wheelAnalysis?.hubcapOverRim?.prediction),
    [wheelAnalysis],
  );

  if (state.loading) {
    return (
      <Stack alignItems="center" mt="50vh">
        <CircularProgress />
      </Stack>
    );
  }

  return (
    <View viewName="wheelAnalysis" title={process.env.REACT_APP_BRAND}>
      <CssBaseline />
      <ScrollToTop />

      <Container maxWidth="xl">
        <Stack spacing={4} mt={4}>
          {/* wheel name */}
          <Stack spacing={1}>
            <Typography variant="h4">{startCase(wheelAnalysis?.wheelName) || 'Unknown wheel name'}</Typography>
            <Stack spacing={1} direction="row">
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>AI Feature</Typography>
              <Typography variant="subtitle1" color="gray">{moment(currentTask?.createdAt).format('DD/MM/YYYY LT')}</Typography>
            </Stack>
          </Stack>

          {/* vehicle 2D */}
          <Grid container direction="column" alignItems="center" justifyContent="center">
            <Grid item xs={1}>
              <Vehicle
                side={vehicleSide}
                activeParts={getActivePartsByWheelName(wheelAnalysis?.wheelName)}
                readOnly
                width="100%"
                height="100%"
              />
            </Grid>
          </Grid>

          {/* rim & hubcap */}
          <Card variant="outlined" sx={{ backgroundColor: '#fafafa' }}>
            <CardContent>
              <Stack spacing={4}>
                {/* rim description */}
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

                {/* hubcap description (hubcap present) */}
                {!noHubcapDetected && (
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
                )}

                {/* hubcap description (no hubcap) */}
                {noHubcapDetected && (
                <Stack spacing={1}>
                  <Typography variant="overline" color="gray">Hubcap description</Typography>
                  <Typography variant="body1">No hubcap detected</Typography>
                </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* images */}
          {!isEmpty(images) ? (
            <Stack spacing={1}>
              <Typography variant="overline" color="gray">Wheel picture</Typography>
              <div>
                <Grid container columns={12} spacing={1}>
                  {images.map((image) => (
                    <Grid item xs={4} key={image.id}>
                      <Img src={image.path} alt="Part image1" />
                    </Grid>
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
