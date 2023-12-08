# Internationalization
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
internationalization. You can refer to [this page](README.md). for more general information on the package.

This package exports utility functions and hooks tools that help you manage the internationalization support of the Monk
SDK.

# react-i18next
The internationalization in the Monk SDK (and in Monk Webapps) is handled using [i18n](https://www.i18next.com/) and
[react-i18next](https://react.i18next.com/). This means that installing some of our packages (like
`@monkvision/inspection-report-web` for instance) will mean automatically adding these packages as dependencies in your
lockfile.

We tend to stay as minimal-dependency as we can when developing our SDK, but we felt like i18n and react-i18next were
packages common enough that it was not worth going through implementing an abstraction package like we did for
@monkvision/sentry.

Keep in mind : if you do not want internationalization support in your application, you can still use our SDK and
specify to it which language you want it to use. The following languages are supported by the Monk SDK :

- English (default)
- French
- German

# i18n Utilities
## i18nLinkSDKInstances function
### Description
This function is used to synchronize your i18n instance with the ones used and provided by the Monk SDK packages. This
will allow Monk SDK packages to use the same language as your app and change their language everytime your app changes
its language.

**IMPORTANT NOTE : It is highly recommended to also use the `useI18nLink` hook (described below) in pair with this
function for optimal results.**

This function takes two parameters :
- The i18n instance of your application
- An array of i18n instances used by the Monk SDK packages used in your app

### Example of usage
```typescript
import i18n from 'i18next';
import { i18nInspectionCapture } from '@monkvision/inspection-capture-web';
import { i18nInspectionReport } from '@monkvision/inspection-report-web';

i18n.use(initReactI18next).init(...);

// Use the function right after initializing your i18n instance.
i18nLinkSDKInstances(i18n, [i18nInspectionCapture, i18nInspectionReport]);
export default i18n;
```

## useI18nLink hook
### Description
This hook is used to synchronize your i18n instance with the ones used and provided by the Monk SDK packages. This
will allow Monk SDK packages to use the same language as your app and change their language everytime your app changes
its language.

**IMPORTANT NOTE : It is highly recommended to also use the `i18nLinkSDKInstances` hook (described above) in pair with
this hook for optimal results.**

This hook takes two parameters :
- The i18n instance of your application, obtained using the `useTranslation` hook.
- An array of i18n instances used by the Monk SDK packages used in your app

### Example of usage
```tsx
import React from 'react';
import { useI18nLink } from '@monkvision/common';
import { i18nInspectionCapture } from '@monkvision/inspection-capture-web';
import { i18nInspectionReport } from '@monkvision/inspection-report-web';
import { useTranslation } from 'react-i18next';

export function App() {
  const { i18n } = useTranslation();

  // Use the hook in your App component
  useI18nLink(i18n, [i18nInspectionCapture, i18nInspectionReport]);
  ...
}
```
