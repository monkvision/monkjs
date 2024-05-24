---
sidebar_position: 2
title: Authenticating
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# 🔓 Authenticating

Several streams are available to allow your users to authenticate.
We will assume that you already have a valid access token.

## First steps

Install `@monkvision/corejs` from `npm`
```npm
npm install @monkvision/corejs --save
```

Install `@monkvision/corejs` from `yarn`
```yarn
yarn add @monkvision/corejs
```

Create a `config.js` file where you can set your environment variables
to the Monk config singleton. Here an example for production:

```js
import monk from '@monkvision/corejs'; // Singleton
import dotenv from 'dotenv'

// Use the env config tool that fit your own project
// For example:
// import Constants from 'expo-constants';
// const config = Constants.manifest.extra;

const env = dotenv.config()

if (env.error) {
  throw env.error
}

const axiosConfig = {
  baseURL: `https://${env.API_DOMAIN}`, // api.monk.ai/v1
  headers: { 'Access-Control-Allow-Origin': '*' },
};

const authConfig = {
  domain: env.AUTH_DOMAIN, // idp.monk.ai
  audience: env.AUTH_AUDIENCE, // https://api.monk.ai/v1
  clientId: env.AUTH_CLIENT_ID, // your own client id given by our team
};

monk.config.axiosConfig = axiosConfig;
monk.config.authConfig = authConfig;
```

After authenticating with the workflow you've chosen,
you can set your access token to Monk config singleton.

```js
import { config } from '@monkvision/corejs';

monk.config.accessToken = myOwnAccessToken;
```

## How to get an access token ?

There is several ways to authenticate a user.

### With Auth0 CreateInspection Box
> Documentation under construction, please ask directly to the team.

### With Machine to Machine requests
> Documentation under construction, please ask directly to the team.
