---
id: setting-up
title: ⚙️ Setting up
slug: /js/guides/setting-up
---

You will find guides to integrate the SDK according to your environment. We try to provide documentation and knowledge for as many cases as possible.
For each workflow, you may find nuances that will be detailed in the [🧯 Troubleshooting](https://monkvision.github.io/monkjs/docs/troubleshooting) section.

> The JS stack allows us to integrate a camera in Native via the React Native bridge, but also in web, via a compatible browser. This means that we can cover the following projects, from Create React App, React Native or Expo.

## Create React App

We are initiating a new [CRA](https://create-react-app.dev/) project with [npx, npm or yarn](https://create-react-app.dev/docs/getting-started#creating-an-app).

``` yarn
yarn create react-app my-awesome-project
```

Then we go to the project folder and install dependencies required to import SDKs.

``` sh
cd my-awesome-project
```

``` yarn
yarn add @monkvision/corejs @monkvision/react-native @monkvision/react-native-views @reduxjs/toolkit react-redux react-native-web
```

**See the [📷 Taking pictures](https://monkvision.github.io/monkjs/docs/js/guides/picturing) section to find how to display a `<CameraView />` component.**

> Projects initiated by CRA use a default webpack config. This brings problems when our dependencies are not exported by their owner in ES6.

**Externals**, in the babel vocabulary, means modules used in the sources of your App. We are going to add loaders so that Babel can handle modern JS such as [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

1. First, we install the necessary loaders in dev dependencies.
2. Then, the modules that will allow us to customiz and rewired the App.

``` yarn
yarn add -D @babel/plugin-proposal-optional-chaining @babel/plugin-proposal-nullish-coalescing-operator @babel/plugin-proposal-class-properties @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx @babel/plugin-transform-react-display-name && yarn add -D customize-cra react-app-rewired
```

As specified in the `customize-cra` [documentation](https://github.com/arackaf/customize-cra), we overload the configuration to add the custom plugins. For that, we create at the root of the project a `config-overrides.js` file, and we add the following:

``` javascript
/* config-overrides.js */

const { override, addExternalBabelPlugins } = require('customize-cra');

module.exports = override(
  ...addExternalBabelPlugins(
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-transform-react-display-name',
    'react-native-paper/babel',
  )
);
```

Finally, we change scripts in the `package.json` to run the project with a `yarn start` command.
``` json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
},
```

## Theming & Loading icons

`CameraView` component is using `react-native-paper` icons from `MaterialCommunityIcons`. We use a hook `useIcons` to load icons as fonts in the root component (`<App />`).

``` javascript
import React from 'react';

import { useIcons } from '@monkvision/react-native';
import { CameraView, theme } from '@monkvision/react-native-views';

function App() {
  useIcons();

  return (
    <PaperProvider theme={theme}>
      <CameraView />
    </PaperProvider>
  );
}
```
The hook also provides a `const loading = useIcons();` boolean.

To customize the theme, we can create our own `theme.js` file and import it via the `<PaperProvider>` or use the Monk theme file.

``` javascript
/* theme.js */

import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: '#274b9f',
    accent: '#7af7ff',
    success: '#5ccc68',
    warning: '#ff9800',
    error: '#fa603d',
    info: '#bbbdbf',
    primaryContrastText: '#ffffff',
  },
};

export default theme;
```

**See the [theming](https://callstack.github.io/react-native-paper/theming.html) section of `react-native-paper` to more details.**

## What's next?

You are ready to implement the Camera view and take pictures for analyzes.
