# 👁️‍🗨️ @monkvision/corejs
[![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)](https://www.npmjs.com/package/@monkvision/corejs)

AI-powered vehicle damage detection for JavaScript.
Check out the full [documentation](https://monkvision.github.io/monk/docs).

``` yarn
npm install @monkvision/corejs
yarn add @monkvision/corejs
```

### Usage
``` ecmascript 6
import { createRoot, Inspection } from '@monkvision/corejs';

const monk = createRoot(DOMAIN, CLIENT_ID);

// Authentication process...
monk.bearerToken = bearerToken;

async function submit(values) {
  try {
    const inspection = new Inspection(values);
    const response = await monk.postInspection(inspection);
    // ...
  } catch (error) {
    // ...
  }
}

const inspections = await monk.getInspectionsAsync();
```

### NPM module content
``` xpath2
├── @monkvision
  ├── ...
  ├── corejs
    ├── lib
    ├── src
        ├── Inspection
        ├── Root
        ├── helpers.js
        └── index.js
    ├── .babelrc.json
    ├── .editorconfig
    ├── LICENSE
    ├── package.json
    └── README.md
```

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.

----
![Monk banner](https://raw.githubusercontent.com/monkvision/monkjs/master/assets/banner.webp)
