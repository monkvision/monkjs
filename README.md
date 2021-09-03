# 👁️‍🗨️ Monk
Get a fully automated damage report with all item changes classified by type, location and severity.

Find more information on [our website](https://monk.ai).

---
# React Native SDK

[![Build Status][circleci-image]][circleci-url]
[![NPM version][npm-image]][npm-url]
[![Coverage][codecov-image]][codecov-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Interested in using parts of our product? SDK brings you composable components for your apps.

- [Install](#install)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)
- [Dependencies](#dependencies)
- [License](#license)

## Install

```sh
npm install react-native-monk
```
If you are using yarn.
```sh
yarn add react-native-monk
```

Now you can import components from the lib.
``` javascript
import React from 'react';
import { StyleSheet, View, Button } from 'react-native';

import { Camera, CameraSideBar } from 'react-native-monk/components';

export default function App() {
  function closeCamera() {
    // console.log('Closing camera...');
  }

  function takeAPicture() {
    // console.log('Taking picture...');
  }

  function showGallery() {
    // console.log('Showing gallery...');
  }

  return (
    <Camera>
      <CameraSideBar right={0} width={125}>
        <Button
          accessibilityLabel="Close camera"
          onPress={closeCamera}
        />
        <Button
          accessibilityLabel="Take a picture"
          onPress={takeAPicture}
        />
        <Button
          accessibilityLabel="Show Gallery"
          onPress={showGallery}
        />
      </CameraSideBar>
    </Camera>
  );
}
```

## Documentation

For a complete reference and examples please check our [documentation](https://monkvision.github.io/monk/docs).

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Auth0 Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

For Monk related questions/support please use the [Support Center](https://support.monkvision.ai).

## Dependencies

Monk applications are built with [React Native](https://reactnative.dev/) and [Expo](https://expo.dev/). We are also using few [Lodash](https://lodash.com/) functions. Find all our dependencies in the [package.json](package.json).

If you don't want to use our App or SDK, please follow how to [work with Monk from scratch]().

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

<!-- CONST -->

[npm-image]: https://img.shields.io/npm/v/monk-sdk.svg?style=flat-square
[npm-url]: https://npmjs.org/package/monk-sdk
[circleci-image]: https://img.shields.io/circleci/project/github/monkvision/monk-sdk.svg?branch=master&style=flat-square
[circleci-url]: https://circleci.com/gh/monkvision/monk-sdk.js
[codecov-image]: https://img.shields.io/codecov/c/github/monkvision/monk-sdk.js/master.svg?style=flat-square
[codecov-url]: https://codecov.io/github/monkvision/monk-sdk.js?branch=master
[license-image]: https://img.shields.io/npm/l/monk-sdk-js.svg?style=flat-square
[license-url]: #license
[downloads-image]: https://img.shields.io/npm/dm/monk-sdk-js.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/monk-sdk