# @monkvision/network
This package provides tools used by the MonkJs SDK to interact with the Network (authentication, API calls...).

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/network
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# API Requests
This package exports an object called `MonkApi` that regroups the different API requests available. The request
available in this pacakge all follow the same format :

- They can accept a certain amount of parameters
- The last parameters of the function will always be :
  - The `apiConfig` object, that describes how to communicate with the
    API (API domain and authentication token).
  - An optional MonkState `dispatch` function that, if provided to the request function, will allow it to automatically
    update the local React state. If not provided, the function will act as a simple TypeScript function with no React
    functionality. To help you integrate Monk API requests more easily into your React apps, take a look at the
    `useMonkApi` hook below.
- Their return type always contains at least the following properties:
  - `body` : The API response body.
  - `response` :  The raw HTTP response object.

### getInspection
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.getInspection(options, apiConfig, dispatch);
```

Fetch the details of an inspection using its ID. The resulting action of this request will contain the list of
every entity that has been fetched using this API call.

| Parameter | Type                 | Description                 | Required |
|-----------|----------------------|-----------------------------|----------|
| options   | GetInspectionOptions | The options of the request. | ✔️       |


### createInspection
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.createInspection(options, apiConfig);
```

Create a new inspection. This request does not modify the local state. To fetch the inspection details, use the
`getInspection` request after creating one, using the ID returned by this request.

| Parameter | Type                    | Description                 | Required |
|-----------|-------------------------|-----------------------------|----------|
| options   | CreateInspectionOptions | The options of the request. | ✔️       |

### addImage
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.addImage(options, apiConfig, dispatch);
```

Add a new image to an inspection. The resulting action of this request will contain the details of the image that has
been created in the API.

| Parameter | Type            | Description                                              | Required |
|-----------|-----------------|----------------------------------------------------------|----------|
| options   | AddImageOptions | The options used to specify how to upload the image.     | ✔️       |

### updateTaskStatus
```typescript
import { MonkApi } from '@monkvision/network';
import { ProgressStatus, TaskName } from '@monkvision/types';

MonkApi.updateTaskStatus(options, apiConfig, dispatch);
```

Update the progress status of an inspection task.

**Note : This API call is known to sometimes fail for unknown reasons. In order to fix this, we added a retry config
to this API request : when failing, this request will retry itself up to 4 times (5 API calls in total), with
exponentially increasing delay between each request (max delay : 1.5s).**

| Parameter | Type                    | Description                                              | Required |
|-----------|-------------------------|----------------------------------------------------------|----------|
| options   | UpdateTaskStatusOptions | The options of the request.                              | ✔️       |

### startInspectionTasks
```typescript
import { MonkApi } from '@monkvision/network';
import { TaskName } from '@monkvision/types';

MonkApi.startInspectionTasks(options, apiConfig, dispatch);
```

Start some inspection tasks that were in the NOT_STARTED status. This function actually makes one API call for each
task provided using the `updateTaskStatus`.

**Note : This API call is known to sometimes fail for unknown reasons. Please take note of the details provided in
this documentation for the `updateTaskStatus` function.**

| Parameter | Type                        | Description                                              | Required |
|-----------|-----------------------------|----------------------------------------------------------|----------|
| options   | StartInspectionTasksOptions | The options of the request.                              | ✔️       |

### getLiveConfig
```typescript
import { MonkApi } from '@monkvision/network';https://acvauctions.fls.jetbrains.com

MonkApi.getLiveConfig(id);
```

Fetch a webapp live configuration from the API.

| Parameter | Type   | Description                       | Required |
|-----------|--------|-----------------------------------|----------|
| id        | string | The ID of the live config to get. | ✔️       |

### updateInspectionVehicle
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.updateInspectionVehicule(options, apiConfig, dispatch);
```

Update the vehicle of an inspection.

| Parameter | Type                           | Description                 | Required |
|-----------|--------------------------------|-----------------------------|----------|
| options   | UpdateInspectionVehicleOptions | The options of the request. | ✔️       |

### createPricing
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.createPricing(options, apiConfig, dispatch);
```

Create a new pricing of an inspection.

| Parameter | Type                 | Description                 | Required |
|-----------|----------------------|-----------------------------|----------|
| options   | CreatePricingOptions | The options of the request. | ✔️       |

### updatePricing
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.updatePricing(options, apiConfig, dispatch);
```

Update a pricing of an inspection.

| Parameter | Type                 | Description                 | Required |
|-----------|----------------------|-----------------------------|----------|
| options   | UpdatePricingOptions | The options of the request. | ✔️       |

### deletePricing
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.deletePricing(options, apiConfig, dispatch);
```

Delete a pricing of an inspection.

| Parameter | Type                 | Description                 | Required |
|-----------|----------------------|-----------------------------|----------|
| options   | DeletePricingOptions | The options of the request. | ✔️       |

### updateAdditionalData
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.updateAdditionalData(options, apiConfig, dispatch);
```

Update the additional data of an inspection.

| Parameter | Type                        | Description                 | Required |
|-----------|-----------------------------|-----------------------------|----------|
| options   | UpdateAdditionalDataOptions | The options of the request. | ✔️       |

### createDamage
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.createDamage(options, apiConfig, dispatch);
```

Create a new damage of an inspection.

| Parameter | Type                | Description                 | Required |
|-----------|---------------------|-----------------------------|----------|
| options   | CreateDamageOptions | The options of the request. | ✔️       |

### deleteDamage
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.deleteDamage(options, apiConfig, dispatch);
```

Delete a damage of an inspection.

| Parameter | Type                | Description                 | Required |
|-----------|---------------------|-----------------------------|----------|
| options   | DeleteDamageOptions | The options of the request. | ✔️       |

### getInspections
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.getInspections(options, apiConfig, dispatch);
```

Fetch the details of multiple inspections using the provided filters. The resulting action of this request will contain
a list of all entities that match the specified criteria.

| Parameter | Type                  | Description                 | Required |
|-----------|-----------------------|-----------------------------|----------|
| options   | getInspectionsOptions | The options of the request. | ✔️       |


### getInspectionsCount
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.getInspectionsCount(options, apiConfig, dispatch);
```

Gets the count of inspections that match the given filters.

| Parameter | Type                  | Description                 | Required |
|-----------|-----------------------|-----------------------------|----------|
| options   | getInspectionsOptions | The options of the request. | ✔️       |

# React Tools
In order to simply integrate the Monk Api requests into your React app, you can make use of the `useMonkApi` hook. This
custom hook returns a custom version of the `MonkApi` object described in the section above, in which the requests do
not need to be passed the `apiConfig` parameter (since it is already provided to the `useMonkApi` hook) and the
MonkState `dispatch` function.

```tsx
import { useEffect } from 'react';
import { MonkApi, useMonkApi } from '@monkvision/network';
import { TaskName } from '@monkvision/types';

function App() {
  const { getInspection } = useMonkApi(apiConfig);

  useEffect(() => {
    // This call automatically syncs the local state with the distant state, which means that entities located in the
    // MonkState (accessed using the `useMonkState` hook) are automatically updated after the response from the server.
    getInspection(inspectionId);
  }, []);
}
```

## Hooks
This package also exports useful Network hooks that you can use in your React apps.

### useInspectionPoll
```tsx
import { useInspectionPoll } from '@monkvision/network';

function TestComponent() {
  useInspectionPoll({
    id: myInspectionId,
    delay: 2000,
    apiConfig,
    onSuccess: (entities) => console.log(entities.inspections.find((inspection) => inspection.id === myInspectionId)),
    compliance,
  });
}
```
Custom hook used to fetch an inspection every `delay` milliseconds using the `getInspection` API request. To stop the
hook from making requests, simply pass a `null` vlaue for the `delay` param.

# Authentication
This package also exports tools for dealing with authentication within the Monk SDK :

## useAuth hook
This package exports a custom hook called `useAuth` used to easily handle authentication in Monk applications. It stores
the current user's authentication token, and returns callbacks used to log in and out of the application using Auth0
pop-ups. It accepts a config option called `storeToken` that indicates if the token should be fetched and stored from
the browser local storage (default : `true`).

- For this hook to work properly, you must use it in a component that is a child of an `Auth0Provider` component.
- This hook automatically stores the token fetched in the `useMonkAppState` hook so that it can be accessed
  anywhere in your app if you're using the `MonkAppStateProvider`.

```tsx
function MyAuthComponent() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogIn = () => {
    login().then(() => {
      navigate('/home');
    });
  };

  return <button onClick={handleLogIn}>Log In</button>;
}
```

## JWT Utils
### Token decoding
You can decode Monk JWT token issued by Auth0 using the `decodeMonkJwt` util function provided by this package :

```typescript
import { decodeMonkJwt, MonkJwtPayload } from '@monkvision/network';

const decodedToken: MonkJwtPayload =  decodeMonkJwt(token);
```

The available properties in the Monk JWT token payload are described in the `MonkJwtPayload` typescript interface.

### isUserAuthorized
This utility function checks if the given user has all the required authroizations. You can either pass an auth token
to be decoded or the JWT payload directly.

```typescript
import { MonkApiPermission } from '@monkvision/types';
import { isUserAuthorized } from '@monkvision/network';

const requiredPermissions = [MonkApiPermission.INSPECTION_CREATE, MonkApiPermission.INSPECTION_READ];
console.log(isUserAuthorized(value, requiredPermissions));
// value can either be an auth token as a string or a decoded JWT payload
```


### isTokenExpired
This utility function checks if an authorization token is expired or not. You can either pass an auth token to be
decoded or the JWT payload directly.

```typescript
import { isTokenExpired } from '@monkvision/network';

console.log(isTokenExpired(value));
// value can either be an auth token as a string or a decoded JWT payload
```
