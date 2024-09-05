import { SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { renderHook } from '@testing-library/react-hooks';
import { MonkSearchParam, useMonkSearchParams, useSearchParams, zlibDecompress } from '../../src';

const zlibDecompressResult = 'zlibDecompress-result-test';

jest.mock('../../src/hooks', () => ({
  ...jest.requireActual('../../src/hooks'),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));
jest.mock('../../src/utils', () => ({
  zlibDecompress: jest.fn(() => zlibDecompressResult),
}));

function mockSearchParams(searchParams: Partial<Record<MonkSearchParam, string>>) {
  const get = jest.fn((param) => searchParams[param as MonkSearchParam]);
  (useSearchParams as jest.Mock).mockImplementationOnce(() => ({ get }));
}

describe('MonkSearchParams utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useMonkSearchParams hook', () => {
    it('should a getter function', () => {
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(typeof result.current.get).toBe('function');

      unmount();
    });

    it('should a null token if it is not found in the search params', () => {
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.TOKEN)).toBeNull();
      expect(zlibDecompress).not.toHaveBeenCalled();

      unmount();
    });

    it('should a decompressed token if it is found in the search params', () => {
      const token = 'test-token-test';
      mockSearchParams({ [MonkSearchParam.TOKEN]: token });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.TOKEN)).toEqual(zlibDecompressResult);
      expect(zlibDecompress).toHaveBeenCalledWith(token);

      unmount();
    });

    it('should return a null inspection ID if it is not found in the search params', () => {
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.INSPECTION_ID)).toBeNull();

      unmount();
    });

    it('should return the inspection ID if it is found in the search params', () => {
      const inspectionId = 'test-id-test';
      mockSearchParams({ [MonkSearchParam.INSPECTION_ID]: inspectionId });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.INSPECTION_ID)).toEqual(inspectionId);

      unmount();
    });

    it('should return a null vehicle type if it is not found in the search params', () => {
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.VEHICLE_TYPE)).toBeNull();

      unmount();
    });

    it('should return a null vehicle type if the value found in the search params is invalid', () => {
      mockSearchParams({ [MonkSearchParam.VEHICLE_TYPE]: 'test-random-value' });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.VEHICLE_TYPE)).toBeNull();

      unmount();
    });

    it('should return a null vehicle type if the value found in the search params is not in the available vehicle types', () => {
      mockSearchParams({ [MonkSearchParam.VEHICLE_TYPE]: VehicleType.VAN });
      const { result, unmount } = renderHook(useMonkSearchParams, {
        initialProps: { availableVehicleTypes: [VehicleType.HATCHBACK, VehicleType.CITY] },
      });

      expect(result.current.get(MonkSearchParam.VEHICLE_TYPE)).toBeNull();

      unmount();
    });

    it('should return the vehicle type if it is found in the search params', () => {
      const vehicleType = VehicleType.HATCHBACK;
      mockSearchParams({ [MonkSearchParam.VEHICLE_TYPE]: vehicleType });
      const { result, unmount } = renderHook(useMonkSearchParams, {
        initialProps: { availableVehicleTypes: [vehicleType] },
      });

      expect(result.current.get(MonkSearchParam.VEHICLE_TYPE)).toEqual(vehicleType);

      unmount();
    });

    it('should return a null steering wheel position if it is not found in the search params', () => {
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.STEERING_WHEEL)).toBeNull();

      unmount();
    });

    it('should return a null steering wheel position if the value found in the search params is invalid', () => {
      mockSearchParams({ [MonkSearchParam.STEERING_WHEEL]: 'test-random-value-2' });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.STEERING_WHEEL)).toBeNull();

      unmount();
    });

    it('should return the steering wheel position if it is found in the search params', () => {
      const steeringWheel = SteeringWheelPosition.RIGHT;
      mockSearchParams({ [MonkSearchParam.STEERING_WHEEL]: steeringWheel });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.STEERING_WHEEL)).toEqual(steeringWheel);

      unmount();
    });

    it('should return a null language if it is not found in the search params', () => {
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.LANGUAGE)).toBeNull();

      unmount();
    });

    it('should return a null language if the value found in the search params is invalid', () => {
      mockSearchParams({ [MonkSearchParam.LANGUAGE]: 'test-random-value-3' });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.LANGUAGE)).toBeNull();

      unmount();
    });

    it('should return the language if it is found in the search params', () => {
      const language = 'nl';
      mockSearchParams({ [MonkSearchParam.LANGUAGE]: language });
      const { result, unmount } = renderHook(useMonkSearchParams);

      expect(result.current.get(MonkSearchParam.LANGUAGE)).toEqual(language);

      unmount();
    });
  });
});
