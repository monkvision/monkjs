# @monkvision/inspection-capture-web
This package provides utils, tools and ready-to-use components used to capture pictures needed to run Monk inspections.
There are two main workflows for capturing pictures of a vehicle for a Monk inspection :
- The **PhotoCapture** workflow : the user is shown a certain set of car wireframes, called *Sights*, and they are asked
  to take pictures of the vehicle by aligning the vehicle with the Sight overlays.
- The **VideoCapture** workflow : the user is asked to record a quick video of their vehicle by filming it and rotating
  in a full circle around it.
- The **DamageDisclosure** workflow : The user is guided to capture close-up pictures of specific damaged parts of the vehicle. There are 2 workflows available:
  - Part-selection: Before taking the picture, the user must first select the damaged part on the vehicle wireframe then a close-up picture of the damage.
  - Two-shot: The user is asked to take, first a wide picture of the vehicle, then a close-up picture of the damage.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/inspection-capture-web
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# PhotoCapture
The PhotoCapture workflow is aimed at guiding users in taking pictures of their vehicle in order to add them to a Monk
inspection. The user is shown a set of car wireframes, which we call *Sights* and that are available in the
`@monkvision/sights` package. These Sights act as guides, and the user is asked to take pictures of their vehicle by
aligning it with the Sights.

Please refer to the [official MonkJs documentation](https://monkvision.github.io/monkjs/docs/photo-capture-workflow) to
have a detailed overview of the Photo Capture workflow.

## PhotoCapture component
This package exports a ready-to-use single-page component called `PhotoCapture` that implements the PhotoCapture
workflow. In order to use it, simply create a new page in your application containing just this component. You will then
need to generate a Monk authentication token (using Auth0), and create a new inspection, in which all tasks statuses are
set to `NOT_STARTED` (so that we can add images to them later). You can then pass the api config (with the auth token),
the inspection ID, as well as a list of Sights (to display to the user) to the `PhotoCapture` component. Once the user
has completed the capture workflow, the `onComplete` callback will be called, and you will then be able to navigate to
another page. The complete list of configuration props for this component is available at the end of this section.

```tsx
import { sights } from '@monkvision/sights';
import { PhotoCapture } from '@monkvision/inspection-capture-web';

const PHOTO_CAPTURE_SIGHTS = [
  sights['fesc20-0mJeXBDf'],
  sights['fesc20-26n47kaO'],
  sights['fesc20-2bLRuhEQ'],
  sights['fesc20-4Wqx52oU'],
  sights['fesc20-Tlu3sz8A'],
];

const apiDomain = 'api.preview.monk.ai/v1';

export function MonkPhotoCapturePage({ authToken }) {
  return (
    <PhotoCapture
      inspectionId={inspectionId}
      apiConfig={{ apiDomain, authToken }}
      sights={PHOTO_CAPTURE_SIGHTS}
      onComplete={() => { /* Navigate to another page */ }}
    />
  );
}
```

| Prop                               | Type                                         | Description                                                                                                                                                                                      | Required | Default Value                                |
|------------------------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------------------------------------------|
| format                             | `CompressionFormat`                          | The output format of the compression.                                                                                                                                                            |          | `CompressionFormat.JPEG`                     |
| quality                            | `number`                                     | Value indicating image quality for the compression output.                                                                                                                                       |          | `0.6`                                        |
| resolution                         | `CameraResolution`                           | Indicates the resolution of the pictures taken by the Camera.                                                                                                                                    |          | `CameraResolution.UHD_4K`                    |
| allowImageUpscaling                | `boolean`                                    | Allow images to be scaled up if the device does not support the specified resolution in the `resolution` prop.                                                                                   |          | `false`                                      |
| additionalTasks                    | `TaskName[]`                                 | An optional list of additional tasks to run on every image of the inspection.                                                                                                                    |          |                                              |
| startTasksOnComplete               | `<code>boolean &#124; TaskName[]</code>`     | Value indicating if tasks should be started at the end of the inspection. See the `inspection-capture-web` package doc for more info.                                                            |          | `true`                                       |
| enforceOrientation                 | `DeviceOrientation`                          | Use this prop to enforce a specific device orientation for the Camera screen.                                                                                                                    |          |                                              |
| inspectionId                       | string                                       | The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as the one described in the auth token in the `apiConfig` prop.                   | ✔️       |                                              |
| apiConfig                          | ApiConfig                                    | The api config used to communicate with the API. Make sure that the user described in the auth token is the same one as the one that created the inspection provided in the `inspectionId` prop. | ✔️       |                                              |
| onComplete                         | `() => void`                                 | Callback called when inspection capture is complete.                                                                                                                                             |          |                                              |
| lang                               | <code>string &#124; null</code>              | The language to be used by this component.                                                                                                                                                       |          | `'en'`                                       |
| sights                             | Sight[]                                      | The list of Sights to take pictures of. The values in this array should be retreived from the `@monkvision/sights` package.                                                                      | ✔️       |                                              |
| tasksBySight                       | `Record<string, TaskName[]>`                 | Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the sight will be used.                                                              |          |                                              |
| showCloseButton                    | `boolean`                                    | Indicates if the close button should be displayed in the HUD on top of the Camera preview.                                                                                                       |          | `false`                                      |
| allowSkipRetake                    | `boolean`                                    | If compliance is enabled, this prop indicate if the user is allowed to skip the retaking process if some pictures are not compliant.                                                             |          | `false`                                      |
| enableAddDamage                    | `boolean`                                    | Boolean indicating if the Add Damage feature should be enabled or not.                                                                                                                           |          | `true`                                       |
| sightGuidelines                    | `sightGuideline[]`                           | A collection of sight guidelines in different language with a list of sightIds associate to it.                                                                                                  |          |                                              |
| enableSightGuideline               | `boolean`                                    | Boolean indicating whether the sight guideline feature is enabled. If disabled, the guideline text will be hidden.                                                                               |          | `true`                                       |
| enableTutorial                     | `PhotoCaptureTutorialOption`                 | Options for displaying the photo capture tutorial.                                                                                                                                               |          | `PhotoCaptureTutorialOption.FIRST_TIME_ONLY` |
| allowSkipTutorial                  | `boolean`                                    | Boolean indicating if the user can skip the PhotoCapture tutorial.                                                                                                                               |          | `true`                                       |
| enableSightTutorial                | `boolean`                                    | Boolean indicating whether the sight tutorial feature is enabled.                                                                                                                                |          | `true`                                       |
| enableCompliance                   | `boolean`                                    | Indicates if compliance checks should be enabled or not.                                                                                                                                         |          | `true`                                       |
| enableCompliancePerSight           | `string[]`                                   | Array of Sight IDs that indicates for which sight IDs the compliance should be enabled.                                                                                                          |          |                                              |
| complianceIssues                   | `ComplianceIssue[]`                          | If compliance checks are enabled, this property can be used to select a list of compliance issues to check.                                                                                      |          | `DEFAULT_COMPLIANCE_ISSUES`                  |
| complianceIssuesPerSight           | `Record<string, ComplianceIssue[]>`          | A map associating Sight IDs to a list of compliance issues to check.                                                                                                                             |          |                                              |
| useLiveCompliance                  | `boolean`                                    | Indicates if live compliance should be enabled or not.                                                                                                                                           |          | `false`                                      |
| customComplianceThresholds         | `CustomComplianceThresholds`                 | Custom thresholds that can be used to modify the strictness of the compliance for certain compliance issues.                                                                                     |          |                                              |
| customComplianceThresholdsPerSight | `Record<string, CustomComplianceThresholds>` | A map associating Sight IDs to custom compliance thresholds.                                                                                                                                     |          |                                              |
| onClose                            | `() => void`                                 | Callback called when the user clicks on the Close button. If this callback is not provided, the button will not be displayed on the screen.                                                      |          |                                              |
| onPictureTaken                     | `(picture: MonkPicture) => void`             | Callback called when the user has taken a picture in the Capture process.                                                                                                                        |          |                                              |
| validateButtonLabel                | `string`                                     | Custom label for validate button in gallery view.                                                                                                                                                |          |                                              |
| maxUploadDurationWarning           | `number`                                     | Max upload duration in milliseconds before showing a bad connection warning to the user. Use `-1` to never display the warning.                                                                  |          | `15000`                                      |
| useAdaptiveImageQuality            | `boolean`                                    | Boolean indicating if the image quality should be downgraded automatically in case of low connection.                                                                                            |          | `true`                                       |
| vehicleType                        | `VehicleType`                                | The vehicle type of the inspection.                                                                                                                                                              |          | `VehicleType.SEDAN`                          |

# VideoCapture
The VideoCapture workflow is aimed at asking users to record a walkaround video of their vehicle (around ~1min per
video) to send vehicle inspection pictures to the Monk API. In reality, no video is being recorded. Instead, screenshots
of the camera stream a repeatidly taken while the users walks around their vehicle. An algorithm is run to select the
best video frames (the less blurry ones), and they are then sent to the Monk API.

Please refer to the [official MonkJs documentation](https://monkvision.github.io/monkjs/docs/photo-capture-workflow) to
have a detailed overview of the Video Capture workflow.

## VideoCapture component
This package exports a ready-to-use single-page component called `VideoCapture` that implements the VideoCapture
workflow. The implementation for it is extremely similar to the `PhotoCapture` component described above. The only
difference being the configuration options that differ, as well as the fact that you need to pass certain parameters
when creating your inspection to ake sure it will be able to receive video frames as inputs (if you are creating your
inspection using the `createInspection` requests of the MonkJs SDK, you can simply set the `isVideoCapture` option to
`true`).

```tsx
import { sights } from '@monkvision/sights';
import { VideoCapture } from '@monkvision/inspection-capture-web';

const apiDomain = 'api.preview.monk.ai/v1';

export function MonkVideoCapturePage({ authToken }) {
  return (
    <VideoCapture
      inspectionId={inspectionId}
      apiConfig={{ apiDomain, authToken }}
      onComplete={() => { /* Navigate to another page */ }}
    />
  );
}
```

Props

| Prop                         | Type                                     | Description                                                                                                                                                                                      | Required | Default Value             |
|------------------------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------------------|
| format                       | `CompressionFormat`                      | The output format of the compression.                                                                                                                                                            |          | `CompressionFormat.JPEG`  |
| quality                      | `number`                                 | Value indicating image quality for the compression output.                                                                                                                                       |          | `0.6`                     |
| resolution                   | `CameraResolution`                       | Indicates the resolution of the pictures taken by the Camera.                                                                                                                                    |          | `CameraResolution.UHD_4K` |
| allowImageUpscaling          | `boolean`                                | Allow images to be scaled up if the device does not support the specified resolution in the `resolution` prop.                                                                                   |          | `false`                   |
| additionalTasks              | `TaskName[]`                             | An optional list of additional tasks to run on every image of the inspection.                                                                                                                    |          |                           |
| startTasksOnComplete         | `<code>boolean &#124; TaskName[]</code>` | Value indicating if tasks should be started at the end of the inspection. See the `inspection-capture-web` package doc for more info.                                                            |          | `true`                    |
| enforceOrientation           | `DeviceOrientation`                      | Use this prop to enforce a specific device orientation for the Camera screen.                                                                                                                    |          |                           |
| inspectionId                 | string                                   | The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as the one described in the auth token in the `apiConfig` prop.                   | ✔️       |                           |
| apiConfig                    | ApiConfig                                | The api config used to communicate with the API. Make sure that the user described in the auth token is the same one as the one that created the inspection provided in the `inspectionId` prop. | ✔️       |                           |
| onComplete                   | `() => void`                             | Callback called when inspection capture is complete.                                                                                                                                             |          |                           |
| lang                         | <code>string &#124; null</code>          | The language to be used by this component.                                                                                                                                                       |          | `'en'`                    |
| minRecordingDuration         | `number`                                 | The minimum duration of a recording in milliseconds.                                                                                                                                             |          | `15000`                   |
| maxRetryCount                | `number`                                 | The maximum number of retries for failed image uploads.                                                                                                                                          |          | `3`                       |
| enableFastWalkingWarning     | `boolean`                                | Boolean indicating if a warning should be shown to the user when they are walking too fast around the vehicle.                                                                                   |          | `true`                    |
| enablePhoneShakingWarning    | `boolean`                                | Boolean indicating if a warning should be shown to the user when they are shaking their phone too much.                                                                                          |          | `true`                    |
| fastWalkingWarningCooldown   | `number`                                 | The duration (in milliseconds) to wait between fast walking warnings.                                                                                                                            |          | `4000`                    |
| phoneShakingWarningCooldown  | `number`                                 | The duration (in milliseconds) to wait between phone shaking warnings.                                                                                                                           |          | `4000`                    |

# DamageDisclosure

The DamageDisclosure workflow is designed to guide users in documenting and disclosing damage to their vehicles during a Monk inspection.
This workflow is ideal for capturing detailed images of specific damages such as dents, scratches, or other issues that need to be highlighted in the inspection report.
There are 2 workflows available.

Please refer to the [official MonkJs documentation](https://monkvision.github.io/monkjs/docs/photo-capture-workflow) for a comprehensive overview of the Add damage workflow.

## DamageDisclosure component

This package exports a ready-to-use single-page component called DamageDisclosure that implements the DamageDisclosure workflow. You can integrate it into your application by creating a new page containing only this component. Before using it, you must generate an Auth0 authentication token and create a new inspection using the Monk API. Ensure that all task statuses in the inspection are set to NOT_STARTED.

You can then pass the inspection ID, API configuration (including the auth token). Once the user completes the workflow, the onComplete callback is triggered, allowing you to navigate to another page or perform additional actions.

The following example demonstrates how to use the DamageDisclosure component:

```tsx
import { DamageDisclosure } from '@monkvision/inspection-capture-web';

const apiDomain = 'api.preview.monk.ai/v1';

export function MonkDamageDisclosurePage({ authToken }) {
  return (
    <DamageDisclosure
      inspectionId={inspectionId}
      apiConfig={{ apiDomain, authToken }}
      onComplete={() => { /* Navigate to another page */ }}
    />
  );
}
```

Props

| Prop                       | Type                                         | Description                                                                                                                                                                                      | Required | Default Value                                |
|----------------------------|----------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------------------------------------------|
| inspectionId               | string                                       | The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as the one described in the auth token in the `apiConfig` prop.                   | ✔️       |                                              |
| apiConfig                  | ApiConfig                                    | The api config used to communicate with the API. Make sure that the user described in the auth token is the same one as the one that created the inspection provided in the `inspectionId` prop. | ✔️       |                                              |
| onClose                    | `() => void`                                 | Callback called when the user clicks on the Close button. If this callback is not provided, the button will not be displayed on the screen.                                                      |          |                                              |
| onComplete                 | `() => void`                                 | Callback called when inspection capture is complete.                                                                                                                                             |          |                                              |
| onPictureTaken             | `(picture: MonkPicture) => void`             | Callback called when the user has taken a picture in the Capture process.                                                                                                                        |          |                                              |
| lang                       | <code>string &#124; null</code>              | The language to be used by this component.                                                                                                                                                       |          | `'en'`                                       |
| enforceOrientation         | `DeviceOrientation`                          | Use this prop to enforce a specific device orientation for the Camera screen.                                                                                                                    |          |                                              |
| maxUploadDurationWarning   | `number`                                     | Max upload duration in milliseconds before showing a bad connection warning to the user. Use `-1` to never display the warning.                                                                  |          | `15000`                                      |
| useAdaptiveImageQuality    | `boolean`                                    | Boolean indicating if the image quality should be downgraded automatically in case of low connection.                                                                                            |          | `true`                                       |
| showCloseButton            | `boolean`                                    | Indicates if the close button should be displayed in the HUD on top of the Camera preview.                                                                                                       |          | `false`                                      |
| format                     | `CompressionFormat`                          | The output format of the compression.                                                                                                                                                            |          | `CompressionFormat.JPEG`                     |
| quality                    | `number`                                     | Value indicating image quality for the compression output.                                                                                                                                       |          | `0.6`                                        |
| resolution                 | `CameraResolution`                           | Indicates the resolution of the pictures taken by the Camera.                                                                                                                                    |          | `CameraResolution.UHD_4K`                    |
| allowImageUpscaling        | `boolean`                                    | Allow images to be scaled up if the device does not support the specified resolution in the `resolution` prop.                                                                                   |          | `false`                                      |
| useLiveCompliance          | `boolean`                                    | Indicates if live compliance should be enabled or not.                                                                                                                                           |          | `false`                                      |
| validateButtonLabel        | `string`                                     | Custom label for validate button in gallery view.                                                                                                                                                |          |                                              |
| thumbnailDomain            | `string`                                     | The API domain used to communicate with the resize micro service.                                                                                                                                | ✔️       |                                              |
| vehicleType                | `VehicleType`                                | The vehicle type of the inspection.                                                                                                                                                              |          | `VehicleType.SEDAN`                          |
