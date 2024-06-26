import { renderHook } from '@testing-library/react-hooks';
import { usePreventExit } from '../../src/PreventExit/hooks';
import { createPreventExitListener } from '../../src/PreventExit/store';

jest.mock('../../src/PreventExit/store', () => ({
  createPreventExitListener: jest.fn(() => ({
    cleanup: jest.fn(),
    setPreventExit: jest.fn(),
    allowRedirect: jest.fn(),
  })),
}));
describe('PreventExit hook usePreventExit', () => {
  let spyCreatePreventExitListener: jest.SpyInstance<typeof createPreventExitListener>;
  beforeEach(() => {
    spyCreatePreventExitListener = jest.spyOn(
      require('../../src/PreventExit/store'),
      'createPreventExitListener',
    );
  });
  afterEach(() => jest.clearAllMocks());

  it('should clean up when unmount', () => {
    const { unmount } = renderHook(() => usePreventExit(true));
    unmount();
    expect(spyCreatePreventExitListener.mock.results.at(-1)?.value.cleanup).toHaveBeenCalledTimes(
      1,
    );
  });

  it('should set preventExit when value changes', async () => {
    const { rerender } = renderHook((props) => usePreventExit(props), {
      initialProps: true,
    });
    expect(
      spyCreatePreventExitListener.mock.results.at(-1)?.value.setPreventExit,
    ).toHaveBeenCalledTimes(1);
    rerender(false);
    expect(
      spyCreatePreventExitListener.mock.results.at(-1)?.value.setPreventExit,
    ).toHaveBeenCalledTimes(2);
    rerender(false);
    expect(
      spyCreatePreventExitListener.mock.results.at(-1)?.value.setPreventExit,
    ).toHaveBeenCalledTimes(2);
  });
});
