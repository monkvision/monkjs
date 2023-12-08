export function mockButtonDependencies(): void {
  jest.mock('../../../src/components/Spinner', () => ({
    Spinner: jest.fn(() => <></>),
  }));

  jest.mock('../../../src/icons', () => ({
    Icon: jest.fn(() => <></>),
  }));

  jest.mock('@monkvision/common');
}
