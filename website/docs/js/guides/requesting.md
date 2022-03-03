---
id: requesting
title: "📨 Requesting"
slug: /js/guides/requesting
---

In this guide, you will be able to call Monk Core Servers
and received an axiosResponse in addition to normalized entities and results.

Install `@monkvision/corejs` from `npm`
```npm
npm install @monkvision/corejs --save
```

Install `@monkvision/corejs` from `yarn`
```yarn
yarn add @monkvision/corejs
```

## Configuration
Be sure to have a valid access token with the right permissions.
See more details about [authenticating](/monkjs/docs/js/guides/authenticating) in the dedicated section.

```js
import { config } from '@monkvision/corejs';

config.accessToken = myOwnAccessToken;
```

## Usage
```js
import monk from '@monkvision/corejs'

const {
  axiosResponse, // https://axios-http.com/docs/res_schema
  entities, // https://github.com/paularmstrong/normalizr
  result,
} = await monk.entity.inspection.getOne({ id: 'one-valid-inspection-id' })
```
