import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';

import useAuth from 'hooks/useAuth';

export default function useUpdateOneTask(id, taskName) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const axiosRequest = useCallback(() => monk.entity.task.updateOne(id, taskName, {
    status: monk.types.ProgressStatus.TODO,
  }), [id, taskName]);

  const handleRequestSuccess = useCallback(({ entities, result }) => {
    dispatch(monk.actions.updatedOneTask({ entities, result }));
  }, [dispatch]);

  const canRequest = useCallback(() => isAuthenticated, [isAuthenticated]);

  const request = useRequest({
    request: axiosRequest,
    onRequestSuccess: handleRequestSuccess,
    canRequest,
  });

  const startUpdateOneTask = useCallback(() => {
    if (request.state.count < 1) { request.start(); }
  }, [request.start]);

  return { startUpdateOneTask };
}
