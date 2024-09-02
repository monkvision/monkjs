---
sidebar_position: 6
---

# Photo Capture Workflow
Along with the Video Capture workflow, the Photo Capture workflow is one of the two ways you can add pictures manually
to a Monk inspection that you created. The workflow is as follows :
- Display a camera preview to the user, allowing them to take pictures of their vehicle
- On top of the camera preview, display different vehicle wireframes (called *Sights*), that act as guides for the user
- Every time the user takes a picture, upload it to the API and add it to the inspection
- Once every picture has been uploaded, finish the process by asking the API to start the inspection tasks

## PhotoCapture Component
The `@monkvision/inspection-capture-web` exports a component called `PhotoCapture`. This component is a ready-to-use
single page component, that implements the whole Photo Capture workflow. In order to use it :
- Choose a list of Sights to display to the user (from the `@monkvision/sights` package)
- Create a new inspection (make sure to add the tasks you need)
- Pass the Sights list, the inspection ID, along with the auth token and api configuration to the `PhotoCapture`
  component
- Once the user has completed the inspection, the `onComplete` callback will be called

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

The complete list of configuration options for this component is available in the `@monkvision/inspection-capture-web`
[README file](https://github.com/monkvision/monkjs/blob/main/packages/inspection-capture-web/README.md).

## Add Damage
In this capture workflow, the user also has the option to manually take close-up pictures of a damage, in order to
increase the detection rate. This feature is called `Add Damage`, and there two workflows for it :
- **Part Selection** : The user is first asked to select where the damage is located on the car (by clicking on the
  corresponding car part on a 2D car model), and then they are asked to take a close-up picture of the damage.
- **2-Shot** : The user is first asked to take a picture centered on the damage, but containing the entire car (in order
  to allow our AI models to automatically detect where the damage is located on the car), and then they are asked to
  take a close-up picture of the damage.

For now, only the 2-shot workflow is implemented in the PhotoCapture workflow. This feature is enabled by default in the
`PhotoCapture` component. To disable it, pass the `addDamage` prop to `AddDamage.DISABLED`.

## Using Compliance
The compliance is a feature that allows our AI models to analyze the quality of the pictures taken by the user, and if
it judges that the images are not compliant with our standards, we can ask the user to retake the pictures again. The
compliances checks are based on the following criteria :
- IQA (Image Quality Assessment) : image blurriness, overexposure, underexposure etc.
- VQA (Vehicle Quality Assessment) : vehicle dirtniess, snow on the vehicle etc.
- Zoom Level : If the user is too far or too close to the vehicle
- Car Coverage : If the user has properly aligned the Sight overlay with the vehicle

Every time a picture is taken by the user and uploaded to the API, our API will run compliance checks on it, and will
output a list of compliance issues detected for the picture. The complete list of compliance issues is available in the
`ComplianceIssue` enum in the `@monkvision/types` package.

### Enabling Compliance
By default, compliance is enabled in the `PhotoCapture` component. To disable it, set the `enableCompliance` prop to
`false`. You can also specify a list of Sights for which the compliance should be enabled, thus disabling compliance for
Sights that are not in this list. To do this, you can pass an array of Sight IDs for which to enable compliance in the
`enableCompliancePerSight` prop of the `PhotoCapture` component. Note that if you specify the `enableCompliancePerSight`
prop, it will override the `enableCompliance` prop.

### Blocking Compliance
By default, the compliance in the `PhotoCapture` component is blocking, meaning that the user can't complete the Photo
Capture worfklow if there are still some images that are not compliant. They will need to retake non-compliant picture
until every Sight's picture is compliant in order to finish the process. To disable this feature and allow the user to
skip the retaking process, simply set the `allowSkipRetake` prop to `true`.

### Using Live Compliance
By default, the compliance in the `PhotoCapture` component is asynchronous, meaning that when you first upload a picture
to the API, its status will be `ImageStatus.COMPLIANCE_RUNNING`, indicating that the API is currently running the
compliance checks and the results are not available yet. In order to get the results, you will need to fetch the image
data from the API (usually using the `GET /inspections/{id}` request) to obtain the results.

You can, however, enable the Live Compliance feature by passing `useLiveCompliance` to `true` in the `PhotoCapture`
component. When using Live Compliance, you will get the compliance results immediately after uploading the image, at the
cost of the API request taking longer to execute (around 2 seconds per request on average).

### Disabling Compliance Issues
The `PhotoCapture` component offers you the option to disable certain compliance issues. To do this, simply pass an
array containing the list of compliance issues that you want to support in the `complianceIssues` prop. Some compliance
issues are disabled by default in the SDK, and the list of enabled compliance issues by default is declared in the
`DEFAULT_COMPLIANCE_ISSUES` constant exported by the `@monkvision/types` package. For instance, if you want to keep the
default compliance issues, but want to disable the overexposure and underexposure errors in your app, you can do
something like this :

```tsx
import { ComplianceIssue, DEFAULT_COMPLIANCE_ISSUES } from '@monkvision/types';

const disabledComplianceIssues = [ComplianceIssue.UNDEREXPOSURE, ComplianceIssue.OVEREXPOSURE];
const complianceIssues = DEFAULT_COMPLIANCE_ISSUES.filter(
  (issue) => !disabledComplianceIssues.includes(disabledComplianceIssues)
);

export function MonkPhotoCapturePage() {
  return (
    <PhotoCapture
      complianceIssues={complianceIssues}
      ...
    />
  );
}
```

You can also specify a list of compliance issues to use per Sight by passing to the `complianceIssuesPerSight` prop an
object that maps Sight IDs to an array containing the list of compliance issues to enable for the given sight. When
specifying the `complianceIssuesPerSight` prop, it takes priority over the `complianceIssues` prop, meaning that the
`PhotoCapture` component will first look into the `complianceIssuesPerSight` map for compliance issues for the given
Sight, and if not found, it will use the one defined in the `complianceIssues` array (or the `DEFAULT_COMPLIANCE_ISSUES`
array if `complianceIssues` is not specified).
