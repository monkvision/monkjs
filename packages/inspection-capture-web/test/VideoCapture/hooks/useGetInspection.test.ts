jest.mock('@monkvision/network');
jest.mock('@monkvision/monitoring');
jest.mock('@monkvision/common');

import { renderHook } from '@testing-library/react';
import { useMonkApi } from '@monkvision/network';
import { useMonitoring } from '@monkvision/monitoring';
import { useAsyncEffect } from '@monkvision/common';
import {
  useGetInspection,
  UseGetInspectionParams,
} from '../../../src/VideoCapture/hooks/useGetInspection';

function createProps(): UseGetInspectionParams {
  return {
    inspectionId: 'test-inspection-id',
    apiConfig: { apiDomain: 'test-api-domain', authToken: 'test-auth-token' } as any,
    loading: {
      start: jest.fn(),
      onSuccess: jest.fn(),
      onError: jest.fn(),
    } as any,
  };
}

describe('useGetInspection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call useMonkApi with the provided apiConfig', () => {
    const props = createProps();
    renderHook(useGetInspection, { initialProps: props });

    expect(useMonkApi).toHaveBeenCalledWith(props.apiConfig);
  });

  it('should call useAsyncEffect with the correct deps', () => {
    const props = createProps();
    renderHook(useGetInspection, { initialProps: props });

    expect(useAsyncEffect).toHaveBeenCalled();
    const deps = (useAsyncEffect as jest.Mock).mock.calls[0][1];
    expect(deps).toEqual([props.inspectionId]);
  });

  it('should call loading.start() and getInspection when the async effect runs', () => {
    const props = createProps();
    renderHook(useGetInspection, { initialProps: props });

    const { getInspection } = (useMonkApi as jest.Mock).mock.results[0].value;
    const effect = (useAsyncEffect as jest.Mock).mock.calls[0][0];
    effect();

    expect(props.loading.start).toHaveBeenCalled();
    expect(getInspection).toHaveBeenCalledWith({ id: props.inspectionId });
  });

  it('should call loading.onSuccess when the async effect resolves', () => {
    const props = createProps();
    renderHook(useGetInspection, { initialProps: props });

    const { onResolve } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    onResolve();

    expect(props.loading.onSuccess).toHaveBeenCalled();
  });

  it('should call handleError and loading.onError when the async effect rejects', () => {
    const props = createProps();
    renderHook(useGetInspection, { initialProps: props });

    const { handleError } = (useMonitoring as jest.Mock).mock.results[0].value;
    const { onReject } = (useAsyncEffect as jest.Mock).mock.calls[0][2];
    const err = new Error('test-error');
    onReject(err);

    expect(handleError).toHaveBeenCalledWith(err);
    expect(props.loading.onError).toHaveBeenCalledWith(err);
  });
});
