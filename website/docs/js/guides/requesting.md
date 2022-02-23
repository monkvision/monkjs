---
id: requesting
title: "📨 Requesting"
slug: /js/guides/requesting
---

In this guide, you will be able to call Monk Core Servers
and received an axiosResponse plus normalized results from it.

```js
const {
  axiosResponse, // https://axios-http.com/docs/res_schema
  entities, // https://github.com/paularmstrong/normalizr
  result,
} = await monkApi.inspection.getOne({ id: 'one-valid-inspection-id' })
```

```text
{
  axiosResponse: { data, status, statusText, headers, ... },
  result: "your-valid-inspection-id",
  entities: {
    inspections: {
      your-valid-inspection-id: {
        id: "your-valid-inspection-id",
        vehicle: "vehicle-id",
        damages: [ "damage-id-1", "damage-id-2" ]
      }
    },
    damages: {
      "damage-id-1": { "id": "damage-id-1", "type": "dent" },
      "damage-id-2": { "id": "damage-id-2", "type": "scratch" }
    },
    vehicle: {
      "vehicle-id": { id: "vehicle-id", "vin": "...", brand: 'Toyota', model: 'Corolla' }
    }
  }
}
```

## First steps

Install `@monkvision/corejs` from `npm`
```npm
npm install @monkvision/corejs --save
```

Install `@monkvision/corejs` from `yarn`
```yarn
yarn add @monkvision/corejs
```

## Requirements

Be sure to have a valid access token with the right permissions.
See more details about [authenticating](/monkjs/authenticating) in the dedicated section.

```js
import { config } from '@monkvision/corejs';

config.accessToken = myOwnAccessToken;
```
