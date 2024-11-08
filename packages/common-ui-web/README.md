# @monkvision/common-ui-web
This package exports reusable UI components and hooks for React web application. These components are used throughout
the different MonkJs SDK and web application.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/common-ui-web
```

# Available components
## AuthGuard
### Description
This component can be used in your application Routers (react-router-dom v6) to protect a given route and redirect the
user to another page if they are not authorized to access this resource.

**Note : For this component to work properly, it must be the child of a `MonkApplicationStateProvider` component.**

### Example
```tsx
import { AuthGuard } from '@monkvision/common-ui-web';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path={Page.LOG_IN} element={<LoginPage />} />
          <Route
            path={Page.MY_PROTECTED_PAGE}
            element={
              <AuthGuard redirectTo={Page.LOG_IN}>
                <MyProtectedPage />
              </AuthGuard>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Props
| Prop                | Type                | Description                                                                        | Required | Default Value |
|---------------------|---------------------|------------------------------------------------------------------------------------|----------|---------------|
| redirectTo          | string              | The URL to redirect the user to if they are not authorized to access the resource. | ✔️       |               |
| requiredPermissions | MonkApiPermission[] | A list of required permissions to access the resource.                             |          |               |

---

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
| Prop                   | Type                                     | Description                                                                                                                                                                                                       | Required | Default Value                                                            |
|------------------------|------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------------------------------------------------|
| variant                | ButtonVariant                            | Variant describing the look of the button (outlined, fill...)                                                                                                                                                     |          | `'fill'`                                                                 |
| size                   | ButtonSize                               | Prop describing the size of the button.                                                                                                                                                                           |          | `'normal'`                                                               |
| primaryColor           | ColorProp                                | The primary color of the button. For filled buttons, it corresponds to the background color, for other buttons, it corresponds to the text color.                                                                 |          | `'primary-xlight'` for outline buttons and `'primary'` for other buttons |
| secondaryColor         | ColorProp                                | The secondary color of the button. For filled buttons, it corresponds to the text color and for outline buttons, it corresponds to the background color. This property is ignored for text and text-link buttons. |          | `'text-white'` for filled buttons and `'surface-s1'` for outline buttons |
| icon                   | IconName                                 | The icon to place on the left of the button text. No icon will be placed if not provided.                                                                                                                         |          |                                                                          |
| loading                | <code>boolean &#124; LoadingState</code> | This prop specifies if the Button is loading. A loading button is automatically disabled and its content is replaced by a spinner.                                                                                |          |                                                                          |
| preserveWidthOnLoading | boolean                                  | Boolean indicating if the button should keep its original width when loading.                                                                                                                                     |          | `false`                                                                  |

---

## Checkbox
### Description
Custom component implementing a simple checkbox.

### Example
```tsx
import { useState } from 'react';
import { Checkbox } from '@monkvision/common-ui-web';

function MyComponent() {
  const [checked, setchecked] = useState(false);

  return <Checkbox checked={checked} onChange={setchecked} />;
}
```

### Props
| Prop           | Type                       | Description                                                               | Required | Default Value        |
|----------------|----------------------------|---------------------------------------------------------------------------|----------|----------------------|
| checked        | boolean                    | Boolean indicating if the checkbox is checked or not.                     |          | `false`              |
| disabled       | boolean                    | Boolean indicating if the checkbox is disabed or not.                     |          | `false`              |
| onChange       | (checked: boolean) => void | Callback called when the checkbox "checked" value is changed.             |          |                      |
| primaryColor   | ColorProp                  | The background color of the checkbox when it is checked.                  |          | `'primary-base'`     |
| secondaryColor | ColorProp                  | The color of the checked icon when the checkbox is checked.               |          | `'text-primary'`     |
| tertiaryColor  | ColorProp                  | The color of the checkbox when it is not checked (background and border). |          | `'background-light'` |
| labelColor     | ColorProp                  | The color of the label.                                                   |          | `'text-primary'`     |
| label          | string                     | The label of the checkbox.                                                |          |                      |

---

## CreateInspection
### Description
This component is a ready-to-use CreateInspection page that is used throughout the different Monk webapps to handle
inspection creation.

**Note : For this component to work properly, it must be the child of a `MonkAppStateProvider` component.**

### Example
```tsx
import { CreateInspection } from '@monkvision/common-ui-web';
import { useNavigate } from 'react-router-dom';

function VehicleTypeSelectionPage() {
  const navigate = useNavigate();

  return <CreateInspection onInspectionCreated={() => navigate('/next-page')}/>;
}
```

### Props
| Prop                   | Type                                     | Description                                           | Required | Default Value |
|------------------------|------------------------------------------|-------------------------------------------------------|----------|---------------|
| onInspectionCreated    | () => void                               | Callback called when the inspection has been created. |          |               |
| lang                   | string                                   | The language used by the component.                   |          | `'en'`        |

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
| getAttributes | <code>(element: Element, groups: SVGGElement[]) => SVGProps<SVGSVGElement> &#124; null</code> | A customization function that lets you specify custom HTML attributes to give to the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of. |          |               |
| getInnerText  | <code>(element: Element, groups: SVGGElement[]) => string                  &#124; null</code> | A customization function that lets you specify the innner text of the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of.                |          |               |

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

## ImageDetailedView
### Description
This component is used to display the preview of an inspection image, as well as additional data such as its label etc.
If this component is used mid-capture, set the `captureMode` prop to `true` so that you'll enable features such as
compliance errors, retakes etc.

### Example

```tsx
import { ImageDetailedView } from '@monkvision/common-ui-web';
import { useMonkState } from '@monkvision/common';
import { useMemo } from 'react';

function ImageViewer({ id }: ImageViewerProps) {
  const { state } = useMonkState();
  const image = useMemo(() => state.images.find((i) => i.id === id), [state.images, id]);

  return <ImageDetailedView image={image} />;
}
```

### Props
| Prop                | Type                | Description                                                                                                                         | Required | Default Value |
|---------------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| image               | Image               | The image to display the details of.                                                                                                | ✔️       |               |
| captureMode         | boolean             | Boolean indicating if this component is displayed in "capture" mode.                                                                | ✔️       | `false`       |
| lang                | string              | The language to be used by the component.                                                                                           |          | `en`          |
| showGalleryButton   | boolean             | Boolean indicating if the gallery button must be displayed or not.                                                                  |          | `true`        |
| onClose             | () => void          | Callback called when the user presses the close button.                                                                             |          |               |
| onNavigateToGallery | () => void          | Callback called when the user presses the gallery button if it is displayed.                                                        |          |               |
| showCaptureButton   | boolean             | Boolean indicating if the capture button must be displayed or not. This prop can only be specified if `captureMode` is set to true. |          | `true`        |
| onNavigateToCapture | () => void          | Callback called when the user presses the capture button. This prop can only be specified if `captureMode` is set to true.          |          |               |
| onRetake            | () => void          | Callback called when the user presses the retake button. This prop can only be specified if `captureMode` is set to true.           |          |               |

---

## InspectionGallery
### Description
This component is used to display a gallery of pictures taken during an inspection. If this component is used
mid-capture, set the `captureMode` prop to `true` so that you'll enable features such as compliance errors, retakes etc.

### Example
```tsx
import { InspectionGallery } from '@monkvision/common-ui-web';

function App() {
  return <InspectionGallery icon='add' primaryColor='text-white' size={30} />;
}
```

### Props
| Prop                | Type              | Description                                                                                                                                                                                        | Required                        | Default Value |
|---------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|---------------|
| inspectionId        | string            | The ID of the inspection to display the images of.                                                                                                                                                 | ✔️                              |               |
| apiConfig           | ApiConfig         | The config used to communicate with the API.                                                                                                                                                       | ✔️                              |               |
| captureMode         | boolean           | Boolean indicating if this component is displayed in "capture" mode.                                                                                                                               | ✔️                              |               |
| lang                | string            | The language used by the InspectionGallery component.                                                                                                                                              |                                 | `en`          |
| refreshIntervalMs   | number            | The delay (in milliseconds) between each `getInspection` request made to the API when polling the status of the inspection.                                                                        |                                 | `1000`        |
| showBackButton      | boolean           | Boolean indicating if the back button of the gallery top bar should be displayed or not.                                                                                                           |                                 | `false`       |
| onBack              | () => void        | Callback called when the user presses the back button if it is displayed.                                                                                                                          |                                 |               |
| onValidate          | () => void        | Callback called when the user presses the validate button.                                                                                                                                         |                                 |               |
| sights              | Sight[]           | The list of sights to be capture in the current capture flow. This prop can only be specified if `captureMode` is set to true.                                                                     | ✔️ (if `captureMode` is `true`) |               |
| allowSkipRetake     | boolean           | Boolean indicating if the user should be allowed to skip the retaking of non-compliant pictures before validating the inspection. This prop can only be specified if `captureMode` is set to true. |                                 | `false`       |
| onNavigateToCapture | () => void        | Callback called when the user wants to navigate back to the capture component. This prop can only be specified if `captureMode` is set to true.                                                    |                                 |               |
| enableCompliance    | boolean           | Boolean indicating if compliance checks should be enabled or not. This prop can only be specified if `captureMode` is set to true.                                                                 |                                 |               |
| complianceIssues    | ComplianceIssue[] | If compliance checks are enable, this property can be used to select a list of compliance issues to check. This prop can only be specified if `captureMode` is set to true.                        |                                 |               |
| validateButtonLabel | `string`          | Custom label for validate button.                                                                                                                                                                  |                                 |               |

---

## LiveConfigAppProvider
### Description
This component is used in Monk web applications that support Live Configurations. It acts as both an automatic live
configuration fetcher and a MonkAppStateProvider.

### Example

```tsx
import React, { useCallback } from 'react';
import { LiveConfigAppProvider } from '@monkvision/common-ui-web';

function App() {
  return (
    <LiveConfigAppProvider id='my-live-config-id'>
      ...
    </LiveConfigAppProvider>
  );
}
```

### Props
This component accepts the same props as the `MonkAppStateProvider` component (except for the `config` prop which is
replaced by the live config). Please refer to the
[@monkvision/common package documentation](https://github.com/monkvision/monkjs/blob/main/packages/common/README/APP_UTILS.md)
for more details.

| Prop        | Type                            | Description                                                           | Required | Default Value |
|-------------|---------------------------------|-----------------------------------------------------------------------|----------|---------------|
| id          | string                          | The ID of the application Live Config.                                | ✔️       |               |
| localConfig | CaptureAppConfig                | Use this prop to configure a configuration on your local environment. |          |               |
| lang        | <code>string &#124; null</code> | The language used by this component.                                  |          | `en`          |

---

## LoginPage
### Description
This component is a ready-to-use CreateInspection page that is used throughout the different Monk webapps to handle
authentication.

### Example

```tsx
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSightById } from '@monkvision/sights';
import { CreateInspection } from '@monkvision/common-ui-web';

function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  return (
    <CreateInspection lang={i18n.language} onLoginSuccessful={() => navigate('/home')} />
  );
}
```

### Props
| Prop                | Type                            | Description                                                                                                                                    | Required | Default Value |
|---------------------|---------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| allowManualLogin    | boolean                         | Boolean indicating if manual login by the user should be allowed. If this prop is set to `false`, we never display a login button to the user. |          | `true`        |
| onLoginSuccessful   | () => void                      | Callback called when the user successfully logs in.                                                                                            |          |               |
| lang                | <code>string &#124; null</code> | The language used by this component.                                                                                                           |          | `en`          |
| requiredPermissions | MonkApiPermission[]             | A list of required permissions to access the application.                                                                                      |          |               |
| style               | CSSProperties                   | Custom styles applied to the main container of the page.                                                                                       |          |               |

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
| getAttributes | <code>(element: Element, groups: SVGGElement[]) => SVGProps<SVGSVGElement> &#124; null</code> | A customization function that lets you specify custom HTML attributes to give to the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of. |          |               |
| getInnerText  | <code>(element: Element, groups: SVGGElement[]) => string                  &#124; null</code> | A customization function that lets you specify the innner text of the tags in the SVG file based on the HTML element itself and the IDs of the groups it is part of.                |          |               |

---

## Slider
### Description
Slider component that can be used to select a value within a specified range by dragging along a horizontal track.

### Examples

```tsx
import { useState } from 'react';
import { Slider } from '@monkvision/common-ui-web';

function App() {
  const [value, setValue] = useState(0);
  const handleChange = (newValue: number) => {setValue(newValue)}

  return <Slider value={value} min={0} max={1000} step={20} onChange={handleChange}/>;
}
```
### Props
| Prop           | Type                      | Description                                                                                                  | Required | Default Value        |
|----------------|---------------------------|--------------------------------------------------------------------------------------------------------------|----------|----------------------|
| min            | number                    | The minimum value of the slider.                                                                             |          | `0`                  |
| max            | number                    | The maximum value of the slider.                                                                             |          | `100`                |
| value          | number                    | The current value of the slider.                                                                             |          | `(max - min) / 2`    |
| primaryColor   | ColorProp                 | The name or hexcode used for the thumb/knob border.                                                          |          | `'primary'`          |
| secondaryColor | ColorProp                 | The name or hexcode used for the progress bar.                                                               |          | `'primary'`          |
| tertiaryColor  | ColorProp                 | The name or hexcode used for the track bar background.                                                       |          | `'secondary-xlight'` |
| disabled       | boolean                   | Boolean indicating if the slider is disabled or not.                                                         |          | `false`              |
| step           | number                    | The increment value of the slider.                                                                           |          | `1`                  |
| onChange       | `(value: number) => void` | Callback function invoked when the slider value changes.                                                     |          |                      |
| style          | CSSProperties             | This property allows custom CSS styles for the slider. `width` sets slider width but `height` has no effect. |          |                      |

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

---

## TextField
### Description
Custom component implementing a simple one-liner text field.

### Example

```tsx
import { useState } from 'react';
import { TextField } from '@monkvision/common-ui-web';

function App() {
  const [value, setValue] = useState('');

  return <TextField value={value} onChange={setValue} />;
}
```

### Props
| Prop            | Type                                                              | Description                                                                                           | Required | Default Value        |
|-----------------|-------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------|----------|----------------------|
| type            | <code>'email' &#124; 'password' &#124; 'tel' &#124; 'text'</code> | The type of the underlying HTMLInput element.                                                         |          | `'text'`             |
| value           | string                                                            | The value of the text field.                                                                          |          | `''`                 |
| onChange        | (newValue: string) => void                                        | Callback called when the value of the text field changes.                                             |          |                      |
| onBlur          | () => void                                                        | Callback called when the text field is blurred.                                                       |          |                      |
| disabled        | boolean                                                           | Boolean indicating if the text field is disabled or not.                                              |          | `false`              |
| highlighted     | boolean                                                           | Boolean indicating if the input should be highlighted (ex: in case of errors).                        |          | `false`              |
| monospace       | boolean                                                           | Boolean indicating if the font family of the input should be monospace.                               |          | `false`              |
| label           | string                                                            | The label of the text field.                                                                          |          | `''`                 |
| placeholder     | string                                                            | The placeholder of the input.                                                                         |          | `''`                 |
| unit            | string                                                            | The unit symbol of the text field.                                                                    |          |                      |
| unitPosition    | <code>'left' &#124; 'right'</code>                                | The position of the unit symbol.                                                                      |          | `'left'`             |
| icon            | IconName                                                          | The name of the icon on the left of the text field.                                                   |          |                      |
| showClearButton | boolean                                                           | Boolean indicating if the button allowing the user to clear the field should be displayed or not.     |          | `true`               |
| assistiveText   | string                                                            | Assistive text label under the text field.                                                            |          |                      |
| fixedWidth      | number                                                            | Fixed width for the text field. If not set, the text field expands to the max width of its container. |          |                      |
| focusColor      | ColorProp                                                         | The accent color of the text field when focused.                                                      |          | `'primary-base'`     |
| neutralColor    | ColorProp                                                         | The accent color of the text field when not focused.                                                  |          | `'text-primary'`     |
| backgroundColor | ColorProp                                                         | The background color of the text field.                                                               |          | `'background-light'` |
| id              | string                                                            | The ID passed down to the input element.                                                              |          |                      |
| style           | CSSProperties                                                     | Additional styles passed to the main container of the input.                                          |          |                      |

---

## VehicleTypeAsset
### Description
This component displays an example image for the given vehicle type.

### Example
```tsx
import { VehicleType } from '@monkvision/types';
import { VehicleTypeAsset } from '@monkvision/common-ui-web';

function App() {
  return <VehicleTypeAsset vehicleType={VehicleType.CUV} />;
}
```

### Props
| Prop        | Type        | Description                               | Required | Default Value |
|-------------|-------------|-------------------------------------------|----------|---------------|
| vehicleType | VehicleType | The vehicle type to display the image of. | ✔️       |               |

---

## VehicleTypeSelection
### Description
A single page component that allows the user to select a vehicle type.

### Example

```tsx
import { VehicleType } from '@monkvision/types';
import { VehicleTypeSelection } from '@monkvision/common-ui-web';
import { useNavigate } from 'react-router-dom';

function VehicleSelectionPage() {
  const navigate = useNavigate();

  return (
    <VehicleTypeSelection
      onSelectVehicleType={(vehicleType) => navigate('/next-page', { state: { vehicleType } })}
    />
  );
}
```

### Props
| Prop                  | Type                        | Description                                                                                                              | Required | Default Value                                        |
|-----------------------|-----------------------------|--------------------------------------------------------------------------------------------------------------------------|----------|------------------------------------------------------|
| selectedVehicleType   | VehicleType                 | The initially selected vehicle type.                                                                                     |          | The center-most vehicle type in the list.            |
| availableVehicleTypes | VehicleType[]               | A list of available vehicle type to choose from. The order of the list will be modified to always follow the same order. |          | `[SUV, CUV, SEDAN, HATCHBACK, VAN, MINIVAN, PICKUP]` |
| onSelectVehicleType   | (type: VehicleType) => void | Callback called when the user has selected a vehicle type.                                                               |          | The center-most vehicle type in the list.            |
| lang                  | string                      | The language to use by the component.                                                                                    |          | `en`                                                 |
| inspectionId          | string                      | The ID of the inspection.                                                                                                |          |                                                      |
| apiDomain             | string                      | The domain of the Monk API.                                                                                              |          |                                                      |
| authToken             | string                      | The authentication token used to communicate with the API.                                                               |          |                                                      |
## VehiclePartSelection
I shows the collections of VehicleDynamicWireframe and we can switch between 4 different views front left, front right, rear left and rear right.
### Example
```tsx
function Component() {
  return <VehiclePartSelection
    vehicleModel={VehicleModel.FESC20}
    onPartsSelected={(p) => console.log(p)} />
}
```
### Props
| Prop            | Type                           | Description                                                                             | Required| Default Value|
|-----------------|--------------------------------|-----------------------------------------------------------------------------------------|---------|--------------|
| vehicleModel    | VehicleModel                   | Initial vehicle model.                                                                  | ✔️       |              |
| orientation     | PartSelectionOrientation       | Orientation where the vehicle want to face.                                             |         | front-left   |
| onPartsSelected | (parts: VehiclePart[]) => void | Callback called when update selected parts.                                             |         |              |

## VehicleDynamicWireframe
For the given Vehicle Model and orientation. It shows the wireframe on the view and we can able to select it.
### Example
```tsx
import { PartSelectionOrientation, VehicleModel, VehiclePart } from '@monkvision/types';

function Component() {
  const [parts, setParts] = useState<Array<VehiclePart>>([]);
  const onPartSelected = (parts) => {
    console.log(parts);
    setParts(parts);
  }
  return <VehicleDynamicWireframe
    vehicleModel={VehicleModel.FESC20}
    orientation={PartSelectionOrientation.FRONT_LEFT}
    parts={selectedParts}
    onPartsSelected={onPartSelected}
  />
}
```
vehicleModel
orientation
onClickPart
getPartAttributes

### Props
| Prop              | Type                            | Description                                                                             | Required| Default Value|
|-------------------|---------------------------------|-----------------------------------------------------------------------------------------|---------|--------------|
| vehicleModel      | VehicleModel                    | Initial vehicle model.                                                                  | ✔️       |              |
| orientation       | PartSelectionOrientation        | Orientation where the vehicle want to face.                                             |         | front-left   |
| parts             | VehiclePart[]                   | Initial selected parts. Mainly used to persist selected parts state between rerendering.|         | []           |
| onClickPart       | (part: VehiclePart) => void     | Callback called when a part is clicked.                                                 |         |              |
| getPartAttributes | (part: VehiclePart) => SVGProps | Custom function for HTML attributes to give to the tags based on part.                  |         |              |

