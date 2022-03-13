---
id: requesting
title: "📨 Requesting data"
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
import monk from '@monkvision/corejs';

monk.config.accessToken = myOwnAccessToken;
```

## Usage
```js
import monk from '@monkvision/corejs';

const {
  axiosResponse, // https://axios-http.com/docs/res_schema
  entities, // https://github.com/paularmstrong/normalizr
  result,
} = await monk.entity.inspection.getOne({ id: 'one-valid-inspection-id' })
```

## Go further

You can go further by optimizing your queries and your state
thanks to Redux and data normalization.
Otherwise, you can skip to the section dedicated to viewing the results.

### Normalization

Under the hood, Monk uses several reducers to manage its slightly complex state.
We then identify the main entities which are:
- [Inspection](/docs/js/api/inspection)
- [Damage](/docs/js/api/damage)
- [Image](/docs/js/api/image)
- [Task](/docs/js/api/task)

When a query is executed via @monkvision/corejs,
the result will be automatically normalized and always return `results` and `entities`.
To learn more about data normalization,
you can refer to [paularmstrong/normalizr](https://github.com/paularmstrong/normalizr).

### Implement with Redux

In order to optimize queries or to cache data,
we can use these results and implement them
via different solutions such as _Redux_.

```yarn
yarn add redux @reduxjs/toolkit
```

That includes
[Redux Toolkit APIs](https://redux-toolkit.js.org/introduction/getting-started#whats-included)
such as [configureStore()](https://redux-toolkit.js.org/api/configureStore).

#### Slices

> Redux state is typically organized into "slices",
> defined by the reducers that are passed to combineReducers.
> See full documentation on
> [redux-toolkit.js.org](https://redux-toolkit.js.org/usage/usage-guide#creating-slices-of-state).

#### Reducers

```javascript
import monk from '@monkvision/corejs';
import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit'

const rootReducer = combineReducers({
  ...monk.reducers,
  // your own reducers...
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
```

#### Actions

#### Selectors

## What's next?

You will use the components dedicated to the visualization of our data
such as the display of the damage of an inspection.
