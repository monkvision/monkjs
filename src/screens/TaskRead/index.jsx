import React, { useLayoutEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getOneInspectionTask, selectTaskById } from '@monkvision/corejs';
import useRequest from 'hooks/useRequest';
import { useSelector } from 'react-redux';
import { ActivityIndicatorView } from '@monkvision/react-native-views';

export default () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { isLoading } = useRequest(
    getOneInspectionTask({
      inspectionId: route.params.inspectionId,
      taskName: route.params.taskName,
    }),
  );
  const task = useSelector((state) => selectTaskById(state, route.params.taskId));

  useLayoutEffect(() => {
    if (navigation) {
      navigation?.setOptions({
        title: `Task #${route.params.taskName}`,
        headerBackVisible: true,
      });
    }
  }, [navigation, route.params.taskName]);

  if (isLoading) {
    return <ActivityIndicatorView light />;
  }
  return (<></>);
};
