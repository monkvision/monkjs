---
sidebar_position: 4
title: Requesting Data
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# 📨 Requesting data

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
See more details about [authenticating](docs/v3-docs/guides/authenticating.md) in the dedicated section.

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
} = await monk.entity.inspection.getOne('one-valid-inspection-id');
```

## Go further

You can go further by optimizing your queries and your state
thanks to Redux and data normalization.
Otherwise, you can skip to the section dedicated to viewing the results.

### Normalization

Under the hood, Monk uses several reducers to manage its slightly complex state.
We then identify the main entities which are:
- [Inspection](docs/v3-docs/apis/javascript/inspection.md)
- [Damage](docs/v3-docs/apis/javascript/damage.md)
- [Image](docs/v3-docs/apis/javascript/image.md)
- [Task](docs/v3-docs/apis/javascript/task.md)

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

#### Selectors & Actions

```javascript
import React, { useCallback, useEffect, useState } from 'react';
import monk from '@monkvision/corejs';
import { useDispatch } from 'react-redux';

const { entity } = monk;

function Inspection({ id = 'one-valid-inspection-id' }) {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const catchLoadingError = useCallback((e) => {
    setLoading(false);
    setError(e);
  }, [setLoading, setError])

  const getOneInspection = useCallback(async (id, showDeletedObjects) => {
    if (!loading) {
      setLoading(true);

      try {
        const response = await entity.inspection.getOne(id, { showDeletedObjects });
        dispatch({ type: `${entity.inspection.name}/gotOne`, payload: response });
        setLoading(false);
      } catch (e) {
        catchLoadingError(e);
      }
    }
  }, [loading]);

  const inspection = entity.inspection.selectors.selectById(id);

  useEffect(() => {
    getOneInspection(id, false);
  }, [getOneInspection, id]);

  if (loading) {
    return 'Loading...';
  }

  return (
    <>
      ...
    </>
  );
}
```

## What's next?

You will use the components dedicated to the visualization of our data
such as the display of the damage of an inspection.
