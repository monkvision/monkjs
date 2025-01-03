import {
  CaptureWorkflow,
  PhotoCaptureAppConfig,
  Sight,
  SteeringWheelPosition,
  VehicleType,
  VideoCaptureAppConfig,
} from '@monkvision/types';
import { sights } from '@monkvision/sights';
import React, { PropsWithChildren, useContext, useEffect, useMemo, useState } from 'react';
import { useIsMounted, useLoadingState } from '../hooks';
import { MonkSearchParam, useMonkSearchParams } from './searchParams';
import {
  MonkAppState,
  MonkAppStateContext,
  PhotoCaptureAppState,
  VideoCaptureAppState,
} from './appState';
import { useAppStateMonitoring } from './monitoring';
import { useAppStateAnalytics } from './analytics';
import { getAvailableVehicleTypes } from '../utils';

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
  config: PhotoCaptureAppConfig | VideoCaptureAppConfig;
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
  config: PhotoCaptureAppConfig,
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
  const availableVehicleTypes = useMemo(
    () =>
      config.workflow === CaptureWorkflow.PHOTO ? getAvailableVehicleTypes(config) : undefined,
    [config],
  );
  const monkSearchParams = useMonkSearchParams({ availableVehicleTypes });
  const isMounted = useIsMounted();
  useAppStateMonitoring({ authToken, inspectionId, vehicleType, steeringWheel });
  useAppStateAnalytics({ inspectionId });

  useEffect(() => {
    loading.onSuccess();
    let fetchedToken: string | null = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);

    if (config.fetchFromSearchParams) {
      fetchedToken = monkSearchParams.get(MonkSearchParam.TOKEN) ?? fetchedToken;
      setInspectionId((param) => monkSearchParams.get(MonkSearchParam.INSPECTION_ID) ?? param);
      setVehicleType((param) => monkSearchParams.get(MonkSearchParam.VEHICLE_TYPE) ?? param);
      setSteeringWheel((param) => monkSearchParams.get(MonkSearchParam.STEERING_WHEEL) ?? param);
      const lang = monkSearchParams.get(MonkSearchParam.LANGUAGE);
      if (lang && isMounted()) {
        onFetchLanguage?.(lang);
      }
    }

    if (fetchedToken && isMounted()) {
      setAuthToken(fetchedToken);
      onFetchAuthToken?.();
    }
  }, [monkSearchParams, config]);

  const getCurrentSights = useMemo(
    () =>
      config.workflow === CaptureWorkflow.PHOTO
        ? () => getSights(config, vehicleType, steeringWheel)
        : undefined,
    [config, vehicleType, steeringWheel],
  );

  const appState: MonkAppState = useMemo(
    () =>
      config.workflow === CaptureWorkflow.VIDEO
        ? {
            loading,
            config,
            authToken,
            inspectionId,
            setAuthToken,
            setInspectionId,
          }
        : {
            loading,
            config,
            authToken,
            inspectionId,
            vehicleType,
            availableVehicleTypes: availableVehicleTypes as VehicleType[],
            steeringWheel,
            getCurrentSights: getCurrentSights as () => Sight[],
            setAuthToken,
            setInspectionId,
            setVehicleType,
            setSteeringWheel,
          },
    [
      loading,
      config,
      authToken,
      inspectionId,
      vehicleType,
      availableVehicleTypes,
      steeringWheel,
      getCurrentSights,
      setAuthToken,
      setInspectionId,
      setVehicleType,
      setSteeringWheel,
    ],
  );

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
  /**
   * The required capture workflow. If this option is passed, the hook will return a MonkState value already type
   * checked and cast into the proper capture workflo, at the cost of throwing an error if the required worfklow does
   * not match the one in the current state config.
   */
  requireWorkflow?: CaptureWorkflow;
}

/**
 * Custom type used when using the `requireInspection` option with the `useMonkAppState` hook.
 */
export interface RequiredInspectionAppState {
  /**
   * The authentication token representing the currently logged-in user.
   */
  authToken: string;
  /**
   * The ID of the current inspection being handled (picture taking, report viewing...) by the application.
   */
  inspectionId: string;
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
export function useMonkAppState(o: Record<string, never>): MonkAppState;
export function useMonkAppState(o: { requireInspection: false | undefined }): MonkAppState;
export function useMonkAppState(o: {
  requireInspection: true;
}): MonkAppState & RequiredInspectionAppState;
export function useMonkAppState(o: { requireWorkflow: undefined }): MonkAppState;
export function useMonkAppState(o: {
  requireWorkflow: undefined;
  requireInspection: false | undefined;
}): MonkAppState;
export function useMonkAppState(o: {
  requireWorkflow: undefined;
  requireInspection: true;
}): MonkAppState & RequiredInspectionAppState;
export function useMonkAppState(o: {
  requireWorkflow: CaptureWorkflow.PHOTO;
}): PhotoCaptureAppState;
export function useMonkAppState(o: {
  requireWorkflow: CaptureWorkflow.PHOTO;
  requireInspection: false | undefined;
}): PhotoCaptureAppState;
export function useMonkAppState(o: {
  requireWorkflow: CaptureWorkflow.PHOTO;
  requireInspection: true;
}): PhotoCaptureAppState & RequiredInspectionAppState;
export function useMonkAppState(o: {
  requireWorkflow: CaptureWorkflow.VIDEO;
}): VideoCaptureAppState;
export function useMonkAppState(o: {
  requireWorkflow: CaptureWorkflow.VIDEO;
  requireInspection: false | undefined;
}): VideoCaptureAppState;
export function useMonkAppState(o: {
  requireWorkflow: CaptureWorkflow.VIDEO;
  requireInspection: true;
}): VideoCaptureAppState & RequiredInspectionAppState;
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
  if (options?.requireWorkflow && value.config.workflow !== options?.requireWorkflow) {
    throw new Error(
      'The capture workflow is different than the one required by the current component.',
    );
  }
  return value;
}
