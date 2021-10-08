---
id: intro
title: Overview
slug: /
---

Monk's SDKs are divided in three:
1. A **core** module providing a redux kit to get and manipulate data 🧿
2. A **components** module exporting basic native features 🧱
3. A **views** module using core and components together 🚀

They act like the following diagram:

``` mermaid
sequenceDiagram

participant App
participant Views
participant Core

par Runtime
App->>Core: Create an instance of MonkCore
Note over App,Views: const monkCore = new MonkCore({ baseUrl });
App->>Views: Render a CameraView loading native Camera
Note over App,Views: import { CameraView } from '@monkvision/react-native-views';
end

loop Component Lifecycle
Views-->>Core: Use hooks to get or set data
Core-->>Views: Update view with new data
Note over Core,Views: Execute callbacks from Components
end

Views->>App: Display elements and drive use until<br>he gets the full inspection
Note over Views,App: const handleCloseCamera =<br>useCallback((pictures) => { ... }, []);
Note over Views,App: <CameraView onCloseCamera={handleCloseCamera} />
```

## 🧿 Core

**The core is a basic module. It's a proxy between your code and Monk's servers.**

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
/* config/monkCore.js */

import MonkCore from '@monkvision/corejs/src';
import Constants from 'expo-constants';

const monkCore = new MonkCore({
  baseUrl: `https://${Constants.manifest.extra.MONK_DOMAIN}/`,
});

export default monkCore;
```
``` javascript
/* App.jsx */

import monkCore from 'config/monkCore';
import isEmpty from 'lodash.isempty';

// Your own components...
import Loading from 'components/Loading';
import Empty from 'components/Empty';
import Inspection from 'components/Inspection';

const { useGetInspectionsQuery } = monkCore.inspection;

function App() {
  const { data, isLoading } = useGetInspectionsQuery();

  if (isLoading) {
    return <Loading />;
  }

  if (isEmpty(data)) {
    return <Empty />;
  }

  return data.map((props) => <Inspection {...props) />;
}
```

> Currently written in _JavaScript_, we are working to provide a core for every popular language that can be requested to execute a query (_EcmaScript, TypeScript, Dart, Python..._).
It accepts a `CLIENT_ID` and domain name `MONK_DOMAIN` as parameters. It follows the _Redux_ pattern and can be combined with your own store and your own middleware.

## 🧱 Components

The React Native component library allows you to build a set of views or modules brick by brick.

> For example, the `CameraView` is composed of the `Camera` and `Gallery` component at the same time, `Camera` accepting as parameters your own capture buttons.

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
Any request or feedback is welcome. For that, please create an issue on the repository [monkvision/monkjs](https://github.com/monkvision/monkjs/issues/new).
