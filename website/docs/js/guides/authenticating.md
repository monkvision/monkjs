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
npm install @monkvision/corejs @reduxjs/toolkit --save
```

Install `@monkvision/corejs` from `yarn`
``` yarn
yarn add @monkvision/corejs @reduxjs/toolkit
```

Then we start by instantiating the core with an object of type `BaseQuery`.

``` javascript
import MonkCore, { getBaseQuery } from '@monkvision/corejs';
import dotenv from 'dotenv'

// Use the env config tool that fit your own project
// For example:
// import Constants from 'expo-constants';
// const config = Constants.manifest.extra;

const config = dotenv.config()

if (config.error) {
  throw config.error
}

const monkCore = new MonkCore(getBaseQuery({
  baseUrl: `https://${config.MONK_DOMAIN}/`,
}));

export default monkCore;
```

## `baseQuery` option

The easiest way is to directly specify a custom header when instantiating the core.

``` javascript
const monkCore = new MonkCore(getBaseQuery({
  baseUrl: `https://${config.MONK_DOMAIN}/`,
  customHeaders: [['authorization', `Bearer ${yourToken}`]]
}));
```

## `auth` reducer

You can also instantiate the core at runtime and setup a listener
via [Redux Toolkit](https://redux-toolkit.js.org/rtk-query/api/created-api/redux-integration).

``` javascript
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import monkCore from 'config/monkCore';

// Your own auth slice reducer
import auth from './slices/auth';

const middlewares = [monkCore.inspection.middleware];


const store = configureStore({
  middleware: (getMiddleware) => getMiddleware().concat(middlewares),
  reducer: {
    auth,
    [monkCore.inspection.reducerPath]: monkCore.inspection.reducer,
  },
});

setupListeners(store.dispatch);

export default store;
```

The core will listen directly to your store
and will use the `accessToken` present in the `auth` reducer.
In this case, it is important to respect the names `auth.accessToken`
since the core prepares its headers in the following way.

``` javascript
prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      // ...
```

**Soon: via the `<MonkProvider />`**
