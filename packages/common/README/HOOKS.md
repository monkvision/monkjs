# Hooks
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
React hooks. You can refer to [this page](README.md) for more general information on the package.

This package exports various utilities shared accross the different web and native applications integrating the Monk
workflow using the MonkJs SDK.

# Monk App Params
Most of the time, applications integrating the Monk SDK will need the same basic parameters to function :
- An authentication token to make API requests
- An inspection ID to know which inspection it should capture or visualize the reports of
- A vehicle type to know which sights or car 360 wireframes to use in the capture screen or in the inspection report
- A preferred language to use instead of the default English

This package export some utilies that can be used to more easily handle the state management and the initial values of
these app parameters.

## MonkAppParamsProvider component
The `MonkAppParamsProvider` component is a React context provider that declares the application parameters described
above. It declares a `MonkAppParamsContext` that contains the current auhtentication token, inspection ID and vehicle
type and setters functions to update them. Using some configuration props, this context provider also initializes the
parameters with values that can be fetched from the URL search parameters or the local storage :

- If the `fetchFromSearchParams` prop is set to `true`, during the first render of the component, it will look in the
  URL for search parameters described in the `MonkSearchParams` enum in order to update the app params accordingly.
  - Auth tokens need be compressed using ZLib (ex: using the `zlibCompress` utility function available in this
    package) and properly URL-encoded before being passed as a URL param. No Monk app should ever use auth tokens
    obtained from URL search params without compression and encoding.
  - If `fetchTokenFromStorage` is also set to `true`, the token fetched from the search params will always be
    used in priority over the one fetched from the local storage.
- If the `fetchTokenFromStorage` prop is set to `true`, during the first render of the MonkAppParamsProvider component,
  it will look in the local storage for a valid authentication token to use.
  - The storage key used to read / write the auth token in the local storage is the same throughout the Monk SDK and
    is defined in the `STORAGE_KEY_AUTH_TOKEN` variable exported by this package.
  - If `fetchFromSearchParams` is also set to `true`, the token fetched from the search params will always be
    used in priority over the one fetched from the local storage.

| Prop                  | Type    | Description                                                                                                                         | Required | Default Value |
|-----------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| fetchFromSearchParams | boolean | Boolean indicating if the app params should be initialized using values from the URL search params.                                 |          | `true`        |
| fetchTokenFromStorage | boolean | Boolean indicating if the auth token should be initialized using the value from the URL search params.                              |          | `true`        |
| updateLanguage        | boolean | Boolean indicating if the app language should be updated using the value from the URL search params.                                |          | `true`        |
| onFetchAuthToken      | boolean | Callback called when an authentication token has successfully been fetched from either the local storage, or the URL search params. |          |               |

## useMonkAppParams hook
This hook simply returns the current value of the `MonkAppParamsContext` declared by the `MonkAppParamsProvider`
component. It means that it can only be called within the render function of a child of this component. This hook
accepts an optional parameter called `required` which specifies if the `authToken` and the `inspectionId` params are
required. If they are, this hook will guarantee that the return values for these params is not null (even in TypeScript
typings), but will throw an error if they are.
