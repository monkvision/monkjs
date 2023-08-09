# @monkvision/common-ui-web
This is a collection of reusable and customizable UI components for React web applications. It is designed to help developers easily build modern and responsive user interfaces.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/common-ui-web
```

# Basic Usage
Import and use the components in your project:

```typescript jsx
import { SVGElement } from '@monkvision/common-ui-web';

function App() {
  return (
    <div>
      <SVGElement ... />
      <SightOverlay ... />
    </div>
  );
}
```

# Available components
## SVGElement
### Description
A component that takes an SVG as a string and displays it programmatically, meaning each SVG tag is mapped to an element that can be programmatically altered. Web uses an XML parser and HTML tags to display the SVG.
### Example
```typescript jsx
import { SVGElement } from '@monkvision/common-ui-web';

function App() {
  return (
    <div>
      <SVGElement svg="" />
    </div>
  );
}
```
### Props
| Prop | Type | Description | Required | Default Value |
| - | - | - | - | - |
| `svg` | `string` | SVG data to render on screen |  | `""` |
