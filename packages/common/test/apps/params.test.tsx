jest.mock('../../src/utils/zlib.utils', () => ({
  zlibDecompress: jest.fn(() => ''),
}));
jest.mock('../../src/hooks', () => ({
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));

import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { useContext, useEffect } from 'react';
import { VehicleType } from '@monkvision/types';
import {
  MonkAppParams,
  MonkAppParamsContext,
  MonkAppParamsProvider,
  MonkSearchParams,
  useMonkAppParams,
  zlibDecompress,
  useSearchParams,
} from '../../src';
import { useTranslation } from 'react-i18next';

let params: MonkAppParams | null = null;
function TestComponent() {
  const context = useContext(MonkAppParamsContext);
  useEffect(() => {
    params = context;
  });
  return <></>;
}

describe('Monk App Params', () => {
  afterEach(() => {
    jest.clearAllMocks();
    params = null;
  });

  describe('MonkAppParams context', () => {
    it('should return the proper default values', () => {
      const { result, unmount } = renderHook(() => {
        return useContext(MonkAppParamsContext);
      });

      expect(result.current.authToken).toBeNull();
      expect(result.current.inspectionId).toBeNull();
      expect(result.current.vehicleType).toBeNull();
      expect(typeof result.current.setAuthToken).toEqual('function');
      expect(typeof result.current.setInspectionId).toEqual('function');
      expect(typeof result.current.setVehicleType).toEqual('function');

      unmount();
    });
  });

  describe('MonkAppParamsProvider component', () => {
    it('should pass the children to the MonkAppParamsContext', () => {
      const testId = 'test-id-test';
      const { unmount } = render(
        <MonkAppParamsProvider>
          <div data-testid={testId} />
        </MonkAppParamsProvider>,
      );

      expect(screen.queryByTestId(testId)).not.toBeNull();

      unmount();
    });

    it('should set the proper default context values', () => {
      const { unmount } = render(
        <MonkAppParamsProvider>
          <TestComponent />
        </MonkAppParamsProvider>,
      );

      expect(params?.authToken).toBeNull();
      expect(params?.inspectionId).toBeNull();
      expect(params?.vehicleType).toBeNull();
      expect(typeof params?.setAuthToken).toEqual('function');
      expect(typeof params?.setInspectionId).toEqual('function');
      expect(typeof params?.setVehicleType).toEqual('function');

      unmount();
    });

    it('should fetch the token from the local storage if asked to', () => {
      const token = 'test-token-test';
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => token);
      const onFetchAuthToken = jest.fn();
      const { unmount } = render(
        <MonkAppParamsProvider fetchTokenFromStorage={true} onFetchAuthToken={onFetchAuthToken}>
          <TestComponent />
        </MonkAppParamsProvider>,
      );

      expect(spy).toHaveBeenCalled();
      expect(params?.authToken).toEqual(token);
      expect(onFetchAuthToken).toHaveBeenCalled();

      unmount();
    });

    it('should fetch the token from the search params if asked to', () => {
      const tokenCompressed = 'test-token-test-compressed';
      const tokenDecompressed = 'test-token-test-decompressed';
      (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
        get: jest.fn((name) => (name === MonkSearchParams.TOKEN ? tokenCompressed : null)),
      }));
      (zlibDecompress as jest.Mock).mockImplementationOnce(() => tokenDecompressed);
      const onFetchAuthToken = jest.fn();
      const { unmount } = render(
        <MonkAppParamsProvider fetchFromSearchParams={true} onFetchAuthToken={onFetchAuthToken}>
          <TestComponent />
        </MonkAppParamsProvider>,
      );

      expect(zlibDecompress).toHaveBeenCalledWith(tokenCompressed);
      expect(params?.authToken).toEqual(tokenDecompressed);
      expect(onFetchAuthToken).toHaveBeenCalled();

      unmount();
    });

    it('should prioritize the param obtained from the search params rather than from the storage', () => {
      const storageToken = 'test-token-test-storage';
      jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => storageToken);
      const tokenCompressed = 'test-token-test-compressed-searchparams';
      const tokenDecompressed = 'test-token-test-decompressed-searchparams';
      (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
        get: jest.fn((name) => (name === MonkSearchParams.TOKEN ? tokenCompressed : null)),
      }));
      (zlibDecompress as jest.Mock).mockImplementationOnce(() => tokenDecompressed);
      const { unmount } = render(
        <MonkAppParamsProvider fetchFromSearchParams={true} fetchTokenFromStorage={true}>
          <TestComponent />
        </MonkAppParamsProvider>,
      );

      expect(params?.authToken).toEqual(tokenDecompressed);

      unmount();
    });

    it('should fetch the inspection ID from the search params if asked to', () => {
      const inspectionId = 'test-inspection-id-test';
      (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
        get: jest.fn((name) => (name === MonkSearchParams.INSPECTION_ID ? inspectionId : null)),
      }));
      const { unmount } = render(
        <MonkAppParamsProvider fetchFromSearchParams={true}>
          <TestComponent />
        </MonkAppParamsProvider>,
      );

      expect(params?.inspectionId).toEqual(inspectionId);

      unmount();
    });

    Object.values(VehicleType).forEach((vehicleType) =>
      it(`should properly fetch the ${vehicleType} vehicle type from the search params if asked to`, () => {
        (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
          get: jest.fn((name) => (name === MonkSearchParams.VEHICLE_TYPE ? vehicleType : null)),
        }));
        const { unmount } = render(
          <MonkAppParamsProvider fetchFromSearchParams={true}>
            <TestComponent />
          </MonkAppParamsProvider>,
        );

        expect(params?.vehicleType).toEqual(vehicleType);

        unmount();
      }),
    );

    it('should update the language from the search params if asked to', () => {
      const lang = 'fr';
      (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
        get: jest.fn((name) => (name === MonkSearchParams.LANGUAGE ? lang : null)),
      }));
      const { unmount } = render(
        <MonkAppParamsProvider fetchFromSearchParams={true} updateLanguage={true}>
          <TestComponent />
        </MonkAppParamsProvider>,
      );

      expect(useTranslation).toHaveBeenCalled();
      const { i18n } = (useTranslation as jest.Mock).mock.results[0].value;
      expect(i18n.changeLanguage).toHaveBeenCalledWith(lang);

      unmount();
    });
  });

  describe('useMonkAppParams hook', () => {
    it('should return the current value of the MonkAppParamsContext', () => {
      const value = { test: 'hello' };
      const spy = jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppParams);

      expect(spy).toHaveBeenCalledWith(MonkAppParamsContext);
      expect(result.current).toEqual(value);

      unmount();
    });

    it('should throw an error if required is true and the auth token is null', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const value = { inspectionId: 'hello' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppParams, {
        initialProps: { required: true },
      });

      expect(result.error).toBeDefined();

      unmount();
      jest.spyOn(console, 'error').mockRestore();
    });

    it('should throw an error if required is true and the inspection ID is null', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const value = { authToken: 'hello' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppParams, {
        initialProps: { required: true },
      });

      expect(result.error).toBeDefined();

      unmount();
      jest.spyOn(console, 'error').mockRestore();
    });

    it('should not throw an error if required is true and neither the auth token nor the inspection id is null', () => {
      const value = { authToken: 'hello', inspectionId: 'hi' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppParams, {
        initialProps: { required: true },
      });

      expect(result.current).toEqual(value);
      expect(result.error).not.toBeDefined();

      unmount();
    });
  });
});
