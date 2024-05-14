import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { monkLanguages, SteeringWheelPosition, VehicleType } from '@monkvision/types';
import { zlibDecompress } from '../utils';
import { useSearchParams } from '../hooks';

/**
 * Local storage key used within Monk web applications to store the authentication token.
 */
export const STORAGE_KEY_AUTH_TOKEN = '@monk_authToken';

/**
 * Application state usually used by Monk applications to configure and handle the current user journey.
 */
export interface MonkApplicationState {
  /**
   * The authentication token representing the currently logged-in user. If this param is `null`, it means the user is
   * not logged in.
   */
  authToken: string | null;
  /**
   * The ID of the current inspection being handled (picture taking, report viewing...) by the application. If this
   * param is `null`, it probably means that the inspection must be created by the app.
   */
  inspectionId: string | null;
  /**
   * The current vehicle type of the app. This value usually helps to choose which sights to display to the user, or
   * which car 360 wireframes to use for the inspection report.
   */
  vehicleType: VehicleType | null;
  /**
   * The position of the steering wheel.
   */
  steeringWheel: SteeringWheelPosition | null;
  /**
   * Callback used to set the current auth token.
   *
   * @see authToken
   */
  setAuthToken: Dispatch<SetStateAction<string | null>>;
  /**
   * Callback used to set the current inspection ID.
   *
   * @see inspectionId
   */
  setInspectionId: Dispatch<SetStateAction<string | null>>;
  /**
   * Callback used to set the current vehicle type.
   *
   * @see vehicleType
   */
  setVehicleType: Dispatch<SetStateAction<VehicleType | null>>;
  /**
   * Callback used to set the current steering wheel position.
   *
   * @see steeringWheel
   */
  setSteeringWheel: Dispatch<SetStateAction<SteeringWheelPosition | null>>;
}

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
 * React context used to store the current Monk application state.
 *
 * @see MonkApplicationState
 */
export const MonkApplicationStateContext = createContext<MonkApplicationState>({
  authToken: null,
  inspectionId: null,
  vehicleType: null,
  steeringWheel: null,
  setAuthToken: () => {},
  setInspectionId: () => {},
  setVehicleType: () => {},
  setSteeringWheel: () => {},
});

/**
 * Props accepted by the MonkApplicationStateProvider component.
 */
export interface MonkApplicationStateProviderProps {
  /**
   * Boolean used to indicate if the application parameters should be fetched from the URL search parameters. If this
   * prop is set to `true`, during the first render of the MonkApplicationStateProvider component, it will look in the
   * URL for search parameters described in the `MonkSearchParams` enum in order to update the app params accordingly.
   *
   * Notes :
   * - Auth tokens need be compressed using ZLib (ex: using the `zlibCompress` utility function available in this
   * package) and properly URL-encoded before being passed as a URL param. No Monk app should ever use auth tokens
   * obtained from URL search params without compression and encoding.
   * - If `fetchTokenFromStorage` is also set to `true`, the token fetched from the search params will always be
   * used in priority over the one fetched from the local storage.
   *
   * @default true
   * @see fetchTokenFromStorage
   * @see zlibCompress
   * @see encodeURIComponent
   */
  fetchFromSearchParams?: boolean;
  /**
   * Boolean used to indicate if the authentication token should be fetched from the local storage. If this prop is set
   * to `true`, during the first render of the MonkApplicationStateProvider component, it will look in the local storage
   * for a valid authentication token to use.
   *
   * Notes :
   * - The storage key used to read / write the auth token in the local storage is the same throughout the Monk SDK and
   * is defined in the `STORAGE_KEY_AUTH_TOKEN` variable exported by this package.
   * - If `fetchFromSearchParams` is also set to `true`, the token fetched from the search params will always be
   * used in priority over the one fetched from the local storage.
   *
   * @default true
   * @see fetchFromSearchParams
   * @see STORAGE_KEY_AUTH_TOKEN
   */
  fetchTokenFromStorage?: boolean;
  /**
   * Callback called when an authentication token has successfully been fetched from either the local storage, or the
   * URL search params.
   *
   * @see fetchFromSearchParams
   * @see fetchTokenFromStorage
   */
  onFetchAuthToken?: () => void;
  /**
   * Callback called when the language of the app must be updated because it has been specified in the URL params. If
   * `fetchFromSearchParams` is not set to `true`, this callback is never called.
   */
  onLanguageFetchedFromSearchParams?: (lang: string) => void;
}

/**
 * A React context provider that declares the state for the common parameters used by Monk applications. The parameters
 * are described in the `MonkApplicationState` interface. Using the `fetchFromSearchParams` and `fetchTokenFromStorage` props,
 * this component can also fetch initial values for these params directly from the URL search params and the web local
 * storage. See the TSDoc for these props for more details.
 *
 * @see MonkApplicationState
 * @see MonkApplicationStateProviderProps
 */
export function MonkApplicationStateProvider({
  fetchFromSearchParams = true,
  fetchTokenFromStorage = true,
  onFetchAuthToken,
  onLanguageFetchedFromSearchParams,
  children,
}: PropsWithChildren<MonkApplicationStateProviderProps>) {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [inspectionId, setInspectionId] = useState<string | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType | null>(null);
  const [steeringWheel, setSteeringWheel] = useState<SteeringWheelPosition | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    let fetchedToken: string | null = null;
    if (fetchTokenFromStorage) {
      fetchedToken = localStorage.getItem(STORAGE_KEY_AUTH_TOKEN);
    }
    if (fetchFromSearchParams) {
      setInspectionId((param) => searchParams.get(MonkSearchParam.INSPECTION_ID) ?? param);

      const vehicleTypeParam = searchParams.get(MonkSearchParam.VEHICLE_TYPE);
      const newVehicleType = Object.values<string | null>(VehicleType).includes(vehicleTypeParam)
        ? (vehicleTypeParam as VehicleType)
        : null;
      setVehicleType((param) => newVehicleType ?? param);

      const steeringWheelParam = searchParams.get(MonkSearchParam.STEERING_WHEEL);
      const newSteeringWheel = Object.values<string | null>(SteeringWheelPosition).includes(
        steeringWheelParam,
      )
        ? (steeringWheelParam as SteeringWheelPosition)
        : null;
      setSteeringWheel((param) => newSteeringWheel ?? param);

      const compressedToken = searchParams.get(MonkSearchParam.TOKEN);
      if (compressedToken) {
        fetchedToken = zlibDecompress(compressedToken);
      }

      if (fetchedToken) {
        setAuthToken(fetchedToken);
        onFetchAuthToken?.();
      }

      const lang = searchParams.get(MonkSearchParam.LANGUAGE);
      if (lang && (monkLanguages as readonly string[]).includes(lang)) {
        onLanguageFetchedFromSearchParams?.(lang);
      }
    }
  }, [searchParams]);

  const appParams = useMemo(
    () => ({
      authToken,
      inspectionId,
      vehicleType,
      steeringWheel,
      setAuthToken,
      setInspectionId,
      setVehicleType,
      setSteeringWheel,
    }),
    [authToken, inspectionId, vehicleType, steeringWheel],
  );

  return (
    <MonkApplicationStateContext.Provider value={appParams}>
      {children}
    </MonkApplicationStateContext.Provider>
  );
}

/**
 * Params accepted by the `useMonkApplicationState`  hook.
 */
export interface UseMonkApplicationStateParams {
  /**
   * Boolean indicating if the `authToken` and the `inspectionId` params are required. If this value is set to `true`,
   * the hook will return non-null values (even in TypeScript typings) values for the `authToken` and the `inspectionId`
   * params, at the cost of throwing an error if either one of these param is `null`.
   */
  required?: boolean;
}

/**
 * Custom hook used to get the common Monk application state (described in the `MonkApplicationState` interface) for the
 * current `MonkApplicationStateContext`. This hook must be called within a child of the `MonkApplicationStateProvider`
 * component.
 *
 * @see MonkApplicationState
 * @see MonkApplicationStateContext
 * @see MonkApplicationStateProvider
 */
export function useMonkApplicationState(): MonkApplicationState;
export function useMonkApplicationState(options: {
  required: false | undefined;
}): MonkApplicationState;
export function useMonkApplicationState(options: {
  required: true;
}): MonkApplicationState & { authToken: string; inspectionId: string };
export function useMonkApplicationState(
  options?: UseMonkApplicationStateParams,
): MonkApplicationState {
  const context = useContext(MonkApplicationStateContext);
  if (options?.required && !context.authToken) {
    throw new Error('Authentication token is null but was required by the current component.');
  }
  if (options?.required && !context.inspectionId) {
    throw new Error('Inspection ID is null but was required by the current component.');
  }
  return context;
}
