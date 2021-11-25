---
id: intro
title: "🏁 Overview"
slug: /
---

Let's divide Monk into three parts. The **core**, the **view** and the **app**.

* Core is a module using redux queries
* View is a component using native features with core features
* App is your own application


``` mermaid
sequenceDiagram

participant App
participant View
participant Core

par Runtime
App->>Core: Configure instance of MonkCore
Note over App,View: import { config } from '@monkvision/corejs';
App->>View: Render a CameraView loading native Camera
Note over App,View: import { CameraView } from '@monkvision/react-native-views';
end

loop Component Lifecycle
View-->>Core: Use hooks to get or set data
Core-->>View: Update view with new data
Note over Core,View: Execute callbacks from Components
end

View->>App: Display elements and drive user until<br>he gets the full inspection
Note over View,App: const handleCloseCamera =<br>useCallback((pictures) => { ... }, []);
Note over View,App: <CameraView onCloseCamera={handleCloseCamera} />
```

## 🧿 Core

Based on Redux, the core instance provides a set of tools to request manipulation of Monk data.

``` mermaid
sequenceDiagram

participant Core
participant Servers

loop
  Core->>Servers: Execute queries
  Servers->>Core: Update client store via HTTP response
  Servers-->>Core: Invalidate cache with WS stream
end
```

Once instantiated, the core **provides the APIs** essential to the use of artificial intelligence, but also **hooks** and other **middlewares** specific to front-end development.

``` javascript
/* config/corejs.js */

import Constants from 'expo-constants';
import { config } from '@monkvision/corejs';

const axiosConfig = {
  baseURL: `https://${Constants.manifest.extra.API_DOMAIN}`,
  headers: { 'Access-Control-Allow-Origin': '*' },
};

const authConfig = {
  domain: Constants.manifest.extra.AUTH_DOMAIN,
  audience: Constants.manifest.extra.AUTH_AUDIENCE,
  clientId: Constants.manifest.extra.AUTH_CLIENT_ID,
};

config.axiosConfig = axiosConfig;
config.authConfig = authConfig;
```

``` javascript
/* App.jsx */

import React, { useCallback, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { getOneInspectionById, selectInspectionById } from '@monkvision/corejs';

import JSONTree from 'react-native-json-tree';

// Your own components...
import Loading from 'components/Loading';
import ErrorCard from 'components/ErrorCard';
import Inspection from 'components/Inspection';

function GetInspectionScreen() {
  const route = useRoute();
  const dispatch = useDispatch();

  const { inspectionId } = route.params;
  const inspection = useSelector(((state) => selectInspectionById(state, inspectionId)));
  const { loading, error } = useSelector(((state) => state.inspections));

  useEffect(() => {
    if (loading !== 'pending' && !inspection && !error) {
      dispatch(getOneInspectionById({ id: inspectionId }));
    }
  }, [dispatch, error, inspection, inspectionId, loading]);

  if (loading === 'pending') {
    return <Loading />;
  }

  if (error) {
    return <ErrorCard />;
  }

  return <Inspection {...inspection) />;
}
```

> Currently written in _JavaScript_, we are working to provide a core for every popular language that can be requested to execute a query (_EcmaScript, TypeScript, Dart, Python..._).
It accepts a `CLIENT_ID` and domain name `MONK_DOMAIN` as parameters. It follows the _Redux_ pattern and can be combined with your own store and your own middleware.

## 🧱 Components

The React Native component library allows you to build a set of views or modules brick by brick.

This library is useful if you want to use lower level features or customize your components as you wish, unlike the `react-native-views` library which embeds much more than micro-components.

## 🚀 Views

The `react-native-views` library embeds the features of the previous two. It mixes the server calls with the components in order to provide a very high level development kit.

> Each view globally accepts a panel of callbacks like `onCloseCamera` or `onTakingPicture`. They are however heavier, using `react-native-paper` as the default UI library, which can weigh down your bundle.

The views are all compatible with Android, iOS and Web, unless specified otherwise.

``` javascript
/* MyNavigationScreen.jsx */

import React, { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { CameraView } from '@monkvision/react-native-views';

export default function MyNavigationScreen() {
  const navigation = useNavigation();

  const handleCloseCamera = useCallback((/* pictures */) => {
    // console.log(pictures);
    navigation.navigate('HomePage');
  }, [navigation]);

  return (
    <CameraView onCloseCamera={handleCloseCamera} />
  );
}
```

## What's next?

Now that you understand each basic principle, you can install the necessary modules for your own tech stack.
Any request or feedback is welcome.
For that, please create an issue on the repository [monkvision/monkjs](https://github.com/monkvision/monkjs/issues/new).
