import { renderHook } from '@testing-library/react-hooks';
import { LoadingState, useAsyncEffect } from '@monkvision/common';
import { Sight, TaskName } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { sights } from '@monkvision/sights';
import { useMonkApi } from '@monkvision/network';
import { act } from '@testing-library/react';
import {
  PhotoCaptureSightsParams,
  usePhotoCaptureSightState,
} from '../../../src/PhotoCapture/hooks';
import { PhotoCaptureErrorName } from '../../../src/PhotoCapture/errors';

function createParams(): PhotoCaptureSightsParams {
  return {
    inspectionId: 'test-inspection-id',
    captureSights: [
      sights['test-sight-1'],
      sights['test-sight-2'],
      sights['test-sight-3'],
      sights['test-sight-4'],
    ],
    apiConfig: { apiDomain: 'test-api-domain', authToken: 'test-auth-token' },
    loading: {
      start: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    } as unknown as LoadingState,
    onLastSightTaken: jest.fn(),
  };
}

function mockGetInspectionResponse(inspectionId: string, takenSights: Sight[], tasks?: TaskName[]) {
  return {
    action: {
      payload: {
        images: takenSights.map((sight, index) => ({
          inspectionId,
          additionalData: { sight_id: sight.id },
          path: `test-path-${index}`,
          mimetype: `test-mimetype-${index}`,
          width: index * 2000,
          height: index * 1000,
        })),
        tasks: tasks?.map((name) => ({ inspectionId, name })),
      },
    },
  };
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
    expect(result.current.lastPictureTaken).toBeNull();
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
    expect(getInspectionMock).toHaveBeenCalledWith(initialProps.inspectionId);

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
    const { images } = apiResponse.action.payload;
    expect(result.current.lastPictureTaken).toEqual({
      uri: images[images.length - 1].path,
      mimetype: images[images.length - 1].mimetype,
      width: images[images.length - 1].width,
      height: images[images.length - 1].height,
    });
    expect(initialProps.loading.onSuccess).toHaveBeenCalled();

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
});
