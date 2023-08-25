# @monkvision/common-ui-web
This package exports reusable UI components for React web application. These components are used throughout the
different MonkJs SDK and web application.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/common-ui-web
```

# Available components
## Button
### Description
A simple button component. It accepts every common HTML button props, as well as other custom props described below. It
processes the custom props and passes the extra props to the underlying HTMLButton element. This component also
forwards its ref to the button element.

### Example
```typescript jsx
import { Button } from '@monkvision/common-ui-web';

function App() {
  return (
    <Button
      className='exampleBtn'
      variant='outline'
      primaryColor='primary-xlight'
      secondaryColor='surface-s1'
      icon='robot'
      onClick={() => console.log('Hello World!')}>
      Say Hello
    </Button>
  );
}
```

### Props
| Prop                   | Type          | Description                                                                                                                                                                                                       | Required | Default Value                                                        |
|------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------------------------------------------------------------------|
| variant                | ButtonVariant | Variant describing the look of the button (outlined, fill...)                                                                                                                                                     |          | `fill`                                                               |
| size                   | ButtonSize    | Prop describing the size of the button.                                                                                                                                                                           |          | `normal`                                                             |
| primaryColor           | ColorProp     | The primary color of the button. For filled buttons, it corresponds to the background color, for other buttons, it corresponds to the text color.                                                                 |          | `primary-xlight` for outline buttons and `primary` for other buttons |
| secondaryColor         | ColorProp     | The secondary color of the button. For filled buttons, it corresponds to the text color and for outline buttons, it corresponds to the background color. This property is ignored for text and text-link buttons. |          | `text-white` for filled buttons and `surface-s1` for outline buttons |
| icon                   | IconName      | The icon to place on the left of the button text. No icon will be placed if not provided.                                                                                                                         |          |                                                                      |
| loading                | boolean       | Boolean indicating if the button is loading. When the button is loading, it is automatically disabled and its content is replaced by a spinner.                                                                   |          |                                                                      |
| preserveWidthOnLoading | boolean       | Boolean indicating if the button should keep its original width when loading.                                                                                                                                     |          | `false`                                                              |

---

## Spinner
### Description
A simple spinner component that displays a loading spinner.

### Example
```typescript jsx
import { Spinner } from '@monkvision/common-ui-web';

function App() {
  return <Spinner size={45} primaryColor='text-white' />;
}
```

### Props
| Prop         | Type      | Description                                                                                                 | Required | Default Value |
|--------------|-----------|-------------------------------------------------------------------------------------------------------------|----------|---------------|
| size         | number    | The size of the spinner (width and height, in pixels). The width of the spinner line is scaled accordingly. |          | `50`          |
| primaryColor | ColorProp | The name or hexcode of the spinner's color.                                                                 |          | `text-white`  |

---

## Icon
### Description
An Icon component that displays an icon based on a given name.

### Example
```typescript jsx
import { Spinner } from '@monkvision/common-ui-web';

function App() {
  return <Icon icon='add' primaryColor='text-white' size={30} />;
}
```

### Props
| Prop         | Type      | Description                                                | Required | Default Value |
|--------------|-----------|------------------------------------------------------------|----------|---------------|
| icon         | number    | The name of the icon to display.                           | ✔️       |               |
| size         | number    | The size (width and height, in pixels) of the icon.        |          | `50`          |
| primaryColor | ColorProp | The name or the hexcode of the color to apply to the icon. |          | `black`       |
