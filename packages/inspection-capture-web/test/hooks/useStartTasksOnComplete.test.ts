import { waitFor, renderHook } from '@testing-library/react';
import { LoadingState } from '@monkvision/common';
import { sights } from '@monkvision/sights';
import { useMonitoring } from '@monkvision/monitoring';
import { useMonkApi } from '@monkvision/network';
import { Sight, TaskName } from '@monkvision/types';
import { createFakePromise } from '@monkvision/test-utils';
import { useStartTasksOnComplete, UseStartTasksOnCompleteParams } from '../../src/hooks';

function createParams(): UseStartTasksOnCompleteParams {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    sights: [
      sights['test-sight-1'],
      sights['test-sight-2'],
      sights['test-sight-3'],
      sights['test-sight-4'],
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

    result.current();
    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();
    expect(initialProps.loading.onError).not.toHaveBeenCalled();
    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(handleErrorMock).not.toHaveBeenCalled();
    expect(startInspectionTasksMock).not.toHaveBeenCalled();

    unmount();
  });

  it('should start the tasks given in the startTasksOnComplete param', () => {
    const initialProps = {
      ...createParams(),
      tasksBySight: {
        'test-sight-1': [TaskName.DAMAGE_DETECTION],
        'test-sight-2': [TaskName.DAMAGE_DETECTION],
        'test-sight-3': [TaskName.DAMAGE_DETECTION],
        'test-sight-4': [TaskName.DAMAGE_DETECTION],
      },
      additionalTasks: [TaskName.IMAGE_EDITING],
      startTasksOnComplete: [TaskName.DASHBOARD_OCR, TaskName.WHEEL_ANALYSIS],
    };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current();
    expect(startInspectionTasksMock).toHaveBeenCalledWith({
      inspectionId: initialProps.inspectionId,
      names: initialProps.startTasksOnComplete,
    });

    unmount();
  });

  it('should start the tasks given in the tasksBySight param if startTasksOnComplete is true', () => {
    const defaultProps = createParams();
    const initialProps = {
      ...defaultProps,
      startTasksOnComplete: true,
      tasksBySight: {
        'test-sight-1': [TaskName.DAMAGE_DETECTION, TaskName.PRICING],
        'test-sight-2': [TaskName.DASHBOARD_OCR],
        'test-sight-3': [TaskName.DAMAGE_DETECTION, TaskName.IMAGES_OCR],
        'test-sight-4': [TaskName.WHEEL_ANALYSIS],
      },
    };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current();
    expect(startInspectionTasksMock).toHaveBeenCalledWith({
      inspectionId: initialProps.inspectionId,
      names: [
        TaskName.DAMAGE_DETECTION,
        TaskName.PRICING,
        TaskName.DASHBOARD_OCR,
        TaskName.IMAGES_OCR,
        TaskName.WHEEL_ANALYSIS,
      ],
    });

    unmount();
  });

  it('should start the sight tasks of tasksBySight in priority and fill with the default and additional tasks', () => {
    const defaultProps = createParams();
    const initialProps = {
      ...defaultProps,
      startTasksOnComplete: true,
      sights: [
        { id: 'test-sight-1', tasks: [TaskName.DAMAGE_DETECTION, TaskName.PRICING] },
        { id: 'test-sight-2', tasks: [TaskName.WHEEL_ANALYSIS, TaskName.PRICING] },
        { id: 'test-sight-3', tasks: [TaskName.IMAGES_OCR, TaskName.PRICING] },
        {
          id: 'test-sight-4',
          tasks: [TaskName.DAMAGE_DETECTION, TaskName.PRICING, TaskName.DASHBOARD_OCR],
        },
      ] as Sight[],
      tasksBySight: {
        'test-sight-1': [TaskName.DAMAGE_DETECTION, TaskName.PRICING, TaskName.IMAGE_EDITING],
        'test-sight-2': [TaskName.REPAIR_ESTIMATE],
      },
      additionalTasks: [TaskName.INSPECTION_PDF, TaskName.DASHBOARD_OCR],
    };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current();
    expect(startInspectionTasksMock).toHaveBeenCalledWith({
      inspectionId: initialProps.inspectionId,
      names: [
        TaskName.DAMAGE_DETECTION,
        TaskName.PRICING,
        TaskName.IMAGE_EDITING,
        TaskName.REPAIR_ESTIMATE,
        TaskName.IMAGES_OCR,
        TaskName.DASHBOARD_OCR,
        TaskName.INSPECTION_PDF,
      ],
    });

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

    result.current();
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

    result.current().catch((e) => console.log('b', e));
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

  it('should not start the Human in the Loop task', () => {
    const initialProps = {
      ...createParams(),
      startTasksOnComplete: [TaskName.WHEEL_ANALYSIS, TaskName.HUMAN_IN_THE_LOOP],
    };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;
    result.current();
    expect(startInspectionTasksMock).toHaveBeenCalledWith(
      expect.objectContaining({
        names: [TaskName.WHEEL_ANALYSIS],
      }),
    );

    unmount();
  });

  it('should start the DD task and fill with the additional tasks if no sights are provided', () => {
    const defaultProps = createParams();
    const initialProps = {
      ...defaultProps,
      startTasksOnComplete: true,
      sights: undefined,
      tasksBySight: {
        'test-sight-1': [TaskName.DAMAGE_DETECTION, TaskName.PRICING, TaskName.IMAGE_EDITING],
        'test-sight-2': [TaskName.REPAIR_ESTIMATE],
      },
      additionalTasks: [TaskName.INSPECTION_PDF, TaskName.DASHBOARD_OCR],
    };
    const { result, unmount } = renderHook(useStartTasksOnComplete, { initialProps });

    const startInspectionTasksMock = (useMonkApi as jest.Mock).mock.results[0].value
      .startInspectionTasks;

    result.current();
    expect(startInspectionTasksMock).toHaveBeenCalledWith({
      inspectionId: initialProps.inspectionId,
      names: [TaskName.DAMAGE_DETECTION, TaskName.INSPECTION_PDF, TaskName.DASHBOARD_OCR],
    });

    unmount();
  });
});
