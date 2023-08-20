import * as MonkMonitoring from '@monkvision/monitoring';
import { MonitoringAdapter } from '@monkvision/monitoring';

export interface UseMonitoringSpys {
  handleError: jest.SpyInstance;
}

export interface UseMonitoringMock {
  adapter: MonitoringAdapter;
  spys: UseMonitoringSpys;
}

export function mockUseMonitoring(): UseMonitoringMock {
  const adapter = { handleError: jest.fn() } as unknown as MonitoringAdapter;
  Object.defineProperty(MonkMonitoring, 'useMonitoring', {
    value: jest.fn(() => adapter),
    configurable: true,
    writable: true,
  });
  const spys = { handleError: jest.spyOn(adapter, 'handleError') };
  return { adapter, spys };
}
