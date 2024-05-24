const searchParamsGet = jest.fn(() => null) as jest.Mock;

jest.mock('../../src/apps/searchParams', () => ({
  ...jest.requireActual('../../src/apps/searchParams'),
  useMonkSearchParams: jest.fn(() => ({ get: searchParamsGet })),
}));

import React, { useContext, useEffect } from 'react';
import { CaptureAppConfig, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { sights } from '@monkvision/sights';
import { renderHook } from '@testing-library/react-hooks';
import { act, render, screen } from '@testing-library/react';
import {
  MonkAppState,
  MonkAppStateContext,
  MonkAppStateProvider,
  MonkAppStateProviderProps,
  MonkSearchParam,
  STORAGE_KEY_AUTH_TOKEN,
  useMonkAppState,
} from '../../src';

let params: MonkAppState | null = null;
function TestComponent() {
  const context = useContext(MonkAppStateContext);
  useEffect(() => {
    params = context;
  });
  return <></>;
}

function mockSearchParams(searchParams: Partial<Record<MonkSearchParam, any>>): void {
  searchParamsGet.mockImplementation((param) => searchParams[param as MonkSearchParam]);
}

function createProps(): MonkAppStateProviderProps {
  return {
    config: {
      fetchFromSearchParams: false,
      enableSteeringWheelPosition: false,
      defaultVehicleType: VehicleType.CROSSOVER,
      sights: {
        [VehicleType.HATCHBACK]: ['test-sight-1', 'test-sight-2'],
        [VehicleType.CROSSOVER]: ['test-sight-3', 'test-sight-4'],
      },
    } as CaptureAppConfig,
    onFetchAuthToken: jest.fn(),
    onFetchLanguage: jest.fn(),
  };
}

describe('MonkAppStateProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Storage.prototype, 'getItem').mockRestore();
    params = null;
  });

  describe('MonkAppStateProvider component', () => {
    it('should display the children on the screen', () => {
      const testId = 'test-id-test';
      const props = createProps();
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <div data-testid={testId} />
        </MonkAppStateProvider>,
      );

      expect(screen.queryByTestId(testId)).not.toBeNull();

      unmount();
    });

    it('should return the proper initial values', () => {
      const props = createProps();
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <TestComponent />
        </MonkAppStateProvider>,
      );

      expect(params?.config).toEqual(props.config);
      expect(params?.authToken).toBeNull();
      expect(params?.inspectionId).toBeNull();
      expect(params?.vehicleType).toBeNull();
      expect(params?.steeringWheel).toBeNull();
      expect(typeof params?.getCurrentSights).toEqual('function');
      expect(typeof params?.setAuthToken).toEqual('function');
      expect(typeof params?.setInspectionId).toEqual('function');
      expect(typeof params?.setVehicleType).toEqual('function');
      expect(typeof params?.setSteeringWheel).toEqual('function');

      unmount();
    });

    it('should return proper setter functions', () => {
      const props = createProps();
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <TestComponent />
        </MonkAppStateProvider>,
      );

      const token = 'test-auth-token';
      const inspectionId = 'test-inspection-id';
      const vehicleType = VehicleType.CITY;
      const steeringWheel = SteeringWheelPosition.RIGHT;

      act(() => {
        params?.setAuthToken(token);
        params?.setInspectionId(inspectionId);
        params?.setVehicleType(vehicleType);
        params?.setSteeringWheel(steeringWheel);
      });

      expect(params?.authToken).toEqual(token);
      expect(params?.inspectionId).toEqual(inspectionId);
      expect(params?.vehicleType).toEqual(vehicleType);
      expect(params?.steeringWheel).toEqual(steeringWheel);

      unmount();
    });

    it('should automatically fetch the user token from the local storage', () => {
      const token = 'test-token-test';
      const spy = jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => token);
      const props = createProps();
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <TestComponent />
        </MonkAppStateProvider>,
      );

      expect(spy).toHaveBeenCalledWith(STORAGE_KEY_AUTH_TOKEN);
      expect(params?.authToken).toEqual(token);
      expect(props.onFetchAuthToken).toHaveBeenCalled();

      unmount();
    });

    it('should properly fetch values from the search params if asked to', () => {
      const searchParams = {
        [MonkSearchParam.TOKEN]: 'test-token-test',
        [MonkSearchParam.INSPECTION_ID]: 'test-inspection-id-test',
        [MonkSearchParam.LANGUAGE]: 'test-language-test',
        [MonkSearchParam.VEHICLE_TYPE]: VehicleType.LARGE_SUV,
        [MonkSearchParam.STEERING_WHEEL]: SteeringWheelPosition.RIGHT,
      };
      mockSearchParams(searchParams);
      const props = createProps();
      props.config.fetchFromSearchParams = true;
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <TestComponent />
        </MonkAppStateProvider>,
      );

      expect(params?.authToken).toEqual(searchParams[MonkSearchParam.TOKEN]);
      expect(params?.inspectionId).toEqual(searchParams[MonkSearchParam.INSPECTION_ID]);
      expect(params?.vehicleType).toEqual(searchParams[MonkSearchParam.VEHICLE_TYPE]);
      expect(params?.steeringWheel).toEqual(searchParams[MonkSearchParam.STEERING_WHEEL]);
      expect(props.onFetchLanguage).toHaveBeenCalledWith(searchParams[MonkSearchParam.LANGUAGE]);

      unmount();
    });

    it('should not fetch values from the search params if asked not to', () => {
      mockSearchParams({
        [MonkSearchParam.TOKEN]: 'test-token-test',
        [MonkSearchParam.INSPECTION_ID]: 'test-inspection-id-test',
        [MonkSearchParam.LANGUAGE]: 'test-language-test',
        [MonkSearchParam.VEHICLE_TYPE]: VehicleType.LARGE_SUV,
        [MonkSearchParam.STEERING_WHEEL]: SteeringWheelPosition.RIGHT,
      });
      const props = createProps();
      props.config.fetchFromSearchParams = false;
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <TestComponent />
        </MonkAppStateProvider>,
      );

      expect(params?.authToken).toBeNull();
      expect(params?.inspectionId).toBeNull();
      expect(params?.vehicleType).toBeNull();
      expect(params?.steeringWheel).toBeNull();
      expect(props.onFetchLanguage).not.toHaveBeenCalled();

      unmount();
    });

    it('should prioritize the token from search params over the token in the local storage', async () => {
      const searchParamToken = 'search-param-token';
      searchParamsGet.mockImplementation((param) =>
        param === MonkSearchParam.TOKEN ? searchParamToken : null,
      );
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => 'test-storage-token');
      const props = createProps();
      props.config.fetchFromSearchParams = true;
      const { unmount } = render(
        <MonkAppStateProvider {...props}>
          <TestComponent />
        </MonkAppStateProvider>,
      );

      expect(params?.authToken).toEqual(searchParamToken);
      expect(props.onFetchAuthToken).toHaveBeenCalled();

      unmount();
    });

    describe('getCurrentSights function', () => {
      it('should return the proper sights when steering wheel is not enabled', () => {
        const props = createProps();
        props.config.fetchFromSearchParams = true;
        mockSearchParams({
          [MonkSearchParam.VEHICLE_TYPE]: VehicleType.HATCHBACK,
        });
        const { unmount } = render(
          <MonkAppStateProvider {...props}>
            <TestComponent />
          </MonkAppStateProvider>,
        );

        expect(params?.getCurrentSights()).toEqual([
          sights['test-sight-1'],
          sights['test-sight-2'],
        ]);

        unmount();
      });

      it('should return the proper sights when steering wheel is enabled', () => {
        const props = createProps();
        props.config.fetchFromSearchParams = true;
        props.config.enableSteeringWheelPosition = true;
        (props.config as any).sights = {
          [SteeringWheelPosition.RIGHT]: {
            [VehicleType.HATCHBACK]: ['test-sight-1', 'test-sight-2'],
            [VehicleType.CROSSOVER]: ['test-sight-3', 'test-sight-4'],
          },
        };
        mockSearchParams({
          [MonkSearchParam.VEHICLE_TYPE]: VehicleType.CROSSOVER,
          [MonkSearchParam.STEERING_WHEEL]: SteeringWheelPosition.RIGHT,
        });
        const { unmount } = render(
          <MonkAppStateProvider {...props}>
            <TestComponent />
          </MonkAppStateProvider>,
        );

        expect(params?.getCurrentSights()).toEqual([
          sights['test-sight-3'],
          sights['test-sight-4'],
        ]);

        unmount();
      });

      it('should use the default vehicle type from the config options', () => {
        const props = createProps();
        props.config.fetchFromSearchParams = true;
        props.config.defaultVehicleType = VehicleType.CROSSOVER;
        const { unmount } = render(
          <MonkAppStateProvider {...props}>
            <TestComponent />
          </MonkAppStateProvider>,
        );

        expect(params?.getCurrentSights()).toEqual([
          sights['test-sight-3'],
          sights['test-sight-4'],
        ]);

        unmount();
      });

      it('should use the default steering wheel position from the config options', () => {
        const props = createProps();
        props.config.fetchFromSearchParams = true;
        props.config.enableSteeringWheelPosition = true;
        (props.config as any).defaultSteeringWheelPosition = SteeringWheelPosition.LEFT;
        (props.config as any).sights = {
          [SteeringWheelPosition.LEFT]: {
            [VehicleType.HATCHBACK]: ['test-sight-1', 'test-sight-2'],
            [VehicleType.CROSSOVER]: ['test-sight-3', 'test-sight-4'],
          },
        };
        mockSearchParams({
          [MonkSearchParam.VEHICLE_TYPE]: VehicleType.CROSSOVER,
        });
        const { unmount } = render(
          <MonkAppStateProvider {...props}>
            <TestComponent />
          </MonkAppStateProvider>,
        );

        expect(params?.getCurrentSights()).toEqual([
          sights['test-sight-3'],
          sights['test-sight-4'],
        ]);

        unmount();
      });

      it('should throw an error if no sight IDs are found', () => {
        const props = createProps();
        props.config.sights = {};
        const { unmount } = render(
          <MonkAppStateProvider {...props}>
            <TestComponent />
          </MonkAppStateProvider>,
        );

        expect(() => params?.getCurrentSights()).toThrowError();

        unmount();
      });

      it('should throw an error if some sights are not found in the index', () => {
        const props = createProps();
        props.config.fetchFromSearchParams = true;
        mockSearchParams({
          [MonkSearchParam.VEHICLE_TYPE]: VehicleType.HATCHBACK,
        });
        props.config.sights = {
          [VehicleType.HATCHBACK]: ['test-sight-1', 'random-sight'],
        };
        const { unmount } = render(
          <MonkAppStateProvider {...props}>
            <TestComponent />
          </MonkAppStateProvider>,
        );

        expect(() => params?.getCurrentSights()).toThrowError();

        unmount();
      });
    });
  });

  describe('useMonkAppState hook', () => {
    it('should return the current value of the MonkAppStateContext', () => {
      const value = { test: 'hello' };
      const spy = jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppState);

      expect(spy).toHaveBeenCalledWith(MonkAppStateContext);
      expect(result.current).toEqual(value);

      unmount();
    });

    it('should throw an error if required is true and the auth token is null', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const value = { inspectionId: 'hello' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppState, {
        initialProps: { requireInspection: true },
      });

      expect(result.error).toBeDefined();

      unmount();
      jest.spyOn(console, 'error').mockRestore();
    });

    it('should throw an error if required is true and the inspection ID is null', () => {
      jest.spyOn(console, 'error').mockImplementation(() => {});
      const value = { authToken: 'hello' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppState, {
        initialProps: { requireInspection: true },
      });

      expect(result.error).toBeDefined();

      unmount();
      jest.spyOn(console, 'error').mockRestore();
    });

    it('should not throw an error if required is true and neither the auth token nor the inspection id is null', () => {
      const value = { authToken: 'hello', inspectionId: 'hi' };
      jest.spyOn(React, 'useContext').mockImplementationOnce(() => value);

      const { result, unmount } = renderHook(useMonkAppState, {
        initialProps: { requireInspection: true },
      });

      expect(result.current).toEqual(value);
      expect(result.error).not.toBeDefined();

      unmount();
    });
  });
});
