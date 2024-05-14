jest.mock('../../src/utils/zlib.utils', () => ({
  zlibDecompress: jest.fn(() => ''),
}));
jest.mock('../../src/hooks', () => ({
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));

import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import React, { useContext, useEffect } from 'react';
import { SteeringWheelPosition, VehicleType } from '@monkvision/types';
import {
  MonkApplicationState,
  MonkApplicationStateContext,
  MonkApplicationStateProvider,
  MonkSearchParam,
  useMonkApplicationState,
  zlibDecompress,
  useSearchParams,
} from '../../src';

let params: MonkApplicationState | null = null;
function TestComponent() {
  const context = useContext(MonkApplicationStateContext);
  useEffect(() => {
    params = context;
  });
  return <></>;
}

describe('Monk Application State', () => {
  afterEach(() => {
    jest.clearAllMocks();
    params = null;
  });

  describe('MonkApplicationState context', () => {
    it('should return the proper default values', () => {
      const { result, unmount } = renderHook(() => {
        return useContext(MonkApplicationStateContext);
      });

      expect(result.current.authToken).toBeNull();
      expect(result.current.inspectionId).toBeNull();
      expect(result.current.vehicleType).toBeNull();
      expect(result.current.steeringWheel).toBeNull();
      expect(typeof result.current.setAuthToken).toEqual('function');
      expect(typeof result.current.setInspectionId).toEqual('function');
      expect(typeof result.current.setVehicleType).toEqual('function');
      expect(typeof result.current.setSteeringWheel).toEqual('function');

      unmount();
    });
  });

  describe('MonkApplicationStateProvider component', () => {
    it('should pass the children to the MonkApplicationStateContext', () => {
      const testId = 'test-id-test';
      const { unmount } = render(
        <MonkApplicationStateProvider>
          <div data-testid={testId} />
        </MonkApplicationStateProvider>,
      );

      expect(screen.queryByTestId(testId)).not.toBeNull();

      unmount();
    });

    it('should set the proper default context values', () => {
      const { unmount } = render(
        <MonkApplicationStateProvider>
          <TestComponent />
        </MonkApplicationStateProvider>,
      );

      expect(params?.authToken).toBeNull();
      expect(params?.inspectionId).toBeNull();
      expect(params?.vehicleType).toBeNull();
      expect(params?.steeringWheel).toBeNull();
      expect(typeof params?.setAuthToken).toEqual('function');
      expect(typeof params?.setInspectionId).toEqual('function');
      expect(typeof params?.setVehicleType).toEqual('function');
      expect(typeof params?.setSteeringWheel).toEqual('function');

      unmount();
    });

    it('should fetch the token from the local storage if asked to', () => {
      const token = 'test-token-test';
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementationOnce(() => token);
      const onFetchAuthToken = jest.fn();
      const { unmount } = render(
        <MonkApplicationStateProvider
          fetchTokenFromStorage={true}
          onFetchAuthToken={onFetchAuthToken}
        >
          <TestComponent />
        </MonkApplicationStateProvider>,
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
        get: jest.fn((name) => (name === MonkSearchParam.TOKEN ? tokenCompressed : null)),
      }));
      (zlibDecompress as jest.Mock).mockImplementationOnce(() => tokenDecompressed);
      const onFetchAuthToken = jest.fn();
      const { unmount } = render(
        <MonkApplicationStateProvider
          fetchFromSearchParams={true}
          onFetchAuthToken={onFetchAuthToken}
        >
          <TestComponent />
        </MonkApplicationStateProvider>,
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
        get: jest.fn((name) => (name === MonkSearchParam.TOKEN ? tokenCompressed : null)),
      }));
      (zlibDecompress as jest.Mock).mockImplementationOnce(() => tokenDecompressed);
      const { unmount } = render(
        <MonkApplicationStateProvider fetchFromSearchParams={true} fetchTokenFromStorage={true}>
          <TestComponent />
        </MonkApplicationStateProvider>,
      );

      expect(params?.authToken).toEqual(tokenDecompressed);

      unmount();
    });

    it('should fetch the inspection ID from the search params if asked to', () => {
      const inspectionId = 'test-inspection-id-test';
      (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
        get: jest.fn((name) => (name === MonkSearchParam.INSPECTION_ID ? inspectionId : null)),
      }));
      const { unmount } = render(
        <MonkApplicationStateProvider fetchFromSearchParams={true}>
          <TestComponent />
        </MonkApplicationStateProvider>,
      );

      expect(params?.inspectionId).toEqual(inspectionId);

      unmount();
    });

    Object.values(VehicleType).forEach((vehicleType) =>
      it(`should properly fetch the ${vehicleType} vehicle type from the search params if asked to`, () => {
        (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
          get: jest.fn((name) => (name === MonkSearchParam.VEHICLE_TYPE ? vehicleType : null)),
        }));
        const { unmount } = render(
          <MonkApplicationStateProvider fetchFromSearchParams={true}>
            <TestComponent />
          </MonkApplicationStateProvider>,
        );

        expect(params?.vehicleType).toEqual(vehicleType);

        unmount();
      }),
    );

    it('should update the language from the search params if asked to', () => {
      const onUpdateLanguage = jest.fn();
      const lang = 'fr';
      (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
        get: jest.fn((name) => (name === MonkSearchParam.LANGUAGE ? lang : null)),
      }));
      const { unmount } = render(
        <MonkApplicationStateProvider
          fetchFromSearchParams={true}
          onLanguageFetchedFromSearchParams={onUpdateLanguage}
        >
          <TestComponent />
        </MonkApplicationStateProvider>,
      );

      expect(onUpdateLanguage).toHaveBeenCalledWith(lang);

      unmount();
    });

    Object.values(SteeringWheelPosition).forEach((steeringWheel) =>
      it(`should properly fetch the ${steeringWheel} steering wheel position from the search params if asked to`, () => {
        (useSearchParams as jest.Mock).mockImplementationOnce(() => ({
          get: jest.fn((name) => (name === MonkSearchParam.STEERING_WHEEL ? steeringWheel : null)),
        }));
        const { unmount } = render(
          <MonkApplicationStateProvider fetchFromSearchParams={true}>
            <TestComponent />
          </MonkApplicationStateProvider>,
        );

        expect(params?.steeringWheel).toEqual(steeringWheel);

        unmount();
      }),
    );
  });

  describe('useMonkApplicationState hook', () => {
    it('should return the current value of the MonkApplicationStateContext', () => {
      const value = { test: 'hello' };
      const spy = jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkApplicationState);

      expect(spy).toHaveBeenCalledWith(MonkApplicationStateContext);
      expect(result.current).toEqual(value);

      unmount();
    });

    it('should throw an error if required is true and the auth token is null', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const value = { inspectionId: 'hello' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkApplicationState, {
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

      const { result, unmount } = renderHook(useMonkApplicationState, {
        initialProps: { required: true },
      });

      expect(result.error).toBeDefined();

      unmount();
      jest.spyOn(console, 'error').mockRestore();
    });

    it('should not throw an error if required is true and neither the auth token nor the inspection id is null', () => {
      const value = { authToken: 'hello', inspectionId: 'hi' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkApplicationState, {
        initialProps: { required: true },
      });

      expect(result.current).toEqual(value);
      expect(result.error).not.toBeDefined();

      unmount();
    });
  });
});
