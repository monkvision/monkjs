import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import monk from '@monkvision/corejs';
import { useRequest } from '@monkvision/toolkit';

import useAuth from 'hooks/useAuth';

export default function useUpdateOneTask(id, taskName, when) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();

  const axiosRequest = useCallback(async () => monk.entity.task.updateOne(id, taskName, {
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

  useEffect(() => {
    if (when && request.state.count < 1) { request.start(); }
  }, [when, request.start]);
}
