# Theming
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the
theme customization. You can refer to [this page](README.md). for more general information on the package.

This package exports tools that help you customize the look and feel of MonkJs applications.

# MonkThemeProvider component
This package exports a component called `MonkThemeProvider` which is a context provider that will let you specify the
theme you want to apply to the Monk SDK. In order for this to work, you need to place this component above any Monk SDK
component :

```tsx
import { MonkThemeProvider } from '@monkvision/common';
import { InspectionCapture } from '@monkvision/inspection-capture-web';

function AppComponent() {
  return (
    <MonkThemeProvider palette={...}>
      <InspectionCapture />
    </MonkThemeProvider>
  )
}
```

This component accepts the following props :

| Prop    | Type                 | Description                         | Required | Default Value        |
|---------|----------------------|-------------------------------------|----------|----------------------|
| palette | Partial<MonkPalette> | The colors to used by the Monk SDK. |          | `MonkDefaultPalette` |

# useMonkTheme hook
Inside a `MonkThemeProvider` child component, you can use the `useMonkTheme` hook to access the current Monk theme. If
this hook is called while the `MonkThemeProvider` has not been defined, the default Monk theme will be returned. This
hook will return the following values :

- A `palette` object containing the current color palette
- A `utils` object containing various utility functions

```tsx
import { useMonkTheme } from '@monkvision/common';

function MyComponent() {
  const { palette, utils } = useMonkTheme();
}
```

# Utility functions
The `utils` property of the Monk theme contains the following utility functions :

## getColor
```typescript
const { utils } = useMonkTheme();
const colorValue = utils.getColor(colorProp);
```

This function takes a `ColorProp` as an argument and returns the corresponding color value based on the current theme.
`ColorProp` corresponds to the type of the props that you can give to Monk UI components in order to specify a color to
them. It can either be directly a CSS color value (hexcode, rgba function as a string, etc.), or the name of the color
in the palette (for instance `primary-dark`).

The `getColor` function will check if the given argument is a color name, and if it is, it will return its correponding
value in the curerntly used color palette. If the argument given is not a color name, it will be considered as a CSS
color property and will be return as is.

# Available Theme Customization
## Color Palette
You can use the `palette` prop in the MonkThemeProvider to customize the colors of the Monk SDK. The list of available
colors is defined in the `MonkPalette` interface of the `@monkvision/types` package. The palette given to the provider
can be a partial palette, where not all colors are implemented. In this case, every missing color will be filled with
the color present in the default Monk palette.
