# 👁️‍🗨️ @monk/corejs
[![npm latest package](https://img.shields.io/npm/v/@monk/corejs/latest.svg)](https://www.npmjs.com/package/@monk/corejs)

AI-powered vehicle damage detection for JavaScript.
Check out the full [documentation](https://monkvision.github.io/monk/docs).

```sh
npm install @monk/corejs
yarn add @monk/corejs
```

### Usage
``` ecmascript 6
import { createRoot, Inspection } from '@monk/corejs';

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
```
├── @monk/corejs
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
![Monk banner](https://raw.githubusercontent.com/monkvision/monk/master/assets/banner.webp)
