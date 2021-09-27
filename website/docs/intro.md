---
id: intro
title: Introduction
slug: /
---

Monk's SDK is divided in three parts:
1. A **core** module providing a redux kit to get and manipulate data
2. A **components** module exporting basic native features
3. A **views** module using core and components together

Each module can be used alone without the others.

## Javascript example
|  Module Name  |   Version     |    Install    |
| ------------- | ------------- | ------------- |
| [@monkvision/corejs](packages/corejs/README.md)  | [![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)](https://www.npmjs.com/package/@monkvision/corejs)  | `yarn add @monkvision/corejs` |
| [@monkvision/react-native](packages/react-native/README.md)  | [![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native/latest.svg)](https://www.npmjs.com/package/@monkvision/react-native)  | `yarn add @monkvision/react-native` |
| [@monkvision/react-native-views](packages/react-native-views/README.md)  | [![npm latest package](https://img.shields.io/npm/v/@monkvision/react-native-views/latest.svg)](https://www.npmjs.com/package/@monkvision/react-native-views)  | `yarn add @monkvision/react-native-views` |

Instantiate MonkCore with your own `MONK_DOMAIN` environment variable.
``` javascript
/* config/monkCore.js */

import MonkCore from '@monkvision/corejs/src';
import Constants from 'expo-constants';

const monkCore = new MonkCore({
  baseUrl: `https://${Constants.manifest.extra.MONK_DOMAIN}/`,
});

export default monkCore;

```

Your various APIs to handle your data.
``` javascript
import monkCore from 'config/monkCore';
import Inspection from '@monkvision/react-native/src/Inspection';

const { useGetInspectionsQuery } = monkCore.inspection;

function App() {
  const { data, isLoading } = useGetInspectionsQuery();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!data || data.length === 0) {
    return <>Empty</>;
  }

  return data.map((props) => <Inspection {...props) />;
}
```

---

There is only one stack supported for now: `JavaScript + React Native`, but we are working to provide more.

