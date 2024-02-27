import { waitFor } from '@testing-library/react';

jest.mock('@monkvision/common');
jest.mock('@monkvision/network');

import { renderHook } from '@testing-library/react-hooks';
import { flatMap, LoadingState, uniq } from '@monkvision/common';
import { sights } from '@monkvision/sights';
import { useMonitoring } from '@monkvision/monitoring';
import { useMonkApi } from '@monkvision/network';
import { TaskName } from '@monkvision/types';
import { createFakePromise } from '@monkvision/test-utils';
import {
  useStartTasksOnComplete,
  UseStartTasksOnCompleteParams,
} from '../../../src/PhotoCapture/hooks/useStartTasksOnComplete';

function createParams(): UseStartTasksOnCompleteParams {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: { apiDomain: 'test-api-domain', authToken: 'test-auth-token' },
    sights: [
      sights['fesc20-0mJeXBDf'],
      sights['fesc20-26n47kaO'],
      sights['fesc20-2bLRuhEQ'],
      sights['fesc20-4Wqx52oU'],
    ],
    loading: {
      start: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    } as unknown as LoadingState,
  };
}

describe('useStartTasksOnComplete hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should do nothing if startTasksOnComplete is false', () => {
    const initialProps = { ...createParams(), startTasksOnComplete: false };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    expect(useMonitoring).toHaveBeenCalled();
    const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
    expect(useMonkApi).toHaveBeenCalledWith(initialProps.apiConfig);
    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current.startTasks();
    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();
    expect(initialProps.loading.onError).not.toHaveBeenCalled();
    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(handleErrorMock).not.toHaveBeenCalled();
    expect(startInspectionTasksMock).not.toHaveBeenCalled();

    unmount();
  });

  it('should start the tasks given in the startTasksOnComplete param', () => {
    const initialProps = { ...createParams(), startTasksOnComplete: [TaskName.DASHBOARD_OCR] };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current.startTasks();
    expect(startInspectionTasksMock).toHaveBeenCalledWith(
      initialProps.inspectionId,
      initialProps.startTasksOnComplete,
    );

    unmount();
  });

  it('should start the tasks given in the tasksBySight param if startTasksOnComplete is true', () => {
    const defaultProps = createParams();
    const initialProps = {
      ...defaultProps,
      startTasksOnComplete: true,
      tasksBySight: {
        'fesc20-0mJeXBDf': [TaskName.DAMAGE_DETECTION, TaskName.PRICING],
        'fesc20-26n47kaO': [TaskName.DASHBOARD_OCR],
        'fesc20-2bLRuhEQ': [TaskName.DAMAGE_DETECTION, TaskName.IMAGES_OCR],
        'fesc20-4Wqx52oU': [TaskName.WHEEL_ANALYSIS],
      },
    };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current.startTasks();
    expect(startInspectionTasksMock).toHaveBeenCalledWith(initialProps.inspectionId, [
      TaskName.DAMAGE_DETECTION,
      TaskName.PRICING,
      TaskName.DASHBOARD_OCR,
      TaskName.IMAGES_OCR,
      TaskName.WHEEL_ANALYSIS,
    ]);

    unmount();
  });

  it('should start the sight tasks if startTasksOnComplete is true and no tasksBySight is given', () => {
    const defaultProps = createParams();
    const initialProps = { ...defaultProps, startTasksOnComplete: true };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current.startTasks();
    const tasks = uniq(flatMap(initialProps.sights, (sight) => sight.tasks));
    expect(startInspectionTasksMock).toHaveBeenCalledWith(initialProps.inspectionId, tasks);

    unmount();
  });

  it('should properly handle loading and error in case of success', async () => {
    const promise = createFakePromise<void>();
    const startInspectionTasksMock = jest.fn(() => promise);
    (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
      startInspectionTasks: startInspectionTasksMock,
    }));
    const initialProps = { ...createParams(), startTasksOnComplete: [TaskName.DASHBOARD_OCR] };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;

    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(startInspectionTasksMock).not.toHaveBeenCalled();

    result.current.startTasks();
    expect(initialProps.loading.start).toHaveBeenCalled();
    expect(startInspectionTasksMock).toHaveBeenCalled();
    expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();

    promise.resolve();
    await waitFor(() => {
      expect(initialProps.loading.onSuccess).toHaveBeenCalled();
      expect(initialProps.loading.onError).not.toHaveBeenCalled();
      expect(handleErrorMock).not.toHaveBeenCalled();
    });

    unmount();
  });

  it('should properly handle loading and error in case of error', async () => {
    const promise = createFakePromise<void>();
    const startInspectionTasksMock = jest.fn(() => promise);
    (useMonkApi as jest.Mock).mockImplementationOnce(() => ({
      startInspectionTasks: startInspectionTasksMock,
    }));
    const initialProps = { ...createParams(), startTasksOnComplete: [TaskName.DASHBOARD_OCR] };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;

    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(startInspectionTasksMock).not.toHaveBeenCalled();

    result.current.startTasks().catch((e) => console.log('beuh', e));
    expect(initialProps.loading.start).toHaveBeenCalled();
    expect(startInspectionTasksMock).toHaveBeenCalled();
    expect(initialProps.loading.onError).not.toHaveBeenCalled();
    expect(handleErrorMock).not.toHaveBeenCalled();

    const err = new Error('test');
    promise.reject(err);
    await waitFor(() => {
      expect(initialProps.loading.onError).toHaveBeenCalledWith(err);
      expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();
      expect(handleErrorMock).toHaveBeenCalledWith(err);
    });

    unmount();
  });
});
