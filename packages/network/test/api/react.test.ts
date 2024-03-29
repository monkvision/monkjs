jest.mock('../../src/api/api', () => ({
  MonkApi: {
    getInspection: jest.fn(() =>
      Promise.resolve({ action: { test: 'getInspection' }, test: 'getInspection' }),
    ),
    createInspection: jest.fn(() => Promise.resolve({ action: null, test: 'createInspection' })),
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
    it('should properly reactify each request in the MonkApi object', async () => {
      const config: MonkAPIConfig = { apiDomain: 'wow-test', authToken: 'yessss' };
      const { result, unmount } = renderHook(useMonkApi, {
        initialProps: config,
      });

      expect(useMonkState).toHaveBeenCalledTimes(1);
      const dispatchMock = (useMonkState as jest.Mock).mock.results[0].value.dispatch as jest.Mock;

      expect(typeof result.current.getInspection).toBe('function');

      let param = 'test-getInspection';
      let resultMock = await result.current.getInspection(param);
      let requestMock = MonkApi.getInspection as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config);
      let requestResultMock = await requestMock.mock.results[0].value;
      expect(dispatchMock).toHaveBeenCalledWith(requestResultMock.action);
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-createInspection';
      resultMock = await (result.current.createInspection as any)(param);
      requestMock = MonkApi.createInspection as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(dispatchMock).not.toHaveBeenCalled();
      expect(resultMock).toBe(requestResultMock);

      unmount();
    });
  });
});
