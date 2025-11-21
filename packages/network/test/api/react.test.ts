jest.mock('../../src/api/api', () => ({
  MonkApi: {
    getInspection: jest.fn(() => Promise.resolve({ test: 'getInspection' })),
    createInspection: jest.fn(() => Promise.resolve({ test: 'createInspection' })),
    createPricing: jest.fn(() => Promise.resolve({ test: 'createPricing' })),
    deletePricing: jest.fn(() => Promise.resolve({ test: 'deletePricing' })),
    updatePricing: jest.fn(() => Promise.resolve({ test: 'updatePricing' })),
    createDamage: jest.fn(() => Promise.resolve({ test: 'createDamage' })),
    deleteDamage: jest.fn(() => Promise.resolve({ test: 'deleteDamage' })),
    getAllInspections: jest.fn(() => Promise.resolve({ test: 'getAllInspections' })),
    getAllInspectionsCount: jest.fn(() => Promise.resolve({ test: 'getAllInspectionsCount' })),
  },
}));

import { renderHook } from '@testing-library/react';
import { useMonkState } from '@monkvision/common';
import { MonkApi, MonkApiConfig, MonkHTTPError, useMonkApi } from '../../src';
import { useMonitoring } from '@monkvision/monitoring';

describe('Monk API React utilities', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useMonkApi hook', () => {
    it('should properly reactify each request in the MonkApi object', async () => {
      const config: MonkApiConfig = {
        apiDomain: 'wow-test',
        authToken: 'yessss',
        thumbnailDomain: 'thumbnailDomain',
      };
      const { result, unmount } = renderHook(useMonkApi, {
        initialProps: config,
      });

      expect(useMonkState).toHaveBeenCalledTimes(1);
      const dispatchMock = (useMonkState as jest.Mock).mock.results[0].value.dispatch as jest.Mock;

      expect(typeof result.current.getInspection).toBe('function');

      let param = 'test-getInspection';
      let resultMock = await (result.current.getInspection as any)(param);
      let requestMock = MonkApi.getInspection as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      let requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-createInspection';
      resultMock = await (result.current.createInspection as any)(param);
      requestMock = MonkApi.createInspection as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-createPricing';
      resultMock = await (result.current.createPricing as any)(param);
      requestMock = MonkApi.createPricing as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-deletePricing';
      resultMock = await (result.current.deletePricing as any)(param);
      requestMock = MonkApi.deletePricing as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-updatePricing';
      resultMock = await (result.current.updatePricing as any)(param);
      requestMock = MonkApi.updatePricing as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-createDamage';
      resultMock = await (result.current.createDamage as any)(param);
      requestMock = MonkApi.createDamage as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-deleteDamage';
      resultMock = await (result.current.deleteDamage as any)(param);
      requestMock = MonkApi.deleteDamage as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      dispatchMock.mockClear();

      param = 'test-getAllInspections';
      resultMock = await (result.current.getAllInspections as any)(param);
      requestMock = MonkApi.getAllInspections as jest.Mock;
      expect(requestMock).toHaveBeenCalledWith(param, config, dispatchMock);
      requestResultMock = await requestMock.mock.results[0].value;
      expect(resultMock).toBe(requestResultMock);

      unmount();
    });

    it('should properly handle http errors using monitoring', async () => {
      const httpError = new Error('test');
      Object.assign(httpError, { body: { test: 'hello' } });
      (MonkApi.getInspection as jest.Mock).mockImplementation(() => Promise.reject(httpError));
      const { result, unmount } = renderHook(useMonkApi, {
        initialProps: {
          apiDomain: 'wow-test',
          authToken: 'yessss',
          thumbnailDomain: 'thumbnailDomain',
        },
      });

      expect(useMonitoring).toHaveBeenCalled();
      const { handleError } = (useMonitoring as jest.Mock).mock.results[0].value;
      expect(typeof result.current.getInspection).toBe('function');

      let actualError: MonkHTTPError | null = null;
      try {
        await result.current.getInspection({} as any);
      } catch (err) {
        actualError = err as MonkHTTPError;
      }
      expect(actualError).toBe(httpError);
      expect(handleError).toHaveBeenCalledWith(httpError, {
        extras: { body: actualError?.body, completeResponse: JSON.stringify(actualError?.body) },
      });

      unmount();
    });
  });
});
