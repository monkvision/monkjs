---
sidebar_position: 7
---

# Video Capture Workflow
Along with the Photo Capture workflow, the Video Capture workflow is one of the two ways you can add pictures manually
to a Monk inspection that you created. The workflow is as follows :
- Display a camera preview to the user, allowing them to record a video of their vehicle while walking around it
- Also allow the user to manually take pictures while doing it
- Once the vehicle walkaround is completed (around 1min), finish the process by asking the API to start the inspection
  tasks

## VideoCapture Component
The `@monkvision/inspection-capture-web` exports a component called `VideoCapture`. This component is a ready-to-use
single page component, that implements the whole Video Capture workflow. In order to use it :
- Create a new inspection (make sure to add the tasks you need and to set the `isVideoCapture` param to `true`)
- Pass the inspection ID, along with the auth token and api configuration to the `VideoCapture` component
- Once the user has completed the inspection, the `onComplete` callback will be called

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

The complete list of configuration options for this component is available in the `@monkvision/inspection-capture-web`
[README file](https://github.com/monkvision/monkjs/blob/main/packages/inspection-capture-web/README.md).

## Hybrid Video Mode
When the `enableHybridVideo` option is set to `true`, the VideoCapture component enters hybrid mode. In this mode, the
workflow transitions the user from video recording to photo capture :
- The user records a walkaround video of their vehicle
- Once the recording is complete, a completion screen is displayed confirming the video is done
- The user is then transitioned to the PhotoCapture workflow to take individual detail photos
- After the photos are taken, the inspection is finalized

This mode is useful when you want to combine the speed of a video walkaround with the precision of individual photos
for specific sights. See the [configuration page](configuration.md) for the full list of hybrid mode options.

## Beauty Shot Extraction
When the `enableBeautyShotExtraction` option is set to `true` (the default), the best frames of the recorded video are
automatically extracted and added to the inspection as beauty shots. This feature works in both standard and hybrid
video modes.
