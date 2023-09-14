# @monkvision/camera-web
This package provides tools used to handle the Camera in MonkJs web projects in React. It exports a component called
Camera, that lets you display a camera preview on your app as well as an HUD on top of it, and provides methods
to take pictures, compress images, etc.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/camera-web
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# Camera component
## Camera Preview
The main component exported by this package is called `Camera`. When placed in a screen this component displays a
preview of the user's camera video stream. This component is a smart React wrapper for core JavaScript API
functionnalities that let you access the user camera :
- Automatic handling of Camera permissions : if you place this component in your app, the user will automatically be
  asked permission for camera access
- Error handling and retry-on-error utilities
- React memoization of elements
- Render optimizations

```typescript jsx
// This super simple bit of code will let you display a camera preview in your app.
import { Camera } from '@monkvision/camera-web';

function MyCameraPreview() {
  return <Camera />;
}
```

## Camera constraints
The video stream of the camera that is fetched from the user's device is configurable in the following ways :
- Resolution quality of the camera
- Camera facing mode (front camera / rear camera on smartphones)
- Device ID to choose a specific camera

These values can be configured using props on the camera component in the following ways :

```typescript jsx
import { Camera, CameraFacingMode, CameraResolution } from '@monkvision/camera-web';

function MyCameraPreview() {
  return (
    <Camera
      facingMode={CameraFacingMode.USER}
      resolution={CameraResolution.HD_720P}
      deviceId='my-specific-device-id'
    />
  );
}
```

For more details on the camera constraints options, see the *API* section below.

Notes :
- When the camera constraints are updated, the video stream is automatically updated without asking the user for
  permissions another time
- Only the resolutions available in the `CameraResolution` enum are allowed for better results with our AI models
- The resolutions available in the `CameraResolution` enum are all in the 16:9 format
- If the `deviceId` prop is specificied, the `facingMode` will be ignored
- If no device meets the given requirements, the device with the closest match will be used :
  - If the needed resolution is too high, the highest resolution will be used : this means that asking for the
    `CameraResolution.UHD_4K` resolution is a good way to get the highest resolution possible
  - If the needed resolution is too low the browser will crop and scale the camera's feed to meet the requirements

## Compression options
When pictures are taken by the camera, they are compressed and encoded. The compression format and quality can be
configured using props on the camera component in the following ways :

```typescript jsx
import { Camera, CameraFacingMode, CameraResolution } from '@monkvision/camera-web';

function MyCameraPreview() {
  return <Camera format={CompressionFormat.JPEG} quality={0.4} />;
}
```

For more details on the compression options, see the *API* section below.

## Camera HUD
In order to control the Camera (take pictures etc.), an HUD component can be passed as a prop to the Camera component.
An HUD component is a component that takes a camera handle as a prop (an object used to control the camera) and that
displays head-up display on top of the camera preview. When a HUD component is passed to the Camera component, the
Camera will place it on top of its preview, and will pass him down the camera handle.

It is definitely possible to write your own custom Camera HUD component, but if you just need a very basic Camera HUD,
this package exports one already : the `SimpleCameraHUD` component. It will display a button to take the pictures, error
messages with proper labels in case there are errors when fetching the camera video stream, and a retry button to try
to fetch the camera stream again if there was an error.

To use this HUD, simply pass the component to the `HUDComponent` prop of the Camera component :

```typescript jsx
import { Camera, SimpleCameraHUD } from '@monkvision/camera-web';

function MyCameraPreviewWithHUD() {
  return <Camera HUDComponent={SimpleCameraHUD} />;
}
```

The text displayed by this component (error messages, retry button label...) is by default in english. If you want to
customize the display language, you have two options :
- Use the `i18next` and `react-i18next` packages to set up internationalization support in your app, and then linking
  your `i18n` instance with the one used by the Camera package. To do so, we highly recommend using the `i18n` utility
  tools provided by the `@monkvision/common` package. More information on this
  [here](https://github.com/monkvision/monkjs/blob/main/packages/common/README/INTERNATIONALIZATION.md).
- Simply specify the fixed language you want to use by using the `language` prop of the component like this :

```typescript jsx
import { Camera, SimpleCameraHUD } from '@monkvision/camera-web';

function MyCameraPreviewWithGermanHUD() {
  return (
    <Camera
      HUDComponent={(props) => <SimpleCameraHUD {...props} language='de' />}
    />
  );
}
```

The currently supported languages are :
- English : `'en'` (default)
- French : `'fr'`
- German : `'de'`

## Creating a Custom HUD
In order to implement custom Camera HUD, you simply need to create a component that will take a camera handle as a
prop :

```typescript jsx
import { Camera, CameraHUDProps } from '@monkvision/camera-web';

function MyCustomCameraHUD({ handle }: CameraHUDProps) {
  return <button onClick={handle?.takePicture}>Take Picture</button>;
}

function MyCameraPreviewWithCustomHUD() {
  return <Camera HUDComponent={MyCustomCameraHUD} />;
}
```

The complete specification of the camera handle is available in the *API* section below.

## Camera Events
In order to add side effects when some things happen in the Camera, you can specify event handlers callbacks in the
Camera component props. For now the events available are :

- `onPictureTaken: (picture: MonkPicture) => void` : Callback called when the user takes a picture

# API
## Camera component
### Description
Main component exported by this package, displays a Camera preview and the given HUD on top of it.

### Props
| Prop           | Type                           | Description                                                                                                                     | Required | Default Value                  |
|----------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------|
| facingMode     | CameraFacingMode               | Facing mode (front camera or back camera) to specify which camera to use. Ignored if `deviceId` is specified                    |          | `CameraFacingMode.ENVIRONMENT` |
| resolution     | CameraResolution               | Resolution of the camera to use.                                                                                                |          | `CameraResolution.UHD_4K`      |
| deviceId       | string                         | The ID of the camera to use.                                                                                                    |          |                                |
| format         | CompressionFormat              | The compression format used to compress images taken by the camera.                                                             |          | `CompressionFormat.JPEG`       |
| quality        | number                         | The image quality when using a compression format that supports lossy compression. From 0 (lowest quality) to 1 (best quality). |          | `0.8`                          |
| HUDComponent   | CameraHUDComponent             | The camera HUD component to display on top of the camera preview.                                                               |          |                                |
| onPictureTaken | (picture: MonkPicture) => void | Callback called when a picture has been taken by the user.                                                                      |          |                                |
| monitoring     | CameraMonitoringConfig         | Extra options that can be passed to configure how the monitoring is handled in the component.                                   |          |                                |

## Camera Handle interface
### Description
Object passed to Camera HUD components that is used to control the camera

### Properties
| Prop        | Type                       | Description                                                                   |
|-------------|----------------------------|-------------------------------------------------------------------------------|
| takePicture | () => MonkPicture          | A function that you can call to ask the camera to take a picture.             |
| error       | UserMediaError &#124; null | The error details if there has been an error when fetching the camera stream. |
| isLoading   | boolean                    | Boolean indicating if the camera preview is loading.                          |
| retry       | () => void                 | A function to retry the camera stream fetching in case of error.              |
