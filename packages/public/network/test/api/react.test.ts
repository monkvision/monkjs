jest.mock('../../src/api/api', () => ({
  MonkApi: {
    getInspection: jest.fn(() =>
      Promise.resolve({ action: { test: 'getInspection' }, test: 'getInspection' }),
    ),
    addImage: jest.fn(() => Promise.resolve({ action: { test: 'addImage' }, test: 'addImage' })),
    updateTaskStatus: jest.fn(() =>
      Promise.resolve({ action: { test: 'updateTaskStatus' }, test: 'updateTaskStatus' }),
    ),
  },
}));

import { renderHook } from '@testing-library/react-hooks';
import { useMonkState } from '@monkvision/common';
import { MonkApi, MonkAPIConfig, useMonkApi } from '../../src';

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
        expect(dispatchMock).toHaveBeenCalledWith(requestResultMock.action);
        expect(resultMock).toBe(requestResultMock);
      });
      unmount();
    });
  });
});
