# @monkvision/network
This package provides tools used by the MonkJs SDK to interact with the Network (authentication, API calls...).

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/network
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# Configuring the Package
In order for this package to work properly, some configuration properties need to be specified. Without properly
configuring the Network package, most of the MonkJs SDK will not work and errors will be thrown by the different
components.

The recommended way to configure this package is to set the required properties in your index file :

```typescript
// index.ts
import { config } from '@monkvision/network';

config.apiDomain = 'api.preview.monk.ai/v1';
// etc...
```

Note that these values are global and can be set and accessed anywhere within the app. Here is the list of configuration
properties available :

| Name         | Type   | Required | Description                                                                                                                                                        |
|--------------|--------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| apiDomain    | string | ✔️       | The HTTP domain of the Monk API.                                                                                                                                   |
| authDomain   | string | ✔️       | The authentication domain URL.                                                                                                                                     |
| authAudience | string | ✔️       | The authentication token resource identifier.                                                                                                                      |
| authClientId | string | ✔️       | The authentication client ID.                                                                                                                                      |
| authToken    | string |          | The authentication token used to communicate with the API. **Note : This value is automatically set if you are using the Auth features from the Network package.** |
