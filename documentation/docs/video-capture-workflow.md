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
