import { renderHook } from '@testing-library/react-hooks';
import UseAvailable from './index';

describe('UseAvailable', () => {
  jest.mock('../../__mocks__/expo-camera');
  it('return the Availability', () => {
    const { result } = renderHook(() => UseAvailable());
    expect(result.current).toBeTruthy();
  });
});
