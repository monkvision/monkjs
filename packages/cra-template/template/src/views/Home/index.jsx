import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { normalize, denormalize } from 'normalizr';
import { useSnackbar } from 'notistack';
import useToggle from 'hooks/useToggle';
import CssBaseline from '@mui/material/CssBaseline';
import { ResponsiveAppBar, ScrollToTop, View } from 'components';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from 'views/App';
import HomeFab from 'views/Home/Fab';
import InspectionList from 'views/InspectionList';

import {
  imagesEntity,
  inspectionsEntity,
  monkApi,
  selectInspectionEntities,
  selectInspectionIds,
  selectTaskEntities,
  selectVehicleEntities,
  tasksEntity,
  vehiclesEntity,
} from '@monkvision/corejs';

export default function Home() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [inspectionId, setInspectionId] = useState();
  const [loading, setLoading, unsetLoading] = useToggle();

  const ids = useSelector(selectInspectionIds);
  const inspectionEntities = useSelector(selectInspectionEntities);
  const tasksEntities = useSelector(selectTaskEntities);
  const vehiclesEntities = useSelector(selectVehicleEntities);

  const { inspections } = denormalize({ inspections: ids }, {
    inspections: [inspectionsEntity],
    images: [imagesEntity],
    tasks: [tasksEntity],
    vehicles: [vehiclesEntity],
  }, {
    inspections: inspectionEntities,
    tasks: tasksEntities,
    vehicles: vehiclesEntities,
  });

  const handleNewInspection = useCallback(() => {
    const createOneInspection = createAsyncThunk(
      'inspections/createOne',
      async (arg) => {
        setLoading();
        const { data } = await monkApi.inspections.createOne({ ...arg });
        unsetLoading();
        const normalized = normalize(data, inspectionsEntity);
        setInspectionId(normalized.result);

        return normalized;
      },
    );

    try {
      const tasks = { damage_detection: { status: 'NOT_STARTED' } };
      dispatch(createOneInspection({ data: { tasks } }));
    } catch (e) {
      unsetLoading();
      enqueueSnackbar(
        `Failed to create new inspection`,
        { variant: 'error' },
      );
    }
  }, [dispatch, enqueueSnackbar, setInspectionId, setLoading, unsetLoading]);

  if (inspectionId) {
    return <Navigate to={ROUTE_PATHS.inspector} state={{ inspectionId }} />;
  }

  return (
    <View viewName="home" title={process.env.REACT_APP_BRAND}>
      <CssBaseline />
      <ScrollToTop />
      <ResponsiveAppBar />
      <InspectionList inspections={inspections} />
      <HomeFab loading={loading} onClick={handleNewInspection} />
    </View>
  );
}
