---
id: react-native-views
title: "🚀 react-native-views"
slug: /js/api/react-native-views
---
![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)

Install with `npm`
``` npm
npm install @monkvision/react-native-views @monkvision/corejs @monkvision/react-native --save
```

Install from `yarn`
``` yarn
yarn add @monkvision/react-native-views @monkvision/corejs @monkvision/react-native
```

## CameraView

| Released | Last update | Status |
|----------|-------------|--------|
| v1.0.0-0 | **v1.0.0-1** | _pre-released_ |

``` javascript
import { CameraView } from '@monkvision/react-native-views';
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| **analyzeAfterCapture** | `boolean` | false | Query a `prediction` directly after capturing |
| **onCloseCamera** | `function(pictures])` | _noop_ | Callback for Close button |
| **onShowAdvice** | `function(pictures])` | _noop_ | Callback for Advices button
| **onTakePicture** | `function(pictures])` | _noop_ | Callback triggered after each taken picture
| **sights** | `[Sight]` | [ ] | List of [Sight](https://monkvision.github.io/monkjs/docs/js/api/corejs/Sights) |
