import { renderHook } from '@testing-library/react';
import { useTracking, TrackingParams } from '../../src/hooks';
import { useAnalytics } from '@monkvision/analytics';
import { useMonitoring } from '@monkvision/monitoring';
import { decodeMonkJwt } from '@monkvision/network';

function createParams(): TrackingParams {
  return {
    inspectionId: 'test-inspection-id',
    authToken: 'test-auth-token',
  };
}

describe('useTracking hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set analytics and monitoring correctly if authToken is decoded properly', () => {
    const initialProps = createParams();
    const monkJwtPayloadMock = { sub: 'test-sub-auth-token' };
    (decodeMonkJwt as jest.Mock).mockImplementationOnce(() => monkJwtPayloadMock);
    const { unmount } = renderHook((props) => useTracking(props as any), { initialProps });
    const analytics = (useAnalytics as jest.Mock).mock.results[0].value;
    const monitoring = (useMonitoring as jest.Mock).mock.results[0].value;

    expect(monitoring.setTags).toBeCalledWith({ inspectionId: initialProps.inspectionId });

    expect(analytics.setUserProperties).toBeCalledWith({ authToken: monkJwtPayloadMock.sub });
    expect(monitoring.setUserId).toBeCalledWith(monkJwtPayloadMock.sub);

    unmount();
  });

  it('should partially set analytics and monitoring if authToken is not decoded properly', () => {
    const initialProps = createParams();
    (decodeMonkJwt as jest.Mock).mockImplementationOnce(() => undefined);
    const { unmount } = renderHook((props) => useTracking(props as any), { initialProps });
    const analytics = (useAnalytics as jest.Mock).mock.results[0].value;
    const monitoring = (useMonitoring as jest.Mock).mock.results[0].value;

    expect(monitoring.setTags).toBeCalledWith({ inspectionId: initialProps.inspectionId });

    expect(analytics.setUserProperties).not.toBeCalled();
    expect(monitoring.setUserId).not.toBeCalled();

    unmount();
  });
});
