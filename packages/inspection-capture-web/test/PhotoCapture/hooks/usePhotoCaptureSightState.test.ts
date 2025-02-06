import { renderHook } from '@testing-library/react-hooks';
import { LoadingState, useAsyncEffect, useMonkState } from '@monkvision/common';
import {
  ComplianceIssue,
  Image,
  ImageStatus,
  MonkEntityType,
  ProgressStatus,
  Sight,
  TaskName,
} from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { sights } from '@monkvision/sights';
import { GetInspectionResponse, useMonkApi } from '@monkvision/network';
import { act } from '@testing-library/react';
import {
  PhotoCaptureSightsParams,
  usePhotoCaptureSightState,
} from '../../../src/PhotoCapture/hooks';
import { PhotoCaptureErrorName } from '../../../src/PhotoCapture/errors';
import { useAnalytics } from '@monkvision/analytics';

function createParams(): PhotoCaptureSightsParams {
  return {
    inspectionId: 'test-inspection-id',
    captureSights: [
      sights['test-sight-1'],
      sights['test-sight-2'],
      sights['test-sight-3'],
      sights['test-sight-4'],
    ],
    apiConfig: {
      apiDomain: 'test-api-domain',
      authToken: 'test-auth-token',
      thumbnailDomain: 'test-thumbnail-domain',
    },
    loading: {
      start: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    } as unknown as LoadingState,
    onLastSightTaken: jest.fn(),
    complianceOptions: {
      enableCompliance: true,
      complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
      enableCompliancePerSight: ['test-sight'],
      complianceIssuesPerSight: { test: [ComplianceIssue.OVEREXPOSURE] },
      useLiveCompliance: true,
    },
    setIsInitialInspectionFetched: jest.fn(),
    startTasks: jest.fn(() => Promise.resolve()),
    onComplete: jest.fn(),
    enableAutoComplete: false,
  };
}

function mockGetInspectionResponse(
  inspectionId: string,
  takenSights: Sight[],
  tasks: TaskName[] = [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
  nonCompliantSightIndex = -1,
) {
  const apiResponse: GetInspectionResponse = {
    entities: {
      images: [],
      tasks: tasks.map((name) => ({
        inspectionId,
        name,
        entityType: MonkEntityType.TASK,
        id: name,
        images: [],
        status: ProgressStatus.NOT_STARTED,
      })),
      damages: [],
      parts: [],
      inspections: [],
      partOperations: [],
      renderedOutputs: [],
      severityResults: [],
      vehicles: [],
      views: [],
      pricings: [],
    },
  };
  takenSights.forEach((sight, index) => {
    apiResponse.entities.images.push({
      inspectionId,
      sightId: sight.id,
      createdAt: Date.parse('2020-01-01T01:01:01.001Z'),
      path: `test-path-${index}`,
      mimetype: `test-mimetype-${index}`,
      width: index * 2000,
      height: index * 1000,
      status: nonCompliantSightIndex === index ? ImageStatus.NOT_COMPLIANT : ImageStatus.SUCCESS,
    } as Image);
    apiResponse.entities.images.push({
      inspectionId,
      sightId: sight.id,
      createdAt: Date.parse('1998-01-01T01:01:01.001Z'),
      path: `test-path-old-${index}`,
      mimetype: `test-mimetype-old-${index}`,
      width: index * 4000,
      height: index * 2000,
      status: ImageStatus.NOT_COMPLIANT,
    } as Image);
  });
  (useMonkState as jest.Mock).mockImplementation(() => ({ state: apiResponse.entities }));
  return apiResponse;
}

describe('usePhotoCaptureSightState hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error if there are no sights are passed', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const initialProps = { ...createParams(), captureSights: [] };
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });
    expect(result.error).toBeDefined();
    unmount();
    jest.spyOn(console, 'error').mockRestore();
  });

  it('should throw an error if the inspection is missing some tasks', () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    const initialProps = {
      ...createParams(),
      tasksBySight: {
        'test-sight-1': [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
        'test-sight-2': [TaskName.DAMAGE_DETECTION],
        'test-sight-3': [TaskName.DAMAGE_DETECTION],
        'test-sight-4': [TaskName.DAMAGE_DETECTION],
      },
    };
    const apiResponse = mockGetInspectionResponse(
      initialProps.inspectionId,
      [],
      [TaskName.DAMAGE_DETECTION],
    );
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useMonitoring).toHaveBeenCalled();
    const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
    expect(handleErrorMock).not.toHaveBeenCalled();
    expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();
    expect(useAsyncEffect).toHaveBeenCalled();
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));

    expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();
    expect(initialProps.loading.onError).toHaveBeenCalled();
    const error = (initialProps.loading.onError as jest.Mock).mock.calls[0][0];
    expect(error.name).toEqual(PhotoCaptureErrorName.MISSING_TASK_IN_INSPECTION);
    expect(handleErrorMock).toHaveBeenCalledWith(error);
    unmount();
    jest.spyOn(console, 'error').mockRestore();
  });

  it('should properly initialize the state', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });
    expect(result.current.selectedSight).toEqual(initialProps.captureSights[0]);
    expect(result.current.sightsTaken).toEqual([]);
    expect(result.current.lastPictureTakenUri).toBeNull();
    unmount();
  });

  it('should start a request to fetch the inspection state from the API', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useMonkApi).toHaveBeenCalledWith(initialProps.apiConfig);
    const getInspectionMock = (useMonkApi as jest.Mock).mock.results[0].value.getInspection;
    expect(initialProps.loading.start).not.toHaveBeenCalled();
    expect(getInspectionMock).not.toHaveBeenCalled();
    expect(useAsyncEffect).toHaveBeenCalled();
    const effect = (useAsyncEffect as jest.Mock).mock.calls[0][0];
    effect();
    expect(initialProps.loading.start).toHaveBeenCalled();
    expect(getInspectionMock).toHaveBeenCalledWith({
      id: initialProps.inspectionId,
      compliance: initialProps.complianceOptions,
    });

    unmount();
  });

  it('should properly update the taken sights after the getInspection API call', () => {
    const initialProps = createParams();
    const takenSights = [initialProps.captureSights[0], initialProps.captureSights[1]];
    const apiResponse = mockGetInspectionResponse(initialProps.inspectionId, takenSights);
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(initialProps.loading.onSuccess).not.toHaveBeenCalled();
    expect(useAsyncEffect).toHaveBeenCalled();
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));

    expect(result.current.sightsTaken).toEqual(takenSights);
    expect(result.current.selectedSight).toEqual(
      initialProps.captureSights.filter((s) => !takenSights.includes(s))[0],
    );
    const { images } = apiResponse.entities;
    expect(result.current.lastPictureTakenUri).toEqual(images[images.length - 1].path);
    expect(initialProps.loading.onSuccess).toHaveBeenCalled();

    unmount();
  });

  it('should call onLastSightTaken if all sights have been taken after the getInspection API call', () => {
    const initialProps = createParams();
    const takenSights = initialProps.captureSights;
    const apiResponse = mockGetInspectionResponse(initialProps.inspectionId, takenSights);
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useAsyncEffect).toHaveBeenCalled();
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));
    expect(initialProps.onLastSightTaken).toHaveBeenCalled();

    unmount();
  });

  it('should select the first non compliant sight if all sights are taken after the getInspection API call', () => {
    const initialProps = createParams();
    const takenSights = initialProps.captureSights;
    const sightToRetake = 2;
    const apiResponse = mockGetInspectionResponse(
      initialProps.inspectionId,
      takenSights,
      [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS],
      sightToRetake,
    );
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useAsyncEffect).toHaveBeenCalled();
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));
    expect(result.current.selectedSight).toEqual(initialProps.captureSights[sightToRetake]);
    expect(result.current.sightsTaken).not.toContain(initialProps.captureSights[sightToRetake]);

    unmount();
  });

  it('should select the last sight if all sights are taken and compliant after the getInspection API call', () => {
    const initialProps = createParams();
    const takenSights = initialProps.captureSights;
    const apiResponse = mockGetInspectionResponse(initialProps.inspectionId, takenSights);
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useAsyncEffect).toHaveBeenCalled();
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));
    expect(result.current.selectedSight).toEqual(
      initialProps.captureSights[initialProps.captureSights.length - 1],
    );
    expect(result.current.sightsTaken).not.toContain(
      initialProps.captureSights[initialProps.captureSights.length - 1],
    );

    unmount();
  });

  it('should properly handle the error returned from the getInspection API call', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useMonitoring).toHaveBeenCalled();
    const handleErrorMock = (useMonitoring as jest.Mock).mock.results[0].value.handleError;
    expect(handleErrorMock).not.toHaveBeenCalled();
    expect(initialProps.loading.onError).not.toHaveBeenCalled();
    expect(useAsyncEffect).toHaveBeenCalled();
    const { onReject } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    const err = { test: 'hello' };
    act(() => onReject(err));

    expect(handleErrorMock).toHaveBeenCalledWith(err);
    expect(initialProps.loading.onError).toHaveBeenCalledWith(err);

    unmount();
  });

  it('should fetch the inspection state again when the inspectionId changes', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    expect(useAsyncEffect).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([initialProps.inspectionId]),
      expect.anything(),
    );

    unmount();
  });

  it('should fetch the inspection state again when the retry function is called', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    const retryDep = (useAsyncEffect as jest.Mock).mock.calls[0][1].filter(
      (dep: any) => dep !== initialProps.inspectionId,
    )[0];
    act(() => result.current.retryLoadingInspection());
    const newRetryDep = (useAsyncEffect as jest.Mock).mock.calls[1][1].filter(
      (dep: any) => dep !== initialProps.inspectionId,
    )[0];
    expect(Object.is(retryDep, newRetryDep)).toBe(false);

    unmount();
  });

  it('should properly update the state when a sight is taken', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    act(() => result.current.takeSelectedSight());
    expect(result.current.sightsTaken).toEqual([initialProps.captureSights[0]]);
    expect(result.current.selectedSight).toEqual(initialProps.captureSights[1]);

    unmount();
  });

  it('should call onLastSightTaken when the last sight is taken', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    act(() => result.current.takeSelectedSight());
    act(() => result.current.takeSelectedSight());
    act(() => result.current.takeSelectedSight());
    expect(initialProps.onLastSightTaken).not.toHaveBeenCalled();
    act(() => result.current.takeSelectedSight());
    expect(initialProps.onLastSightTaken).toHaveBeenCalled();

    unmount();
  });

  it('should call handleInspectionCompleted when the last sight is taken, enableAutoComplete is true, and every pictures are compliants', async () => {
    const initialProps = { ...createParams(), enableAutoComplete: true };
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    act(() => result.current.takeSelectedSight());
    act(() => result.current.takeSelectedSight());
    act(() => result.current.takeSelectedSight());
    expect(initialProps.onLastSightTaken).not.toHaveBeenCalled();
    // act(() => result.current.takeSelectedSight());

    await act(async () => {
      result.current.takeSelectedSight(); // Take Sight 4
    });
    expect(initialProps.startTasks).toHaveBeenCalled(); // Ensure startTasks was called
    expect(initialProps.onComplete).toHaveBeenCalled(); // Ensure onComplete was called
    expect(result.current.isInspectionCompleted).toBe(true);
    expect(initialProps.onLastSightTaken).not.toHaveBeenCalled();

    unmount();
  });

  it('should change the sightSelected when retaking a sight', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });

    act(() => result.current.takeSelectedSight());
    act(() => result.current.takeSelectedSight());
    act(() => result.current.retakeSight('test-sight-1'));
    expect(result.current.selectedSight).toEqual(sights['test-sight-1']);

    unmount();
  });

  it('should set user and events properties for analytics', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });
    const { setUserProperties, setEventsProperties } = (useAnalytics as jest.Mock).mock.results[0]
      .value;
    const effect = (useAsyncEffect as jest.Mock).mock.calls[0][0];
    effect();
    expect(setUserProperties).toBeCalledTimes(1);
    expect(setEventsProperties).toBeCalledTimes(1);
    unmount();
  });

  it('should track Capture Started event, set user & events properties a 2nd time after the getInspection API call', () => {
    const initialProps = createParams();
    const takenSights = [initialProps.captureSights[0], initialProps.captureSights[1]];
    const apiResponse = mockGetInspectionResponse(initialProps.inspectionId, takenSights);
    const { unmount } = renderHook(usePhotoCaptureSightState, { initialProps });
    const { trackEvent, setUserProperties, setEventsProperties } = (useAnalytics as jest.Mock).mock
      .results[0].value;
    const effect = (useAsyncEffect as jest.Mock).mock.calls[0][0];
    effect();
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));

    expect(trackEvent).toBeCalledTimes(1);
    expect(trackEvent.mock.calls[0][0]).toBe('Capture Started');
    expect(setUserProperties).toBeCalledTimes(2);
    expect(setEventsProperties).toBeCalledTimes(2);

    unmount();
  });
  it('should return true if the task is not started', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });
    expect(result.current.isInspectionCompleted).toBe(false);
    unmount();
  });
  it('should return false if the one task is in other state than not started', () => {
    const initialProps = createParams();
    const takenSights = [initialProps.captureSights[0], initialProps.captureSights[1]];
    const apiResponse = mockGetInspectionResponse(initialProps.inspectionId, takenSights);
    const { result, unmount } = renderHook(usePhotoCaptureSightState, { initialProps });
    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    act(() => onResolve(apiResponse));
    expect(result.current.isInspectionCompleted).toBe(false);
    unmount();
  });
});
