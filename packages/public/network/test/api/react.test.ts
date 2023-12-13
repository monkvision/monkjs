jest.mock('@monkvision/common');
jest.mock('../../src/api/requests', () => ({
  MonkApi: {
    getInspection: jest.fn(() =>
      Promise.resolve({ payload: { test: 'payload' }, axiosResponse: 'test' }),
    ),
  },
}));

import { renderHook } from '@testing-library/react-hooks';
import { useMonkState, MonkActionType } from '@monkvision/common';
import { MonkAPIConfig, useMonkApi, MonkApi } from '../../src';

describe('Monk API React utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useMonkApi hook', () => {
    it('should properly reactify each request in the MonkApi object', () => {
      const config: MonkAPIConfig = { apiDomain: 'wow-test', authToken: 'yessss' };
      const { result, unmount } = renderHook(useMonkApi, {
        initialProps: config,
      });

      expect(useMonkState).toHaveBeenCalledTimes(1);
      const dispatchMock = (useMonkState as jest.Mock).mock.results[0].value.dispatch as jest.Mock;
      Object.keys(MonkApi).forEach(async (requestKey, index) => {
        dispatchMock.mockClear();
        expect(typeof (result.current as any)[requestKey]).toBe('function');
        const resultMock = await (result.current as any)[requestKey](index, index * 2);
        const requestMock = MonkApi[requestKey as keyof typeof MonkApi] as jest.Mock;
        expect(requestMock).toHaveBeenCalledWith(index, index * 2, config);
        const requestResultMock = await requestMock.mock.results[0].value;
        expect(dispatchMock).toHaveBeenCalledWith(
          expect.objectContaining({
            type: MonkActionType.UPDATE_STATE,
            payload: requestResultMock.payload,
          }),
        );
        expect(resultMock).toBe(requestResultMock);
      });
      unmount();
    });
  });
});
