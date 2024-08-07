---
sidebar_position: 10
---

# Upgrading From V3
This documentation page provides guidlines to upgrade from the MonkJs 3.X version to the 4.X.

## Why upgrade?
MonkJs 4 is a complete revamp of the Monk SDK, rewritten from scratch, aimed at providing :
- Better performances
- Better monitoring for bug catching
- New and improved UX/UI
- New features (Video capture, live compliance, offline management...)
- TypeScript typings with TSDoc integrated
- Better documentation
- And many more 🚀

Another key thing is that MonkJs used to be developed as a cross-platform React-Native SDK for Web (iOS / Android /
Web). This basically forced us to use Expo and other dependencies that were hard to maintain with such low-level
features. MonkJs 4 solves this issue by offering basically two SDKs : one for Web using ReactJs, and one for Native
using React-Native. Some packages of the SDK work for both web and native, while others are split into two separate
pacakges every time : one ending with `-web` for Web and one ending with `-native` for Native.

For now, only the Web part of the SDK has been implemented, but the Native one should come soon enough!

## Sights
The sights data previous exported as the default export of the Sights package is now split into 3 objects :
- `vehicles` containing the details for each vehicle used as a model for the sights
- `labels` containing translation details about each Sight label
- `sights` containing the Sight data, with more or less the same structure as before, except for the vehicle details and
  sight label that now are simply a key reference to the other data export by the package.

Another major difference is that sights now include additional details such as the list of tasks recommended to be run
for this sight. This means that you now don't have to specify manually which task to run for each sight when
implementing a capture workflow.

#### How you did it in MonkJs 3
```javascript
import sights from '@monkvision/sights';

const sight = sights['fesc20-H1dfdfvH'];
console.log(JSON.stringify(sight, null, 2));
/*
 * Output :
 * {
 *   "id": "fesc20-H1dfdfvH",
 *   "category": "exterior"
 *   "overlay": "<svg>...</svg>"
 *   "label": {
 *     "en":"Front Low",
 *     "fr":"Avant (position basse)"
 *   },
 * }
 */
```

#### How you do it in MonkJs 4
```typescript
import { sights, labels } from '@monkvision/sights';

const sight = sights['fesc20-H1dfdfvH'];
console.log(JSON.stringify(sight, null, 2));
/*
 * Output :
 * {
 *   "id": "fesc20-H1dfdfvH",
 *   "category": "exterior",
 *   "label": "front-low",
 *   "overlay": "<svg>...</svg>",
 *   "tasks": [
 *     "damage_detection"
 *   ],
 *   "vehicle": "fesc20"
 * }
 */

console.log(JSON.stringify(labels[sight.label], null, 2));
/*
 * Output :
 * {
 *   "key": "front-low",
 *   "en": "Front Low",
 *   "fr": "Avant - vue basse",
 *   "de": "Vorderseite Niedrig"
 * }
 */
```

## Camera and Inspection Capture
The `@monkvision/camera` package used to provide components such as `Capture` that were used to implement the picture
taking workflows (capture workflows) for inspections, as well as declaring the Camera app used by these Capture
components. This package has now been split into two :

- `@monkvision/camera-web` : A package that export a component called `Camera` that implements a camera preview used to
  take pictures, as well as logic utilities used to handle this camera. Usually, as a developer using the SDK, you won't
  have to use this package directly.
- `@monkvision/inspection-capture-web` : A package that export capture components (such as `PhotoCapture`) used to
  integrate the different Monk inspection capture workflows into your app.

#### How you did it in MonkJs 3
```jsx
import monk from '@monkvision/corejs';
import { Capture, Controls } from '@monkvision/camera';

const { TaskName } = monk.types;
monk.config.authConfig = { domain: 'api.monk.ai/v1' };
monk.config.accessToken = 'YOUR_AUTH0_ACCESS_TOKEN';

const inspectionId = '1e11fb94-26fe-4956-90b6-d11ef3c87da4';

const sightIds = [
  'fesc20-H1dfdfvH',
  'fesc20-WMUaKDp1',
  'fesc20-LTe3X2bg',
  'fesc20-hp3Tk53x',
];

const mapTasksToSight = [
  { id: 'fesc20-H1dfdfvH', tasks: [TaskName.DAMAGE_DETECTION] },
  { id: 'fesc20-WMUaKDp1', tasks: [TaskName.DAMAGE_DETECTION] },
  { id: 'fesc20-LTe3X2bg', tasks: [TaskName.DAMAGE_DETECTION] },
  { id: 'fesc20-hp3Tk53x', tasks: [TaskName.DAMAGE_DETECTION] },
];

function App() {
  const [cameraLoading, setCameraLoading] = useState(false);

  const controls = [
    { disabled: cameraLoading, ...Controls.AddDamageButtonProps },
    { disabled: cameraLoading, ...Controls.CaptureButtonProps },
  ];

  const handleSuccess = () => {
    // Update all the tasks statuses to TODO manually and then redirect to another page.
  };

  return (
    <Capture
      inspectionId={inspectionId}
      sightIds={sightIds}
      mapTasksToSight={mapTasksToSight}
      controls={controls}
      loading={cameraLoading}
      onReady={() => setCameraLoading(false)}
      onStartUploadPicture={() => setCameraLoading(true)}
      onFinishUploadPicture={() => setCameraLoading(false)}
      enableComplianceCheck
      onComplianceCheckFinish={handleSuccess}
    />
  );
}
```

#### How you do it in MonkJs 4
```tsx
import { sights } from '@monkvision/sights';
import { PhotoCapture } from '@monkvision/inspection-capture-web';

const apiConfig = {
  apiDomain: 'api.monk.ai/v1',
  authToken: 'YOUR_AUTH0_ACCESS_TOKEN',
};

const inspectionId = '1e11fb94-26fe-4956-90b6-d11ef3c87da4';

const sights = [
  sights['fesc20-H1dfdfvH'],
  sights['fesc20-WMUaKDp1'],
  sights['fesc20-LTe3X2bg'],
  sights['fesc20-hp3Tk53x'],
];

function App() {
  const handleSuccess = () => {
    // Immediately redirect to another page.
  };

  return (
    <PhotoCapture
      inspectionId={inspectionId}
      apiConfig={apiConfig}
      sights={sights}
      compliances={{ iqa: true }}
      onComplete={handleSuccess}
    />
  );
}
```
