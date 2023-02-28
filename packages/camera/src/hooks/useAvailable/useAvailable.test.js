import { renderHook } from '@testing-library/react-hooks';
import UseAvailable from './index';

describe('UseAvailable', () => {
  it('return the Availability', () => {
    const { result } = renderHook(() => UseAvailable());
    expect(result.current).toBe(true);
  });
});
