# 👁️‍🗨️ @monkvision/corejs
[![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)](https://www.npmjs.com/package/@monkvision/corejs)

AI-powered vehicle damage detection for JavaScript.
Check out the full [documentation](https://monkvision.github.io/monk/docs).

``` yarn
npm install @monkvision/corejs @reduxjs/toolkit --save
yarn add @monkvision/corejs @reduxjs/toolkit
```

### Usage
``` javascript
import MonkCore from '@monkvision/corejs';

const monkCore = new MonkCore({ baseUrl, customHeaders});
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

### NPM module content
``` xpath2
├── @monkvision
  ├── ...
  ├── corejs
    ├── lib
    ├── src
        ├── services
          └── inspection.js
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
