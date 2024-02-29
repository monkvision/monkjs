# @monkvision/common-ui-web
This package exports reusable UI components and hooks for React web application. These components are used throughout
the different MonkJs SDK and web application.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/common-ui-web
```

# Available components
## BackdropDialog
### Description
This component can be used to display a fixed dialog on the screen, with a backdrop behind it. You can either pass a
custom component for the dialog modal, or use the default one and simply pass the text content of the dialog.

### Example
```tsx
import { BackdropDialog } from '@monkvision/common-ui-web';

function App() {
  const [showDialog, setShowDialog] = useState(false);

  const onConfirm = () => {
    console.log('Confirmed.');
    setShowDialog(false);
  }

  return (
    <BackdropDialog
      show={showDialog}
      message='This is a test dialog.'
      confirmLabel='OK'
      cancelLabel='Close'
      onConfirm={onConfirm}
      onCancel={() => setShowDialog(false)}
    />
  );
}
```

### Props
| Prop            | Type         | Description                                                                                                                                     | Required | Default Value |
|-----------------|--------------|-------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| show            | boolean      | Boolean indicating if the backdrop dialog is displayed on the screen.                                                                           |          | `false`       |
| backdropOpacity | number       | Number between 0 and 1 indicating the opacity of the backdrop behind the dialog.                                                                |          | `0.7`         |
| message         | string       | Text content of the dialog.                                                                                                                     |          | `''`          |
| confirmLabel    | string       | Text label of the confirm button.                                                                                                               |          | `''`          |
| cancelLabel     | string       | Text label of the cancel button.                                                                                                                |          | `''`          |
| confirmIcon     | IconName     | Icon of the confirm button.                                                                                                                     |          |               |
| cancelIcon      | IconName     | Icon of the cancel button.                                                                                                                      |          |               |
| onConfirm       | `() => void` | Callback called when the user pressed the confirm button.                                                                                       |          |               |
| onCancel        | `() => void` | Callback called when the user pressed the cancel button.                                                                                        |          |               |
| dialog          | ReactElement | Dialog element to display instead of the default dialog. If this prop is used, the other props such as labels, icons and callbacks are ignored. |          |               |

---

## Button
### Description
A simple button component. It accepts every common HTML button props, as well as other custom props described below. It
processes the custom props and passes the extra props to the underlying HTMLButton element. This component also
forwards its ref to the button element.

### Example
```tsx
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
| Prop                   | Type          | Description                                                                                                                                                                                                       | Required | Default Value                                                            |
|------------------------|---------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------|
| variant                | ButtonVariant | Variant describing the look of the button (outlined, fill...)                                                                                                                                                     |          | `'fill'`                                                                 |
| size                   | ButtonSize    | Prop describing the size of the button.                                                                                                                                                                           |          | `'normal'`                                                               |
| primaryColor           | ColorProp     | The primary color of the button. For filled buttons, it corresponds to the background color, for other buttons, it corresponds to the text color.                                                                 |          | `'primary-xlight'` for outline buttons and `'primary'` for other buttons |
| secondaryColor         | ColorProp     | The secondary color of the button. For filled buttons, it corresponds to the text color and for outline buttons, it corresponds to the background color. This property is ignored for text and text-link buttons. |          | `'text-white'` for filled buttons and `'surface-s1'` for outline buttons |
| icon                   | IconName      | The icon to place on the left of the button text. No icon will be placed if not provided.                                                                                                                         |          |                                                                          |
| loading                | boolean       | Boolean indicating if the button is loading. When the button is loading, it is automatically disabled and its content is replaced by a spinner.                                                                   |          |                                                                          |
| preserveWidthOnLoading | boolean       | Boolean indicating if the button should keep its original width when loading.                                                                                                                                     |          | `false`                                                                  |

---

## DynamicSVG
### Description
A component that lets you display an SVG image based on an XML string, and then apply dynamic style and event handlers
to the SVG elements inside it.

### Example
```tsx
import React, { useCallback } from 'react';
import { DynamicSVG } from '@monkvision/common-ui-web';

const svg = '<svg height="100" width="100"><circle id="circle1" cx="20" cy="20" r="30"/><circle id="circle2" cx="80" cy="80" r="30"/></svg>';

// Applies a red fill and an onClick handler on the element with ID "circle1"
function App() {
  const getAttributes = useCallback((element: Element) => {
    if (element.getAttribute('id') === 'circle1') {
      return {
        style: { fill: 'red' },
        onClick: () => console.log('hello'),
        pointerEvents: 'all',
      };
    }
    return null;
  }, []);

  return <DynamicSVG svg={svg} width={300} getAttributes={getAttributes} />
}
```

### Props
| Prop          | Type                                                                                       | Description                                                                                                                                                                         | Required | Default Value |
|---------------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| svg           | string                                                                                     | The XML string representing the SVG to display                                                                                                                                      | ✔️       |               |
| getAttributes | <code>(element: Element, groupIds: string[]) => SVGProps<SVGSVGElement> &#124; null</code> | A customization function that lets you specify custom HTML attributes to give to the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of. |          |               |
| getInnerText  | <code>(element: Element, groupIds: string[]) => string                  &#124; null</code> | A customization function that lets you specify the innner text of the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of.                |          |               |

---

## FullscreenModal
### Description
Component used to display a full screen modal on top of the screen. The content of the modal must be passed as children
to this component.

### Example

```tsx
import { FullscreenModal } from '@monkvision/common-ui-web';

function App() {
  const [showFullscreenModal, setShowFullscreenModal] = useState(true);

  return (
    <FullscreenModal
      show={showFullscreenModal}
      title='Hello World!'
      onClose={() => setShowFullscreenModal(false)}
    >
      <div>
        This is the content of the modal!
      </div>
    </FullscreenModal>
  );
}
```

### Props
| Prop         | Type         | Description                                                                                   | Required | Default Value |
|--------------|--------------|-----------------------------------------------------------------------------------------------|----------|---------------|
| show         | boolean      | Boolean indicating if the fullscreen modal is displayed on the screen.                        |          | `false`       |
| title        | string       | Title displayed in the header at the top of the modal.                                        |          | `''`          |
| onClose      | `() => void` | Callback called when the user presses the close button in the header at the top of the modal. |          |               |

---

## Icon
### Description
An Icon component that displays an icon based on a given name. The list of icons is available in the official Monk SDK
documentation.

### Example
```tsx
import { Icon } from '@monkvision/common-ui-web';

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

---

## SightOverlay
### Description
A component that displays the SVG overlay of the given sight. The SVG element can be customized the exact same way as
the `DynamicSVG` component described in the section above.

### Example
```tsx
import React, { useCallback } from 'react';
import { getSightById } from '@monkvision/sights';
import { SightOverlay } from '@monkvision/common-ui-web';

function App() {
  return (
    <SightOverlay
      sight={getSightById('audia7-5CFsFvj7')}
      width={300}
      getAttributes={() => ({ strokeWidth: 2 })}
    />
  );
}
```

### Props
| Prop          | Type                                                                                       | Description                                                                                                                                                                         | Required | Default Value |
|---------------|--------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| sight         | Sight                                                                                      | The sight to display the SVG overlay of.                                                                                                                                            | ✔️       |               |
| getAttributes | <code>(element: Element, groupIds: string[]) => SVGProps<SVGSVGElement> &#124; null</code> | A customization function that lets you specify custom HTML attributes to give to the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of. |          |               |
| getInnerText  | <code>(element: Element, groupIds: string[]) => string                  &#124; null</code> | A customization function that lets you specify the innner text of the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of.                |          |               |

---

## Spinner
### Description
A simple spinner component that displays a loading spinner.

### Example
```tsx
import { Spinner } from '@monkvision/common-ui-web';

function App() {
  return <Spinner size={45} primaryColor='text-white' />;
}
```

### Props
| Prop         | Type      | Description                                                                                                 | Required | Default Value  |
|--------------|-----------|-------------------------------------------------------------------------------------------------------------|----------|----------------|
| size         | number    | The size of the spinner (width and height, in pixels). The width of the spinner line is scaled accordingly. |          | `50`           |
| primaryColor | ColorProp | The name or hexcode of the spinner's color.                                                                 |          | `'text-white'` |

---

## SwitchButton
### Description
Switch button component that can be used to turn ON or OFF a feature.

### Example
```tsx
import { SwitchButton } from '@monkvision/common-ui-web';

function App() {
  const [checked, setChecked] = useState(false);
  return (
    <div>
      <SwitchButton checked={checked} onSwitch={(value) => setChecked(value)} />
    </div>
  );
}
```

### Props
| Prop                    | Type                       | Description                                                                                                                                                                         | Required | Default Value     |
|-------------------------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|-------------------|
| size                    | `'normal' &#124; 'small'`  | The size of the button. Normal buttons are bigger and have their icon and labels inside the button. Small buttons are smaller, accept no label and have their icon inside the knob. |          | `'normal'`        |
| checked                 | boolean                    | Boolean used to control the SwitchButton. Set to `true` to make the Button switched on and `false` for off.                                                                         |          | `false`           |
| onSwitch                | `(value: boolean) => void` | Callback called when the SwitchButton is switched. The value passed as the first parameter is the result `checked` value.                                                           |          |                   |
| disabled                | boolean                    | Boolean indicating if the button is disabled or not.                                                                                                                                |          | `false`           |
| checkedPrimaryColor     | ColorProp                  | Primary color (background and knob overlay color) of the button when it is checked.                                                                                                 |          | `'primary'`       |
| checkedSecondaryColor   | ColorProp                  | Secondary color (knob, labels and icons color) of the button when it is checked.                                                                                                    |          | `'text-white'`    |
| uncheckedPrimaryColor   | ColorProp                  | Primary color (background and knob overlay color) of the button when it is unchecked.                                                                                               |          | `'text-tertiary'` |
| uncheckedSecondaryColor | ColorProp                  | Secondary color (knob, labels and icons color) of the button when it is unchecked.                                                                                                  |          | `'text-white'`    |
| checkedLabel            | ColorProp                  | Custom label that can be displayed instead of the check icon when the button is checked. This prop is ignored for small buttons.                                                    |          |                   |
| uncheckedLabel          | ColorProp                  | Custom label that can be displayed when the button is unchecked. This prop is ignored for small buttons.                                                                            |          |                   |

---

## TakePictureButton
### Description
A custom button that is used as a take-picture button in camera HUDs throughout the MonkJs SDK.

### Example
```tsx
import { TakePictureButton } from '@monkvision/common-ui-web';

function App() {
  return <TakePictureButton onClick={() => console.log('Picture taken!')} />;
}
```

### Props
| Prop | Type   | Description                       | Required | Default Value |
|------|--------|-----------------------------------|----------|---------------|
| size | number | The size of the button in pixels. |          | `60`          |
