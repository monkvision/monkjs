---
id: authenticating
title: "🔓 Authenticate"
slug: /js/guides/authenticating
---

Several streams are available to allow your users to authenticate.
We will assume that you already have a valid access token
and we will direct you to the section dedicated to authentication for more info.

## First steps

Install `@monkvision/corejs` from `npm`
``` npm
npm install @monkvision/corejs --save
```

Install `@monkvision/corejs` from `yarn`
``` yarn
yarn add @monkvision/corejs
```

``` javascript
import { config as corejs } from '@monkvision/corejs';
import dotenv from 'dotenv'

// Use the env config tool that fit your own project
// For example:
// import Constants from 'expo-constants';
// const config = Constants.manifest.extra;

const config = dotenv.config()

if (config.error) {
  throw config.error
}

const axiosConfig = {
  baseURL: `https://${config.API_DOMAIN}`,
  headers: { 'Access-Control-Allow-Origin': '*' },
};

const authConfig = {
  domain: config.AUTH_DOMAIN,
  audience: config.AUTH_AUDIENCE,
  clientId: config.AUTH_CLIENT_ID,
};

corejs.axiosConfig = axiosConfig;
corejs.authConfig = authConfig;
```

## `config` instance

The easiest way is to directly specify a custom accessToken to the corejs instance.

``` javascript
import { config } from '@monkvision/corejs';

// ...

if (response?.type === 'success' && response.authentication?.accessToken) {
      const { accessToken } = response.authentication;
      config.accessToken = accessToken;

      // ...
```
