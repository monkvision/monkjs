import {
  MonkLanguage,
  monkLanguages,
  StandardEnum,
  SteeringWheelPosition,
  VehicleType,
} from '@monkvision/types';
import { useCallback } from 'react';
import { useObjectMemo, useSearchParams } from '../hooks';
import { zlibDecompress } from '../utils';

/**
 * Enumeration of the usual search parameters used by Monk applications. These parameters help configure the application
 * via URL directly.
 */
export enum MonkSearchParam {
  /**
   * Search parameter used to provide an authentication token directly via URL. Note : auth tokens need be compressed
   * using ZLib (ex: using the `zlibCompress` utility function available in this package) and properly URL-encoded
   * before being passed as a URL param. No Monk app should ever use auth tokens obtained from URL search params without
   * compression and encoding.
   *
   * @see zlibCompress
   * @see encodeURIComponent
   */
  TOKEN = 't',
  /**
   * Search parameter used to provide an inspection ID to the app to use directly.
   */
  INSPECTION_ID = 'i',
  /**
   * Search parameter used to specify the vehicle type that the application should use. The list of vehicle types
   * available and supported by the Monk SDK is described in the `VehicleType` enum exported by the `@monkvision/types`
   * package.
   *
   * @see VehicleType
   */
  VEHICLE_TYPE = 'v',
  /**
   * Search parameter used to specify the language used by the application. The list of languages supported by the Monk
   * SDK is available in the `monkLanguages` array exported by the `@monkvision/types` package.
   *
   * @see monkLanguages
   */
  LANGUAGE = 'l',
  /**
   * Search parameter used to specify the position of the steering wheel on the car.
   *
   * @see SteeringWheelPosition
   */
  STEERING_WHEEL = 's',
}

/**
 * Getter function used to fetch the value of MonkSearchParams for the current app search params.
 */
export type MonkSearchParamsGetter = {
  (param: MonkSearchParam.TOKEN): string | null;
  (param: MonkSearchParam.INSPECTION_ID): string | null;
  (param: MonkSearchParam.VEHICLE_TYPE): VehicleType | null;
  (param: MonkSearchParam.STEERING_WHEEL): SteeringWheelPosition | null;
  (param: MonkSearchParam.LANGUAGE): MonkLanguage | null;
};

function validateParamValue<T extends string>(
  value: string | null,
  validValues: StandardEnum<T> | T[],
): T | null {
  const validValuesArray = (
    Array.isArray(validValues) ? validValues : Object.values(validValues)
  ) as (string | null)[];
  return validValuesArray.includes(value) ? (value as T) : null;
}

/**
 * Custom hook used to return a getter function used to fetch the value of different MonkSearchParams.
 *
 * @see MonkSearchParam
 */
export function useMonkSearchParams(): { get: MonkSearchParamsGetter } {
  const searchParams = useSearchParams();

  const get = useCallback(
    (param: MonkSearchParam) => {
      const value = searchParams.get(param);
      switch (param) {
        case MonkSearchParam.TOKEN:
          return value ? zlibDecompress(value) : null;
        case MonkSearchParam.INSPECTION_ID:
          return value;
        case MonkSearchParam.VEHICLE_TYPE:
          return validateParamValue(value, VehicleType);
        case MonkSearchParam.STEERING_WHEEL:
          return validateParamValue(value, SteeringWheelPosition);
        case MonkSearchParam.LANGUAGE:
          return validateParamValue(value, monkLanguages);
        default:
          return null;
      }
    },
    [searchParams],
  );

  return useObjectMemo({ get });
}
