# @monkvision/inspection-capture-web
This package provides utils, tools and ready-to-use components used to capture pictures needed to run Monk inspections.
There are two main workflows for capturing pictures of a vehicle for a Monk inspection :
- The **PhotoCapture** workflow : the user is shown a certain set of car wireframes, called *Sights*, and they are asked
  to take pictures of the vehicle by aligning the vehicle with the Sight overlays.
- The **VideoCapture** workflow : the user is asked to record a quick video of their vehicle by filming it and rotating
  in a full circle around it.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/inspection-capture-web
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# PhotoCapture
The PhotoCapture wofklow is aimed at guiding users in taking pictures of their vehicle in order to add them to a Monk
inspection. The user is shown a set of car wireframes, which we call *Sights* and that are available in the
`@monkvision/sights` package. These Sights act as guides, and the user is asked to take pictures of their vehicle by
aligning it with the Sights.

## Add Damage
In this capture workflow, the user also has the option to manually take close-up pictures
of a damage, in order to increase the detection rate. This feature is called `Add Damage`, and there two workflows
available for it :
- **Part Selection** : The user is first asked to select where the damage is located on the car (by clicking on the
  corresponding car part on a 2D car model), and then they are asked to take a close-up picture of the damage.
- **2-Shot** : The user is first asked to take a picture centered on the damage, but containing the entire car (in order
  to allow our AI models to automatically detect where the damage is located on the car),  and then they are asked to
  take a close-up picture of the damage.

For now, only the 2-shot workflow is implemented in the PhotoCapture workflow.

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
  sights['fesc20-5Ts1UkPT'],
  sights['fesc20-raHPDUNm'],
];

export function MonkPhotoCapturePage() {
  return (
    <PhotoCapture
      inspectionId={inspectionId}
      apiConfig={apiConfig}
      sights={PHOTO_CAPTURE_SIGHTS}
      compliances={{ iqa: true }}
      onComplete={() => { /* Navigate to another page */ }}
    />
  );
}
```

| Prop                 | Type                                   | Description                                                                                                                                                                                                                                                                                                                                                                                               | Required | Default Value |
|----------------------|----------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| sights               | Sight[]                                | The list of Sights to take pictures of. The values in this array should be retreived from the `@monkvision/sights` package.                                                                                                                                                                                                                                                                               | ✔️       |               |
| inspectionId         | string                                 | The ID of the inspection to add images to. Make sure that the user that created the inspection if the same one as the one described in the auth token in the `apiConfig` prop.                                                                                                                                                                                                                            | ✔️       |               |
| apiConfig            | ApiConfig                              | The api config used to communicate with the API. Make sure that the user described in the auth token is the same one as the one that created the inspection provided in the `inspectionId` prop.                                                                                                                                                                                                          | ✔️       |               |
| compliances          | ComplianceOptions                      | Options used to specify compliance checks to be run on the pictures taken by the user.                                                                                                                                                                                                                                                                                                                    |          |               |
| tasksBySight         | `Record<string, TaskName[]>`           | Record associating each sight with a list of tasks to execute for it. If not provided, the default tasks of the sight will be used.                                                                                                                                                                                                                                                                       |          |               |
| startTasksOnComplete | <code>boolean &#124; TaskName[]</code> | Value indicating if tasks should be started at the end of the inspection :<br />If not provided or if value is set to `false`, no tasks will be started.<br />If set to `true`, the tasks described by the `tasksBySight` param (or, if not provided, the default tasks of each sight) will be started.<br />If an array of tasks is provided, the tasks started will be the ones contained in the array. |          |               |
| onClose              | `() => void`                           | Callback called when the user clicks on the Close button. If this callback is not provided, the button will not be displayed on the screen.                                                                                                                                                                                                                                                               |          |               |
| onComplete           | `() => void`                           | Callback called when inspection capture is complete.                                                                                                                                                                                                                                                                                                                                                      |          |               |
| showCloseButton      | boolean                                | Boolean indicating if the close button should be displayed in the HUD on top of the Camera preview.                                                                                                                                                                                                                                                                                                       |          | `false`       |
