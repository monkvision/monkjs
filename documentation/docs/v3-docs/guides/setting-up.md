---
sidebar_position: 1
title: Setting Up
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# ⚙️ Setting up

You will find guides to integrate the SDK according to your environment.
We try to provide documentation and knowledge for as many cases as possible.
For each workflow, you may find nuances that will be detailed
in the [🧯 Troubleshooting](docs/v3-docs/troubleshooting.md) section.

> The JS stack allows us to integrate a camera in Native via the React Native bridge,
> but also in web, via a compatible browser.
> This means that we can cover the following projects,
> from Create React App, React Native or Expo.

## Create React App

We are initiating a new [CRA](https://create-react-app.dev/) project
with [npx, npm or yarn](https://create-react-app.dev/docs/getting-started#creating-an-app).

```yarn
yarn create react-app my-awesome-project
```

Then we go to the project folder and install dependencies required to import SDKs.

```sh
cd my-awesome-project
```

```yarn
yarn add @monkvision/corejs @monkvision/sights @monkvision/toolkit @monkvision/camera react-native-web
```

> Projects initiated by CRA use a default webpack config.
> This brings problems when our dependencies are not exported by their owner in ES6.

**Externals**, in the babel vocabulary, means modules used in the sources of your App.
We are going to add loaders so that Babel can handle modern JS
such as [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).

1. First, we install the necessary loaders in dev dependencies.
2. Then, the modules that will allow us to customize and rewired the App.

```yarn
yarn add -D @babel/plugin-proposal-optional-chaining @babel/plugin-proposal-nullish-coalescing-operator @babel/plugin-proposal-class-properties @babel/plugin-syntax-jsx @babel/plugin-transform-react-jsx @babel/plugin-transform-react-display-name && yarn add -D customize-cra react-app-rewired
```

As specified in the `customize-cra` [documentation](https://github.com/arackaf/customize-cra),
we overload the configuration to add the custom plugins.
For that, we create at the root of the project a `config-overrides.js` file,
and we add the following:

```javascript
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

### Possible errors linked to the usage of the camera package
#### Module not found: Error Can't resolve 'buffer'
```
Module not found: Error: Can't resolve 'buffer' in
BREAKING CHANGE: webpack  5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.
If you want to include a polyfill, you need to:
- add a fallback 'resolve.fallback: { "buffer": require.resolve("buffer/") }'
- install 'buffer'
  If you don't want to include a polyfill, you can use an empty module like this:
  resolve.fallback: { "buffer": false }
```

You might encounter this error or a similar error, while launching your app containing the monk's camera package.
As it is written, you will have to first create a `webpack.config.js` file at the root of your app project and fill it with:

```js
module.exports = {
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"), // replace the module if different from buffer
    }
  }
}
```

The last step will be to install the missing module `buffer`:
```shell
  yarn add buffer
```

#### expo-modules-core
You might also encounter this error if you are using the monk's camera package, because it needs the core system of the expo package.
So you if you have this error:
```shell
  yarn add expo-modules-core
```


## Create Expo App

Create an [expo](https://https://docs.expo.dev/) project
with [npx](https://https://docs.expo.dev/get-started/create-a-new-app/) and
choose the workflow you want.

```sh
npx expo init my-awesome-project && cd my-awesome-project
```

Like for the CRA project creation, install dependencies required to import SDK's.

```yarn
yarn add @monkvision/corejs @monkvision/sights @monkvision/toolkit @monkvision/camera react-native-web
```

### Manage Workflow project

All you have to do is import and use Monk.

### Bare Workflow project

> If your expo version is **>= 43**,
> then you may encounter this error while launching the android app build.

```
Execution failed for task ':app:checkDebugAarMetadata'.
> Could not resolve all files for configuration ':app:debugRuntimeClasspath'.
   > Could not find com.google.android:cameraview:1.0.0.
     Searched in the following locations:
       - file:/home/user/.m2/repository/com/google/android/cameraview/1.0.0/cameraview-1.0.0.pom
       - file:/home/user/test/expo-test-bare/node_modules/react-native/android/com/google/android/cameraview/1.0.0/cameraview-1.0.0.pom
       - file:/home/user/test/expo-test-bare/node_modules/jsc-android/dist/com/google/android/cameraview/1.0.0/cameraview-1.0.0.pom
```

So you may need to:
1. Add maven url to `android/build.gradle`
2. Re-install broken dependencies

```gradle
allprojects {
  repositories {
    ...
    maven {
      url "$rootDir/../node_modules/expo-camera/android/maven"
    }
  }
}
```

```yarn
yarn add expo-camera react-native-svg
```

## What's next?

You are ready to authenticate before implementing
the `<Capture />` component and take pictures for analysis.
