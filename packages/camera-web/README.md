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

```tsx
// This super simple bit of code will let you display a camera preview in your app.
import { Camera } from '@monkvision/camera-web';

function MyCameraPreview() {
  return <Camera />;
}
```

## Camera resolution
The resolution quality of the pictures taken by the Camera component is configurable by passing it as a prop to the
Camera component :

```tsx
import { Camera, CameraResolution } from '@monkvision/camera-web';

function MyCameraPreview() {
  return <Camera resolution={CameraResolution.HD_720P} />;
}
```

Notes :
- This option does not affect the resolution of the Camera preview : the preview will always use the highest
  resolution available on the current device.
- If the specified resolution is not equal to the one used by the device's native camera, the pictures taken will be
  scaled to fit the requirements.
- The resolutions available in the `CameraResolution` enum are all in the 16:9 format.
- If the aspect ratio of the specified resolution differs from the one of the device's camera, pictures taken will
  always have the same aspect ratio as the native camera one, and will be scaled in a way to make sure that neither the
  width, nor the height of the output picture will exceed the dimensions of the specified resolution.

## Compression options
When pictures are taken by the camera, they are compressed and encoded. The compression format and quality can be
configured using props on the camera component in the following ways :

```tsx
import { Camera } from '@monkvision/camera-web';
import { CompressionFormat } from '@monkvision/types';

function MyCameraPreview() {
  return <Camera format={CompressionFormat.JPEG} quality={0.4} />;
}
```

For more details on the compression options, see the *API* section below.

## Camera HUD
In order to control the Camera (take pictures etc.), an HUD component can be passed as a prop to the Camera component.
An HUD component is a component that takes a camera handle (an object used to control the camera) as well as
a camera preview element as props and that will display the preview with some additional head-up display on top of it.
When a HUD component is passed to the Camera component, the Camera will place it in the tree, and will pass him down the
camera handle and preview already configured.

It is definitely possible to write your own custom Camera HUD component, but if you just need a very basic Camera HUD,
this package exports one already : the `SimpleCameraHUD` component. It will display a button to take the pictures, error
messages with proper labels in case there are errors when fetching the camera video stream, and a retry button to try
to fetch the camera stream again if there was an error.

To use this HUD, simply pass the component to the `HUDComponent` prop of the Camera component :

```tsx
import { Camera, SimpleCameraHUD } from '@monkvision/camera-web';

function MyCameraPreviewWithHUD() {
  return <Camera HUDComponent={SimpleCameraHUD} />;
}
```

The text displayed by this component (error messages, retry button label...) is by default in english. If you want to
customize the display language, you can specify the fixed language you want to use by using the `lang` prop of the
component like this :

```tsx
import { Camera, SimpleCameraHUD } from '@monkvision/camera-web';

function MyCameraPreviewWithGermanHUD() {
  return <Camera HUDComponent={SimpleCameraHUD} hudProps={{ lang: 'fr' }} />;
}
```

The currently supported languages are :
- English : `'en'` (default)
- French : `'fr'`
- German : `'de'`
- Dutch : `'nl'`

## Creating a Custom HUD
In order to implement custom Camera HUD, you simply need to create a component that will take a camera handle and a
camera preview as props. Additional props can be passed to this HUD component using the `hudProps` prop of the Camera
component :

```tsx
import { Camera, CameraHUDProps } from '@monkvision/camera-web';

interface MyCustomCameraHUD extends CameraHUDProps {
  message: string;
}

function MyCustomCameraHUD({ handle, cameraPreview, message }: MyCustomCameraHUD) {
  return (
    <div>
      {cameraPreview}
      <button onClick={handle.takePicture}>Take Picture</button>
      <div>{message}</div>
    </div>
  );
}

function MyCameraPreviewWithCustomHUD() {
  return (
    <Camera
      HUDComponent={MyCustomCameraHUD}
      hudProps={{ message: 'Hello World!' }}
    />
  );
}
```

The complete specification of the camera handle is available in the *API* section below.

## Camera Events
In order to add side effects when some things happen in the Camera, you can specify event handlers callbacks in the
Camera component props. For now the supported events available are :

- `onPictureTaken: (picture: MonkPicture) => void` : Callback called when the user takes a picture

# API
## Camera component
### Description
Main component exported by this package, displays a Camera preview and the given HUD on top of it.

### Props
| Prop           | Type                           | Description                                                                                                                     | Required | Default Value                  |
|----------------|--------------------------------|---------------------------------------------------------------------------------------------------------------------------------|----------|--------------------------------|
| resolution     | CameraResolution               | Resolution of the pictures taken by the camera. This does not affect the resolution of the Camera preview.                      |          | `CameraResolution.UHD_4K`      |
| format         | CompressionFormat              | The compression format used to compress images taken by the camera.                                                             |          | `CompressionFormat.JPEG`       |
| quality        | number                         | The image quality when using a compression format that supports lossy compression. From 0 (lowest quality) to 1 (best quality). |          | `0.8`                          |
| HUDComponent   | CameraHUDComponent<T>          | The camera HUD component to display on top of the camera preview.                                                               |          |                                |
| hudProps       | T                              | Additional props passed down to the Camera HUD component.                                                                       |          |                                |
| onPictureTaken | (picture: MonkPicture) => void | Callback called when a picture has been taken by the user.                                                                      |          |                                |
| monitoring     | CameraMonitoringConfig         | Extra options that can be passed to configure how the monitoring is handled in the component.                                   |          |                                |

## Camera Handle interface
### Description
Object passed to Camera HUD components that is used to control the camera

### Properties
| Prop              | Type                        | Description                                                                                              |
|-------------------|-----------------------------|----------------------------------------------------------------------------------------------------------|
| takePicture       | () => Promise<MonkPicture>  | A function that you can call to ask the camera to take a picture.                                        |
| error             | UserMediaError &#124; null  | The error details if there has been an error when fetching the camera stream.                            |
| isLoading         | boolean                     | Boolean indicating if the camera preview is loading.                                                     |
| retry             | () => void                  | A function to retry the camera stream fetching in case of error.                                         |
| dimensions        | PixelDimensions &#124; null | The Camera stream dimensions (`null` if there is no stream).                                             |
| previewDimensions | PixelDimensions &#124; null | The effective video dimensions of the Camera stream on the client screen (`null` if there is no stream). |
