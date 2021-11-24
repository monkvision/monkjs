import moment from 'moment';
import React, { useCallback, useEffect, useLayoutEffect, useMemo } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { getOneInspectionById, selectInspectionById, selectAllTasks, getAllInspectionTasks } from '@monkvision/corejs';

import { Appbar, Card, Button } from 'react-native-paper';
import JSONTree from 'react-native-json-tree';
import useInterval from 'hooks/useInterval';

// we can customize the json component by making changes to the theme object
// see more in the docs https://www.npmjs.com/package/react-native-json-tree
const theme = {
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const DEFAULT_POOL = 10000; // 1 min

export default () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { inspectionId } = route.params;
  const inspection = useSelector(((state) => selectInspectionById(state, inspectionId)));
  const { loading, error } = useSelector(((state) => state.inspections));

  const { loading: tasksLoading, error: tasksError } = useSelector(((state) => state.tasks));
  const tasks = useSelector(selectAllTasks);

  const handleGoBack = useCallback(() => {
    if (navigation && navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        header: () => (
          <Appbar.Header>
            <Appbar.BackAction onPress={handleGoBack} />
            <Appbar.Content title="Inspection" subtitle={inspectionId} />
          </Appbar.Header>
        ),
      });
    }
  }, [handleGoBack, navigation, inspectionId]);

  useEffect(() => {
    if (loading !== 'pending' && !inspection && !error) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [dispatch, error, inspection, inspectionId, loading]);

  const poolTasks = useCallback(
    () => dispatch(getAllInspectionTasks({ inspectionId })), [dispatch, inspectionId],
  );

  const tasksToBeDone = useMemo(() => (tasks?.length ? tasks?.some((task) => (task.status !== 'DONE' && task.status !== 'ERROR' && task.status !== 'VALIDATED')) : true), [tasks]);

  const delay = inspection && tasksLoading !== 'pending' && !tasksError && tasksToBeDone && DEFAULT_POOL;

  useInterval(poolTasks, delay);

  useEffect(() => {
    if (tasks && tasks.length) {
      if (!tasksToBeDone.length) { // && !damages && damagesLoading !== 'pending' && !damagesError
        // dispatch(getAllDamages({ inspectionId }));
        // eslint-disable-next-line no-console
        console.log('get damages');
      }
    }
  }, [tasks, tasksToBeDone.length]); // dispatch, tasks, damages, damagesLoading damagesError

  return (
    <Card>
      <Card.Title
        title="Vehicle info"
        subtitle={`${moment(inspection.createdAt).format('L')} - ${inspection.id.split('-')[0]}...`}
      />
      <Card.Content>
        <JSONTree data={{ ...inspection, tasks }} theme={theme} />
      </Card.Content>
      <Card.Actions>
        <Button>Show images</Button>
        <Button>Delete</Button>
      </Card.Actions>
    </Card>
  );
};
