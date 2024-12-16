---
sidebar_position: 5
---

# Application State
## MonkAppStateProvider Component
Most of the time, web application implementing the MonkJs SDK for capturing or reporting purposes will need to store the
same application state that contains :
- the authentication token
- the current inspection ID
- the vehicle type of the user
- the steering wheel position of the user's vehicle

In order to factorize a lot of the code and reduce boilerplate, the MonkJs SDK provides a component called the
`MonkAppStateProvider` component. This component is a React provider component that defines a `MonkAppState` state
containing the following properties:

| Name             | Type                                                            | Description                                                                                                        |
|------------------|-----------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| loading          | `LoadingState`                                                  | Loading state indicating if the app state provider is loading.                                                     |
| config           | `PhotoCaptureAppConfig`                                         | The current application configuration.                                                                             |
| authToken        | <code>string &#124; null</code>                                 | The authentication token.                                                                                          |
| inspectionId     | <code>string &#124; null</code>                                 | The current inspection ID.                                                                                         |
| vehicleType      | <code>VehicleType &#124; null</code>                            | The vehicle of the user.                                                                                           |
| steeringWheel    | <code>SteeringWheelPosition &#124; null</code>                  | The steering wheel position of the user's vehicle.                                                                 |
| getCurrentSights | `() => Sight[]`                                                 | Util function to get the current Sights from the app config based on the vehicle type and steering wheel position. |
| setAuthToken     | <code>(value: string &#124; null) => void</code>                | Setter function for the `authToken` property.                                                                      |
| setInspectionId  | <code>(value: string &#124; null) => void</code>                | Setter function for the `inspectionId` property.                                                                   |
| setVehicleType   | <code>(value: VehicleType &#124; null) => void</code>           | Setter function for the `vehicleType` property.                                                                    |
| setSteeringWheel | <code>(value: SteeringWheelPosition &#124; null) => void</code> | Setter function for the `steeringWheel` property.                                                                  |

To use it, simply wrap you application inside the provider component and pass it the current app config as a prop :

```tsx
import { MonkAppStateProvider } from '@monkvision/common';
import { PhotoCaptureAppConfig } from '@monkvision/types';

const AppConfig: PhotoCaptureAppConfig = {
  ...
};

export function App() {
  return (
    <MonkAppStateProvider config={AppConfig}>
      ...
    </MonkAppStateProvider>
  );
}
```

In children of this component, you will then be able to use the `useMonkAppState` hook to obtain the current application
state :

```tsx
import { useMonkAppState } from '@monkvision/common';

export function ChildrenComponent() {
  const { inspectionId } = useMonkAppState();

  return <div>Current inspection ID : {inspectionId}</div>;
}
```

At the start-up of the application, the `MonkAppStateProvider` component will look for a valid authentication token
stored in the local storage of the browser, and will update the current auth token of the Monk state if it finds one.

## Fetching The State From URL
If you want, you can ask the `MonkAppStateProvider` component to fetch the app state from the URL search parameters. If
you choose to do this, at the start-up of your application, the provider will parse the URL search params and update the
app state if it finds anything.

To enable this, simply set `fetchFromSearchParams` to `true` in your application config. The `MonkAppStateProvider`
component will then automatically fetch the auth token (and properly handle the zlib decompression part), the inspection
ID, the vehicle type, the steering wheel position and the app language from the URL search params. The search parameter
keys are defined in the `MonkSearchParam` enumeration exported by the `@monkvision/common` package.

Notes :
- Since the current app language is not stored in the app state, if a language parameter has been found, the
  `onFetchLanguage` callback will be called with the found language.
- The token passed in the URL search parameters will always override the one found in the local storage.
