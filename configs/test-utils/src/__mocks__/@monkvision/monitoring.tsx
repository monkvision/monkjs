const { Severity, TransactionStatus } = jest.requireActual('@monkvision/monitoring');

const createTransactionMock = jest.fn(() => ({
  id: '',
  setTag: jest.fn(),
  startMeasurement: jest.fn(),
  stopMeasurement: jest.fn(),
  setMeasurementTag: jest.fn(),
  setMeasurement: jest.fn(),
  finish: jest.fn(),
}));

class MonitoringAdapterMock {
  setUserId = jest.fn();
  log = jest.fn();
  handleError = jest.fn();
  createTransaction = createTransactionMock;
}

export = {
  /* Custom Mock Exports */
  MonitoringAdapterMock,

  /* Actual exports */
  Severity,
  TransactionStatus,

  /* Mocks */
  EmptyMonitoringAdapter: MonitoringAdapterMock,
  DebugMonitoringAdapter: MonitoringAdapterMock,
  useMonitoring: jest.fn(() => ({
    setUserId: jest.fn(),
    log: jest.fn(),
    handleError: jest.fn(),
    createTransaction: createTransactionMock,
    setTags: jest.fn(),
  })),
  MonitoringProvider: jest.fn(({ children }) => <>{children}</>),
};
