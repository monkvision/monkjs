/* eslint-disable global-require */
import React, { useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, Platform, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Card, Title, Paragraph, Button, useTheme } from 'react-native-paper';
import startCase from 'lodash.startcase';
import Drawing from 'components/Drawing';

import { getOneInspectionTask, selectTaskById, taskStatuses } from '@monkvision/corejs';
import { utils } from '@monkvision/react-native';
import { ActivityIndicatorView, useFakeActivity } from '@monkvision/react-native-views';

import useRequest from 'hooks/useRequest';
import { spacing } from 'config/theme';

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
  contentContainer: {
    flexGrow: 1,
    height: '100%',
    ...utils.styles.flex,
    flexDirection: 'column',
  },
  text: {
    color: '#43494A',
    textAlign: 'center',
    marginVertical: spacing(2),
  },
  content: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    marginTop: spacing(4),
  },
  actions: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: { margin: spacing(1), width: 140 },
  buttonLabel: { color: '#FFFFFF' },
});
const taskDrawings = {
  [taskStatuses.NOT_STARTED]: require('./assets/notStarted.svg'),
  [taskStatuses.TODO]: require('./assets/todo.svg'),
  [taskStatuses.IN_PROGRESS]: require('./assets/inProgress.svg'),
  [taskStatuses.DONE]: require('./assets/done.svg'),
  [taskStatuses.ERROR]: require('./assets/error.svg'),
  [taskStatuses.ABORTED]: require('./assets/aborted.svg'),
  [taskStatuses.VALIDATED]: require('./assets/validated.svg'),
};
const taskText = {
  [taskStatuses.NOT_STARTED]: 'This task haven\'t started yet',
  [taskStatuses.TODO]: 'This task yet to be done',
  [taskStatuses.IN_PROGRESS]: 'Our algorithm is still working on this task, the result will be shown soon.',
  [taskStatuses.DONE]: 'Done! This task has been executed succefully',
  [taskStatuses.ERROR]: 'Ouups! something went wrong with this task, we\'re investigating it.',
  [taskStatuses.ABORTED]: 'For some reason this task got aborted, try relaunch it.',
  [taskStatuses.VALIDATED]: 'You\'ve validated this task.',
};
export default () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { isLoading, refresh } = useRequest(
    getOneInspectionTask({
      inspectionId: route.params.inspectionId,
      taskName: route.params.taskName,
    }),
  );
  const task = useSelector((state) => selectTaskById(state, route.params.taskId));
  const [fakeActivity] = useFakeActivity(isLoading);

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Task #${route.params.taskName}`,
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
  }, [fakeActivity, navigation, refresh, route.params.taskName]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }
  return (
    <SafeAreaView contentContainerStyle={styles.root}>
      <Card style={styles.card}>
        <View style={styles.contentContainer}>
          <Card.Content style={styles.content}>
            <Drawing xml={taskDrawings[task.status]} />
            <Title>{startCase(task.name)}</Title>
            <Paragraph style={styles.text}>
              {taskText[task.status]}
            </Paragraph>
          </Card.Content>
          <Card.Actions style={styles.actions}>
            <Button
              accessibilityLabel="Vildate"
              style={styles.button}
              labelStyle={styles.buttonLabel}
              color={colors.success}
              icon="send"
              mode="contained"
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
              Relaunch
            </Button>
          </Card.Actions>
        </View>
      </Card>
    </SafeAreaView>
  );
};
