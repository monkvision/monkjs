---
id: capture-tour
title: "CaptureTour"
slug: /js/api/components/capture-tour
---

**Interface guiding user in a 360 vehicle capture process.**

``` javascript
import { CaptureTour } from '@monkvision/react-native-views'; // or CameraView
```

> The component was previously called CameraView. You can still import it with the same name.

```javascript
const handleSuccess = ({ pictures, camera, sights }) => {
  console.log(pictures); // [{ name, Sight, Source }, ...]
};

const handleTakePicture = (picture) => {
  console.log(picture); // { name, Sight, Source }
};

return (
  <CaptureTour
    onSuccess={handleSuccess}
    onTakePicture={handleTakePicture}
  />
);
```


## initialPicturesState
`propTypes.cameraPictures`

An array or object containing pictures like the `pictures` prop returned by `onSuccess` callback. Useful if you want to persist the state of the tour and go back later. The component will count pictures and go to the active sight of `pictures.length - 1` index.

``` javascript
const cameraPicture = shape({ name, sight, source });
const cameraPictures = oneOfType([arrayOf(cameraPicture), objectOf(cameraPicture)]);

const initialPicturesState = {};

<CaptureTour initialPicturesState={initialPicturesState}/>
```

## isLoading
`PropTypes.bool`

Will display an `ActivityIndicator` view. Use it when you are uploading a picture for example.

``` javascript
const isLoading = false;

<CaptureTour isLoading={isLoading}/>
```

## onCloseCamera
`PropTypes.func`

Will call a function when the user press on the "Close" control.

``` javascript
const handleCloseCamera = console.warn('Are you sure ?');

<CaptureTour onCloseCamera={handleCloseCamera}/>
```


## onRefreshUpload
`PropTypes.func`

Will call a function when the user press on the "Re upload" control. This control is displayed only when `sightIdsNotUploaded` is not empty.

``` javascript
const handleRefreshUpload = useCallback(() => {
  state.picturesNotUploaded.forEach((picture) => {
    handleTakePicture(
      Platform.OS === 'web'
        ? picture.source.base64
        : picture.source.uri,
      inspectionId,
    );
  });
}, [handleTakePicture, inspectionId, screen]);


<CaptureTour onRefreshUpload={handleRefreshUpload}/>
```


## onSettings
``PropTypes.func``

Will call a function when the user press on the "Settings" control.

``` javascript
const handleSettings = () => console.log('Open settings menu');

<CaptureTour onSettings={handleSettings}/>
```


## onSuccess
``PropTypes.func``

Will call a function when the user has ended on the tour. You can use `@monkvision/corejs` API to start a damage inspection for example.

``` javascript
const handleSuccess = ({ pictures, camera, sights }) => console.log(pictures);

// pictures: [{
//   name: 'abstractFront',
//   sight: Sight,
//   source: { uri, base64 },
// }, ...]

<CaptureTour onSuccess={handleSuccess}/>
```


## onTakePicture
``PropTypes.func``

Will call a function when the camera has taken a picture. You can use `@monkvision/corejs` API to upload the picture to an inspection for example.

``` javascript
const handleTakePicture = (picture) => console.log(picture);

// picture: {
//   name: 'abstractFront',
//   sight: Sight,
//   source: { uri, base64 },
// }

<CaptureTour onTakePicture={handleTakePicture}/>
```


## sightIdsNotUploaded
``PropTypes.arrayof(PropTypes.string)``

List of picture names or ids that have failed to upload. If not empty, it will display a refresh button to use with the `onRefreshUpload` callback.

``` javascript
const sightIdsNotUploaded = [
  'abstractFront',
  'abstractFrontRight',
];

<CaptureTour sightIdsNotUploaded={sightIdsNotUploaded}/>
```


## sights
``propTypes.sights``

List of sights. Sights are metadata for picture to enhance AI capabilities. We recommended letting this prop by default to experience the common Monk workflow (16 pictures, exterior and interior).

``` javascript
import { Sight, values } from '@monkvision/corejs';

const sights = Object.values(values.sights.abstract)
  .map((s) => new Sight(...s));

<CaptureTour sights={sights}/>
```
