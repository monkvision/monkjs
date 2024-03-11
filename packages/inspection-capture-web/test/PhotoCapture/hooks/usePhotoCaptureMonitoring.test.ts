import { renderHook } from '@testing-library/react-hooks';
import { decodeMonkJwt } from '@monkvision/network';
import {
  UsePhotoCaptureMonitoringParams,
  usePhotoCaptureMonitoring,
} from '../../../src/PhotoCapture/hooks';
import { PhotoCaptureMonitoringConfig } from '../../../src/PhotoCapture/monitoring';
import { useMonitoring } from '@monkvision/monitoring';
import { InspectionTransaction } from '../../../lib/PhotoCapture/monitoring';

const monitoring = {
  parentId: 'testParentId',
  tags: { testTagName: 'testTagValue' },
  data: { testDataKey: 'testDataValue' },
} as unknown as PhotoCaptureMonitoringConfig;

function createParams(): UsePhotoCaptureMonitoringParams {
  return {
    inspectionId: 'test-inspection-id',
    authToken: 'test-auth',
    monitoring,
    deps: ['test-deps'],
  };
}

describe('usePhotoCaptureMonitoring hook', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should set the setUserId monitoring', () => {
    const initialProps = createParams();
    (decodeMonkJwt as jest.Mock).mockImplementationOnce(() => ({
      azp: 'test-azp',
    }));
    const { unmount } = renderHook(usePhotoCaptureMonitoring, { initialProps });

    expect(decodeMonkJwt).toHaveBeenCalled();
    const jwtPayload = (decodeMonkJwt as jest.Mock).mock.results[0].value;
    const setUserIdMock = (useMonitoring as jest.Mock).mock.results[0].value.setUserId;
    expect(setUserIdMock).toHaveBeenCalledWith(jwtPayload.azp);

    unmount();
  });

  it('should create Inspection transaction', () => {
    const initialProps = createParams();
    const { unmount } = renderHook(usePhotoCaptureMonitoring, { initialProps });

    const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
      .createTransaction;
    expect(createTransactionMock).toHaveBeenCalledWith({
      ...InspectionTransaction,
      ...monitoring,
    });

    unmount();
  });

  it('should return PhotoCaptureMonitoringConfig with the expected transaction, data, and tags', () => {
    const initialProps = createParams();
    const { result, unmount } = renderHook(usePhotoCaptureMonitoring, { initialProps });

    const createTransactionMock = (useMonitoring as jest.Mock).mock.results[0].value
      .createTransaction;
    const transactionMock = createTransactionMock.mock.results[0].value;
    const childMonitoring = {
      transaction: transactionMock,
      data: monitoring?.data,
      tags: { inspectionId: initialProps.inspectionId, ...monitoring?.tags },
    };

    expect(result.current).toEqual(childMonitoring);

    unmount();
  });
});
