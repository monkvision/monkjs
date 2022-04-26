import React, { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';
import useToggle from 'hooks/useToggle';
import CssBaseline from '@mui/material/CssBaseline';
import { ResponsiveAppBar, ScrollToTop, View } from 'components';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from 'views/App';
import HomeFab from 'views/Home/Fab';

import monk from '@monkvision/corejs';

export default function Home() {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const [inspectionId, setInspectionId] = useState();
  const [loading, setLoading, unsetLoading] = useToggle();

  const handleNewInspection = useCallback(() => {
    const createOneInspection = createAsyncThunk(
      'inspections/createOne',
      async (data) => {
        setLoading();
        const { entities, result } = await monk.entity.inspection.createOne(data);
        unsetLoading();
        setInspectionId(result.id);

        return entities;
      },
    );

    try {
      const tasks = { damage_detection: { status: 'NOT_STARTED' } };
      dispatch(createOneInspection({ tasks }));
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
      <HomeFab loading={loading} onClick={handleNewInspection} />
    </View>
  );
}
