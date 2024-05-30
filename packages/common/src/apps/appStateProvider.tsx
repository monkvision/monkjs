import { CaptureAppConfig, Sight, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { sights } from '@monkvision/sights';
import React, { PropsWithChildren, useCallback, useContext, useEffect, useState } from 'react';
import { useLoadingState, useObjectMemo } from '../hooks';
import { MonkSearchParam, useMonkSearchParams } from './searchParams';
import { MonkAppState, MonkAppStateContext } from './appState';
import { useAppStateMonitoring } from './monitoring';

/**
 * Local storage key used within Monk web applications to store the authentication token.
 */
export const STORAGE_KEY_AUTH_TOKEN = '@monk_authToken';

/**
 * Props accepted by the MonkAppStateProvider component.
 */
export type MonkAppStateProviderProps = {
  /**
   * The current configuration of the application.
   */
  config: CaptureAppConfig;
  /**
   * Callback called when an authentication token has successfully been fetched from either the local storage, or the
   * URL search params.
   */
  onFetchAuthToken?: () => void;
  /**
   * Callback called when the language of the app must be updated because it has been specified in the URL params.
   */
  onFetchLanguage?: (lang: string) => void;
};

function getSights(
  config: CaptureAppConfig,
  vehicleType: VehicleType | null,
  steeringWheel: SteeringWheelPosition | null,
): Sight[] {
  const currentVehicleType = vehicleType ?? config.defaultVehicleType;
  let sightIds: string[] | undefined;
  if (config.enableSteeringWheelPosition) {
    const currentSteeringWheel = steeringWheel ?? config.defaultSteeringWheelPosition;
    sightIds = config.sights[currentSteeringWheel][currentVehicleType];
  } else {
    sightIds = config.sights[currentVehicleType];
  }
  if (!sightIds) {
    throw new Error(
      'Invalid application configuration. No sights have been found for the current vehicle type steering wheel position.',
    );
  }
  return sightIds.map((id) => {
    if (!sights[id]) {
      throw new Error(`Sight with ID "${id}" does not exist.`);
    }
    return sights[id];
  });
}

/**
 * A React context provider that declares the state for the common parameters used by Monk applications. The parameters
 * are described in the `MonkAppState` interface. Using options available in the App config (`config` prop),  this
 * component can also fetch initial values for these params directly from the URL search params and the web local
 * storage.
 *
 * @see MonkAppState
 * @see MonkAppStateProviderProps
 */
export function MonkAppStateProvider({
  config,
  onFetchAuthToken,
  onFetchLanguage,
  children,
}: PropsWithChildren<MonkAppStateProviderProps>) {
  const loading = useLoadingState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [steeringWheel, setSteeringWheel] = useState<SteeringWheelPosition | null>(null);
  const monkSearchParams = useMonkSearchParams();
  useAppStateMonitoring({ authToken, inspectionId, vehicleType, steeringWheel });

  useEffect(() => {
    loading.onSuccess();
    let fetchedToken: string | null = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);

    if (config.fetchFromSearchParams) {
      fetchedToken = monkSearchParams.get(MonkSearchParam.TOKEN) ?? fetchedToken;
      setInspectionId((param) => monkSearchParams.get(MonkSearchParam.INSPECTION_ID) ?? param);
      setVehicleType((param) => monkSearchParams.get(MonkSearchParam.VEHICLE_TYPE) ?? param);
      setSteeringWheel((param) => monkSearchParams.get(MonkSearchParam.STEERING_WHEEL) ?? param);
      const lang = monkSearchParams.get(MonkSearchParam.LANGUAGE);
      if (lang) {
        onFetchLanguage?.(lang);
      }
    }

    if (fetchedToken) {
      setAuthToken(fetchedToken);
      onFetchAuthToken?.();
    }
  }, [monkSearchParams, config]);

  const getCurrentSights = useCallback(
    () => getSights(config, vehicleType, steeringWheel),
    [config, vehicleType, steeringWheel],
  );

  const appState = useObjectMemo({
    loading,
    config,
    authToken,
    inspectionId,
    vehicleType,
    steeringWheel,
    getCurrentSights,
    setAuthToken,
    setInspectionId,
    setVehicleType,
    setSteeringWheel,
  });

  return <MonkAppStateContext.Provider value={appState}>{children}</MonkAppStateContext.Provider>;
}

/**
 * Options accepted by the `useMonkAppState`  hook.
 */
export interface UseMonkAppStateOptions {
  /**
   * Boolean indicating if the `authToken` and the `inspectionId` params are required. If this value is set to `true`,
   * the hook will return non-null values (even in TypeScript typings) values for the `authToken` and the `inspectionId`
   * params, at the cost of throwing an error if either one of these param is `null`.
   */
  requireInspection?: boolean;
}

/**
 * Custom hook used to get the current Monk application state (described in the `MonkAppState` interface) for the
 * current `MonkAppStateContext`. This hook must be called within a child of the `MonkAppStateProvider` component.
 *
 * @see MonkAppState
 * @see MonkAppStateContext
 * @see MonkAppStateProvider
 */
export function useMonkAppState(): MonkAppState;
export function useMonkAppState(o: { requireInspection: false | undefined }): MonkAppState;
export function useMonkAppState(o: {
  requireInspection: true;
}): MonkAppState & { authToken: string; inspectionId: string };
export function useMonkAppState(options?: UseMonkAppStateOptions): MonkAppState {
  const value = useContext(MonkAppStateContext);
  if (!value) {
    throw new Error(
      'MonkAppState is null! Did you forget to place the <MonkAppStateProvider /> component?',
    );
  }
  if (options?.requireInspection && !value.authToken) {
    throw new Error('Authentication token is null but was required by the current component.');
  }
  if (options?.requireInspection && !value.inspectionId) {
    throw new Error('Inspection ID is null but was required by the current component.');
  }
  return value;
}
