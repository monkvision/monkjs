/* eslint-disable global-require */
import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { StyleSheet, SafeAreaView, Platform, View, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Card, Title, Button, useTheme, Menu, Divider, IconButton, ActivityIndicator } from 'react-native-paper';
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
import useToggle from 'hooks/useToggle/index';

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
  },
  card: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
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
    marginVertical: spacing(1),
  },
  actions: {
    ...Platform.select({
      native: {
        marginHorizontal: spacing(1),
        alignItems: 'stretch',
        justifyContent: 'center',
      },
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
    flexWrap: 'wrap',
  },
  tag: {
    height: 26,
    lineHeight: 26,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  tagLayout: {
    paddingHorizontal: spacing(1),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: spacing(1),
    borderRadius: 12,
    overflow: 'hidden',
  },
  drawing: {
    marginHorizontal: spacing(2),
    marginVertical: spacing(1),
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

function ActionsMenu({ handleRefresh, handleRerun, handleCancel, taskLoading }) {
  const [isMenuOpen, handleOpenMenu, handleDismissMenu] = useToggle();

  return (
    <Menu
      anchor={<IconButton icon="dots-vertical" onPress={handleOpenMenu} />}
      visible={isMenuOpen}
      onDismiss={handleDismissMenu}
    >
      <Menu.Item
        icon="refresh"
        title="Refresh"
        onPress={handleRefresh}
        loading={taskLoading}
        disabled={taskLoading}
      />
      <Menu.Item
        icon="reload"
        onPress={handleRerun}
        disabled
        title="Re-run"
      />
      <Divider />
      <Menu.Item
        icon="cancel"
        onPress={handleCancel}
        disabled
        title="Cancel"
      />
    </Menu>
  );
}

ActionsMenu.propTypes = {
  handleCancel: PropTypes.func.isRequired,
  handleRefresh: PropTypes.func.isRequired,
  handleRerun: PropTypes.func.isRequired,
  taskLoading: PropTypes.bool.isRequired,
};

export default () => {
  const route = useRoute();
  const { taskId, inspectionId, taskName } = route.params;
  const navigation = useNavigation();
  const { colors } = useTheme();

  const { isLoading, refresh } = useRequest(getOneInspectionTask({ inspectionId, taskName }));
  const task = useSelector((state) => selectTaskById(state, taskId));
  const [fakeActivity] = useFakeActivity(isLoading);

  const handleCancel = useCallback(() => null, []);
  const handleRerun = useCallback(() => null, []);

  const taskAssets = useMemo(() => assets[task.status], [task.status]);
  const executionTime = useMemo(() => (task.doneAt && task.createdAt ? `Executed in ${moment.duration(moment(task.doneAt).diff(moment(task.createdAt))).seconds()}s` : null),
    [task.createdAt, task.doneAt]);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Task #${taskId}`,
        headerBackVisible: true,
        headerRight: () => (
          <ActionsMenu
            handleRefresh={refresh}
            taskLoading={Boolean(fakeActivity)}
            handleCancel={handleCancel}
            handleRerun={handleRerun}
          />
        ),
      });
    }
  }, [fakeActivity, handleCancel, handleRerun, navigation, refresh, taskId]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }
  return (
    <SafeAreaView contentContainerStyle={styles.root}>
      <Card style={styles.card}>
        <Card.Content>
          {/* drawing */}
          <View style={[styles.flex, styles.drawing]}>
            <Drawing height="200" style={{ maxWidth: '90%' }} xml={taskAssets.drawing} />
          </View>

          {/* content */}
          <View style={styles.content}>
            <View style={styles.flex}>
              <Title>{startCase(task.name)}</Title>
              {task.status === taskStatuses.IN_PROGRESS ? <ActivityIndicator color="#BBBDBF" /> : null}
            </View>
            <View style={styles.flex}>
              <View style={[styles.tagLayout, taskAssets.style]}>
                <Text style={styles.tag}>
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
          </View>
        </Card.Content>

        {/* actions */}
        <Card.Actions style={styles.actions}>
          <Button
            accessibilityLabel="Validate"
            style={styles.button}
            labelStyle={styles.buttonLabel}
            color={colors.success}
            icon="send"
            mode="contained"
            // I put true because to the feature not available
            disabled={task.status === taskStatuses.VALIDATED || true}
          >
            Validate
          </Button>
        </Card.Actions>
      </Card>
    </SafeAreaView>
  );
};
