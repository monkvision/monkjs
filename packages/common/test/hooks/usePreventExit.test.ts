import { renderHook } from '@testing-library/react-hooks';
import { usePreventExit } from '../../src';

describe('usePreventExit hook', () => {
  it('should properly set and unset the onbeforeunload event handler', () => {
    const { unmount } = renderHook(usePreventExit);
    expect(window.onbeforeunload).toBeDefined();
    unmount();
    expect(window.onbeforeunload).toBeNull();
  });

  it('should prompt the user when trying to leave the page', () => {
    const { unmount } = renderHook(usePreventExit);
    const event = new Event('beforeunload', { cancelable: true });
    const returnValue = window.onbeforeunload?.(event);
    expect(returnValue).toEqual('Are you sure you want to leave?');
    unmount();
  });
});
