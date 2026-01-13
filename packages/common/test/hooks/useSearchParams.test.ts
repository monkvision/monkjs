import { renderHook } from '@testing-library/react';
import { useSearchParams } from '../../src';

describe('useSearchParams hook', () => {
  it('should return the proper search params using the window.location property', () => {
    window.history.pushState({}, '', '/page?test=1&testtest=2');

    const { result, unmount } = renderHook(useSearchParams);

    expect(result.current.get('test')).toEqual('1');
    expect(result.current.get('testtest')).toEqual('2');
    expect(result.current.get('unknown')).toBeNull();

    unmount();
  });
});
