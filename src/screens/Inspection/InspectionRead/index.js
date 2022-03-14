import React, { useCallback, useLayoutEffect, useEffect, useState } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import monk from '@monkvision/corejs';
import { useDispatch } from 'react-redux';

import moment from 'moment';
import isEmpty from 'lodash.isempty';

import { LANDING } from 'screens/names';

import { SafeAreaView, ScrollView } from 'react-native';
import { Appbar, Card, useTheme } from 'react-native-paper';
import { Loader } from '@monkvision/ui';

import styles from './styles';

export default () => {
  const theme = useTheme();
  const route = useRoute();
  const navigation = useNavigation();

  const { inspectionId: id } = route.params;

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const catchLoadingError = useCallback((e) => {
    setLoading(false);
    setError(e);
  }, [setLoading, setError]);

  const getOneInspection = useCallback(async (requestParams) => {
    if (!loading) {
      setLoading(true);

      try {
        const response = await monk.entity.inspection.getOne(requestParams);
        dispatch({ type: `${monk.entity.inspection.name}/gotOne`, payload: response });
        setLoading(false);
      } catch (e) {
        catchLoadingError(e);
      }
    }
  }, [catchLoadingError, dispatch, loading]);

  const inspection = monk.entity.inspection.selectors.selectById(id);
  const vehicle = monk.entity.vehicle.selectors.selectById(inspection?.vehicle);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: isEmpty(inspection) ? `Inspection #${id.split('-')[0]}` : (
          `${vehicle?.brand || 'Brand'} ${vehicle?.model || 'Model'} ${moment(inspection?.createdAt).format('lll')}`
        ),
        headerTitle: () => (
          <Appbar.Content
            color={theme.colors.text}
            style={{ justifyContent: 'center' }}
            title={`${vehicle?.brand || 'Brand'} ${vehicle?.model || 'Model'}`}
            subtitle={moment(inspection?.createdAt).format('lll')}
          />
        ),
        headerBackVisible: false,
        headerLeft: () => (
          <Appbar.BackAction
            accessibilityLabel="Return to inspection"
            onPress={() => navigation.navigate(LANDING)}
          />
        ),
      });
    }
  }, [theme.colors.text, inspection, navigation, id, vehicle?.brand, vehicle?.model]);

  useEffect(() => {
    getOneInspection({ id });
  }, [getOneInspection, id]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  if (loading) {
    return <Loader />;
  }

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView>
        <Card style={styles.card}>
          <Card.Title
            title="Inspection report"
            subtitle={`#${id}`}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};
