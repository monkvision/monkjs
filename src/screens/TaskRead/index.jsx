/* eslint-disable global-require */
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, SafeAreaView, Platform, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Card, Title, Button, useTheme } from 'react-native-paper';
import startCase from 'lodash.startcase';
import moment from 'moment';
import * as Clipboard from 'expo-clipboard';
import PropTypes from 'prop-types';

import { getOneInspectionTask, selectTaskById, taskStatuses } from '@monkvision/corejs';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import useRequest from 'hooks/useRequest';
import useTimeout from 'hooks/useTimeout';
import { spacing } from 'config/theme';
import Drawing from 'components/Drawing';

import notStarted from './assets/notStarted.svg';
import todo from './assets/todo.svg';
import inProgress from './assets/inProgress.svg';
import done from './assets/done.svg';
import error from './assets/error.svg';
import aborted from './assets/aborted.svg';
import validated from './assets/validated.svg';

const styles = StyleSheet.create({
  root: {
    paddingVertical: spacing(1),
    ...Platform.select({
      native: { flex: 1 },
      default: { display: 'flex', flexGrow: 1, minHeight: 'calc(100vh - 64px)' },
    }),
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
    height: '100%',
  },
  text: {
    color: '#43494A',
    marginVertical: spacing(0.5),
  },
  lowContrast: {
    marginVertical: spacing(0.5),
    color: '#777777',
  },
  content: {
    marginVertical: spacing(2),
  },
  actions: {
    marginVertical: spacing(2),
    flexWrap: 'wrap',
    ...Platform.select({
      web: { justifyContent: 'flex-start' },
      default: { justifyContent: 'space-around' },
    }),
  },
  button: {
    marginVertical: spacing(1),
    marginHorizontal: spacing(1),
    ...Platform.select({
      web: { width: 140 },
      default: { width: '100%' },
    }),
  },
  buttonLabel: {
    color: '#FFFFFF',
  },
  flex: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tag: {
    height: 26,
    lineHeight: 26,
    borderRadius: 12,
    textAlign: 'center',
    paddingHorizontal: spacing(1),
    color: '#FFFFFF',
  },
  tagLayout: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: spacing(1),
  },
  drawing: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(2),
    ...Platform.select({
      native: { justifyContent: 'center' },
      web: { justifyContent: 'flex-start' },
    }),
  },
});

const assets = {
  [taskStatuses.NOT_STARTED]: { style: { backgroundColor: '#BBBDBF' }, drawing: notStarted, text: 'This task has not yet started.' },
  [taskStatuses.TODO]: { style: { backgroundColor: '#43494A' }, drawing: todo, text: 'This task remains to be done.' },
  [taskStatuses.IN_PROGRESS]: { style: { backgroundColor: '#274B9F' }, drawing: inProgress, text: 'Our algorithm is still working on this task, the result will be displayed soon.' },
  [taskStatuses.DONE]: { style: { backgroundColor: '#2B52BE' }, drawing: done, text: 'Done! This task has been completed successfully.' },
  [taskStatuses.ERROR]: { style: { backgroundColor: '#FA603D' }, drawing: error, text: 'Whoops ! something went wrong with this task, we are investigating.' },
  [taskStatuses.ABORTED]: { style: { backgroundColor: '#f7421a' }, drawing: aborted, text: 'For some reason this task has been aborted, try running it again.' },
  [taskStatuses.VALIDATED]: { style: { backgroundColor: '#5CCC68' }, drawing: validated, text: 'You have validated this task.' },
};

const COPY_DELAY = 2000;

function CopyButton({ taskId }) {
  const [copied, setCopied] = React.useState(false);

  const delay = copied ? COPY_DELAY : null;
  useTimeout(() => setCopied(false), delay);

  const handleCopyTaskId = useCallback(() => {
    Clipboard.setString(taskId);
    setCopied(true);
  }, [taskId]);

  return (
    <Button icon={copied ? 'check' : 'content-copy'} onPress={handleCopyTaskId}>Task id</Button>
  );
}

CopyButton.propTypes = {
  taskId: PropTypes.string.isRequired,
};

export default () => {
  const route = useRoute();
  const { taskId, inspectionId, taskName } = route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { isLoading, refresh } = useRequest(getOneInspectionTask({ inspectionId, taskName }));
  const task = useSelector((state) => selectTaskById(state, taskId));
  const [fakeActivity] = useFakeActivity(isLoading);

  const taskAssets = useMemo(() => assets[task.status], [task.status]);
  const executionTime = useMemo(() => (task.doneAt && task.createdAt ? `Executed in ${moment.duration(moment(task.doneAt).diff(moment(task.createdAt))).seconds()}s` : null),
    [task.createdAt, task.doneAt]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Task #${route.params.taskId}`,
        headerBackVisible: true,
        headerRight: () => (
          <Button
            icon={fakeActivity ? undefined : 'refresh'}
            onPress={refresh}
            loading={fakeActivity}
            disabled={fakeActivity}
          >
            Refresh
          </Button>
        ),
      });
    }
  }, [fakeActivity, navigation, refresh, route.params.taskId]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }
  return (
    <SafeAreaView contentContainerStyle={styles.root}>
      <Card style={styles.card}>
        <View style={[styles.flex, styles.drawing]}>
          <Drawing height="200" maxWidth="90%" xml={taskAssets.drawing} />
        </View>
        <Card.Content style={styles.content}>
          <Title>{startCase(task.name)}</Title>
          <View style={styles.flex}>
            <View style={styles.tagLayout}>
              <Text style={[styles.tag, taskAssets.style]}>
                {startCase(task.status)}
              </Text>
            </View>
            <CopyButton taskId={taskId} />
          </View>
          <View style={styles.flex}>
            <Text style={styles.lowContrast}>{moment(task.createdAt).format('DD-MM-YYYY hh:mm')}</Text>
            {executionTime ? (
              <Text style={styles.lowContrast}>
                {executionTime}
              </Text>
            ) : null}
          </View>
          <Text style={styles.text}>
            {taskAssets.text}
          </Text>
        </Card.Content>
        <Card.Actions style={styles.actions}>
          <Button
            accessibilityLabel="Validate"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            color={colors.success}
            icon="send"
            mode="contained"
            disalbed={task.status === taskStatuses.VALIDATED}
          >
            Validate
          </Button>
          <Button
            accessibilityLabel="Relaunch"
            style={styles.button}
            color={colors.primary}
            icon="reload"
            mode="contained"
          >
            Re-run
          </Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
};
