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
- The last parameter of the function will always be the `apiConfig` object, that describes how to communicate with the
  API (API domain and authentication token).
- They always return the same object, containing the following properties:
  - `action` : A `MonkAction` that you can dispatch in the `MonkState` in order to synchronize the local state of the
    application with the distant state after this request has been made. See the documentation for the
    `@monkvision/common` package for more details about state management.
  - `body` : The API response body.
  - `response` :  The raw HTTP response object.

### getInspection
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.getInspection(inspectionId, apiConfig);
```

Fetch the details of an inspection using its ID. The resulting action of this request will contain the list of
every entity that has been fetched using this API call.

| Parameter    | Type         | Description                                              | Required |
|--------------|--------------|----------------------------------------------------------|----------|
| inspectionId | string       | The ID of the inspection to get the details of.          | ✔️       |
| apiConfig    | ApiConfig    | Api config containing the api domain and the auth token. | ✔️       |

### addImage
```typescript
import { MonkApi } from '@monkvision/network';

MonkApi.addImage(options, apiConfig);
```

Add a new image to an inspection. The resulting action of this request will contain the details of the image that has
been created in the API.

| Parameter | Type            | Description                                              | Required |
|-----------|-----------------|----------------------------------------------------------|----------|
| options   | AddImageOptions | The options used to specify how to upload the image.     | ✔️       |
| apiConfig | ApiConfig       | Api config containing the api domain and the auth token. | ✔️       |

### updateTaskStatus
```typescript
import { MonkApi } from '@monkvision/network';
import { ProgressStatus, TaskName } from '@monkvision/types';

MonkApi.updateTaskStatus(inspectionId, TaskName.DAMAGE_DETECTION, ProgressStatus.TODO);
```

Update the progress status of an inspection task.

**Note : This API call is known to sometimes fail for unknown reasons. In order to fix this, we added a retry config
to this API request : when failing, this request will retry itself up to 4 times (5 API calls in total), with
exponentially increasing delay between each request (max delay : 1.5s).**

| Parameter    | Type           | Description                                              | Required |
|--------------|----------------|----------------------------------------------------------|----------|
| inspectionId | string         | The ID of the inspection.                                | ✔️       |
| name         | TaskName       | The name of the task to update the progress status of.   | ✔️       |
| status       | ProgressStatus | The new progress status of the task.                     | ✔️       |
| apiConfig    | ApiConfig      | Api config containing the api domain and the auth token. | ✔️       |

### startInspectionTasks
```typescript
import { MonkApi } from '@monkvision/network';
import { TaskName } from '@monkvision/types';

MonkApi.startInspectionTasks(inspectionId, [TaskName.DAMAGE_DETECTION, TaskName.WHEEL_ANALYSIS]);
```

Start some inspection tasks that were in the NOT_STARTED status. This function actually makes one API call for each
task provided using the `updateTaskStatus`.

**Note : This API call is known to sometimes fail for unknown reasons. Please take note of the details provided in
this documentation for the `updateTaskStatus` function.**

| Parameter    | Type           | Description                                              | Required |
|--------------|----------------|----------------------------------------------------------|----------|
| inspectionId | string         | The ID of the inspection.                                | ✔️       |
| names        | TaskName[]     | The names of the task to start.                          | ✔️       |
| apiConfig    | ApiConfig      | Api config containing the api domain and the auth token. | ✔️       |

# React Tools
In order to simply integrate the Monk Api requests into your React app, you can make use of the `useMonkApi` hook. This
custom hook returns a custom version of the `MonkApi` object described in the section above, in which the requests do
not need to be passed the `apiConfig` parameter (since it is already provided to the `useMonkApi` hook), and in which
every request call will automatically dispatch the action into the MonkState :

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

# Authentication
This package also exports tools for dealing with authentication within the Monk SDK :

## useAuth hook
This package exports a custom hook called `useAuth` used to easily handle authentication in Monk applications. It stores
the current user's authentication token, and returns callbacks used to log in and out of the application using Auth0
pop-ups. It accepts a config option called `storeToken` that indicates if the token should be fetched and stored from
the browser local storage (default : `true`).

- For this hook to work properly, you must use it in a component that is a child of an `Auth0Provider` component.
- If, like in most Monk apps, you plan on using both the `useMonkAppParams` and the `useAuth` hooks, then
  only the token stored and returned by the `useMonkAppParams` should be used. The token of this hook must only be
  used when using the `useAuth` hook only. This hook will automatically synchronize both tokens for you.

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
import { isUserAuthorized, MonkApiPermission } from '@monkvision/network';

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
