# Internationalization

This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
internationalization. You can refer to [this page](README.md) for more general information on the package.

This package exports utility functions and hooks tools that help you manage the internationalization support of the Monk
SDK, as well as common translations that can be useful when interacting with the SDK.

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
- Dutch

# i18n Utilities

## i18nWrap wrapper

### Description

This wrapped is used by internal monk SDK to wrap the component with I18nextProvider.

### Example of usage

```tsx
import i18n from '@monkvision/common';
import { i18nMyComponent } from './i18n';

const MyComponent = i18nWrap(function MyComponent(){
  return <></>
}, i18nMyComponent)
/// in i18n.ts
import { i18nCreateSDKInstance } from '@monkvision/common';
import en from './translations/en.json';
import da from './translations/da.json';
import sv from './translations/sv.json';
import es from './translations/es.json';
import pt from './translations/pt.json';
import fr from './translations/fr.json';
import de from './translations/de.json';
import nl from './translations/nl.json';
import it from './translations/it.json';

const i18nMyComponent = i18nCreateSDKInstance({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    de: { translation: de },
    nl: { translation: nl },
    it: { translation: it },
    pt: { translation: pt },
    es: { translation: es },
    sv: { translation: sv },
    da: { translation: da },
  }
})
```

## useI18nSync hook

### Description

This hook is used mostly by MonkJs packages internally to synchronize their own i18n instance with the language param
or prop that they are provided.

### Example of usage

```ts
import i18n from 'i18next';
import { useI18nSync } from '@monkvision/common';

interface MyComponentProps {
  lang?: string | null;
}

function MyComponent(props: MyComponentProps) {
  useI18nSync(props.lang);
  ...
}
```

## getLanguage

```ts
import i18n from 'i18next';
import { getLanguage } from '@monkvision/common';

console.log(getLanguage(i18n.language));
```

This function retrieves the language prefix from a given language string.
If the prefix is not found in the list of supported languages (monkLanguages in Types package), it returns 'en' as default.

# Common Translations

## Car Parts

You can import the car parts translations like this :

```typescript
import { cartPartLabels } from '@monkvision/common';
```

The `cartPartLabels` object maps each `VehiclePart` name (enum from `@monkvision/types`) to a `TranslationObject`
containing a label for each supported language.

## Image Status Labels

You can import the image status labels translations like this :

```typescript
import { imageStatusLabels } from '@monkvision/common';
```

The `imageStatusLabels` object maps each `ImageStatus` (enum from `@monkvision/types`) to an object containing a `title`
and a `description` property, both of which are TranslationObject`s containing a label for each supported language.

## Compliance Issue Labels

You can import the compliance issue labels translations like this :

```typescript
import { complianceIssueLabels } from '@monkvision/common';
```

The `complianceIssueLabels` object maps each `ComplianceIssue` (enum from `@monkvision/types`) to an object containing a
`title` and a `description` property, both of which are TranslationObject`s containing a label for each supporte
language.
