import { useIsMounted } from '../../src/hooks/useIsMounted';
import { renderHook } from '@testing-library/react-hooks';

describe('useIsMounted hook', () => {
  it('should return true when the component is mounted and false when unmounted', () => {
    const { result, unmount } = renderHook(useIsMounted);
    expect(result.current()).toBe(true);
    unmount();
    expect(result.current()).toBe(false);
  });
});
