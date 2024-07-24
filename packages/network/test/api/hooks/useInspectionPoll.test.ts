jest.mock('../../../src/api/react', () => ({
  useMonkApi: jest.fn(() => ({ getInspection: jest.fn() })),
}));

import { useAsyncInterval } from '@monkvision/common';
import { ComplianceIssue } from '@monkvision/types';
import { renderHook } from '@testing-library/react-hooks';
import { useMonitoring } from '@monkvision/monitoring';
import { useInspectionPoll, UseInspectionPollParams, useMonkApi } from '../../../src';

function createParams(): UseInspectionPollParams {
  return {
    id: 'test-id-test',
    delay: 1234,
    apiConfig: {
      apiDomain: 'test-api-domain-test',
      authToken: 'test-auth-token-test',
      thumbnailDomain: 'thumbnailDomain',
    },
    onSuccess: jest.fn(),
    compliance: {
      enableCompliance: true,
      complianceIssues: [ComplianceIssue.INTERIOR_NOT_SUPPORTED],
    },
  };
}

describe('useInspectionPoll hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an async interval using the getInspection API request', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(useInspectionPoll, { initialProps });

    expect(useMonkApi).toHaveBeenCalledWith(initialProps.apiConfig);
    const { getInspection } = (useMonkApi as jest.Mock).mock.results[0].value;
    expect(useAsyncInterval).toHaveBeenCalled();
    const callback = (useAsyncInterval as jest.Mock).mock.calls[0][0];

    expect(getInspection).not.toHaveBeenCalled();
    callback();
    expect(getInspection).toHaveBeenCalledWith({
      id: initialProps.id,
      compliance: initialProps.compliance,
    });

    unmount();
  });

  it('should pass the proper delay to the useAsyncInterval hook', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(useInspectionPoll, { initialProps });

    expect(useAsyncInterval).toHaveBeenCalledWith(
      expect.anything(),
      initialProps.delay,
      expect.anything(),
    );

    unmount();
  });

  it('should call onSuccess when the inspection is fetched', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(useInspectionPoll, { initialProps });

    expect(useAsyncInterval).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        onResolve: expect.any(Function),
      }),
    );
    const { onResolve } = (useAsyncInterval as jest.Mock).mock.calls[0][2];
    const entities = 'test';
    expect(initialProps.onSuccess).not.toHaveBeenCalled();
    onResolve({ entities });
    expect(initialProps.onSuccess).toHaveBeenCalledWith(entities);

    unmount();
  });

  it('should call handleError when the inspection fetch fails', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(useInspectionPoll, { initialProps });

    expect(useMonitoring).toHaveBeenCalled();
    const { handleError } = (useMonitoring as jest.Mock).mock.results[0].value;
    expect(useAsyncInterval).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({
        onReject: expect.any(Function),
      }),
    );
    const { onReject } = (useAsyncInterval as jest.Mock).mock.calls[0][2];
    const err = 'test-error';
    expect(handleError).not.toHaveBeenCalled();
    onReject(err);
    expect(handleError).toHaveBeenCalledWith(err);

    unmount();
  });
});
