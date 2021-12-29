---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---

Open a React based project with our favorite IDE, then import the Camera view called ``CaptureTour``.

```javascript
/* App.jsx */

import React from 'react';
import { useIcons } from '@monkvision/react-native';
import { CaptureTour, theme } from '@monkvision/react-native-views';
import { Provider as PaperProvider } from 'react-native-paper';

export default function App() {
  useIcons();

  return (
    <PaperProvider theme={theme}>
      <CaptureTour />
    </PaperProvider>
  );
}
```

This will create a tunnel view for taking pictures. `<CaptureTour />` takes callbacks and compose with your own logic.

**See the [CaptureTour API](/docs/js/api/components/capture-tour) to more details.**

## What's next?

You surely want to analyze and manipulate photos via Monk's predictions,
but first we will see how to authenticate before executing a request to our API.
