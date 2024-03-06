import { InternalCameraMonitoringConfig } from '../../src/Camera/monitoring';

export function createMockInternalMonitoringConfig(): InternalCameraMonitoringConfig {
  return {
    transaction: {
      startMeasurement: jest.fn(),
      stopMeasurement: jest.fn(),
      setMeasurement: jest.fn(),
    },
    tags: { testTagName: 'testTagValue' },
    data: { testDataKey: 'testDataValue' },
  } as unknown as InternalCameraMonitoringConfig;
}
