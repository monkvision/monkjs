import { renderHook } from '@testing-library/react-hooks';
import { LoadingState, useAsyncEffect } from '@monkvision/common';
import { ComplianceIssue } from '@monkvision/types';
import { useMonitoring } from '@monkvision/monitoring';
import { useMonkApi } from '@monkvision/network';
import { act } from '@testing-library/react';
import {
  DamageDisclosureParams,
  useDamageDisclosureState,
} from '../../../src/DamageDisclosure/hooks';
// import { DamageDisclosureErrorName } from '../../../src/PhotoCapture/errors';

function createParams(): DamageDisclosureParams {
  return {
    inspectionId: 'test-inspection-id',
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
    complianceOptions: {
      enableCompliance: true,
      complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
      enableCompliancePerSight: ['test-sight'],
      complianceIssuesPerSight: { test: [ComplianceIssue.OVEREXPOSURE] },
      useLiveCompliance: true,
    },
  };
}

describe('useDamageDisclosureSightState hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should properly initialize the state', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(useDamageDisclosureState, { initialProps });
    expect(result.current.lastPictureTakenUri).toBeNull();
    unmount();
  });

  it('should start a request to fetch the inspection state from the API', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(useDamageDisclosureState, { initialProps });

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

  it('should properly handle the error returned from the getInspection API call', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(useDamageDisclosureState, { initialProps });

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
    const { unmount } = renderHook(useDamageDisclosureState, { initialProps });

    expect(useAsyncEffect).toHaveBeenCalledWith(
      expect.anything(),
      expect.arrayContaining([initialProps.inspectionId]),
      expect.anything(),
    );

    unmount();
  });

  it('should fetch the inspection state again when the retry function is called', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(useDamageDisclosureState, { initialProps });

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
});
