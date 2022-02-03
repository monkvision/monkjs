---
id: picturing
title: "📷 Taking pictures"
slug: /js/guides/picturing
---

Open a React based project with our favorite IDE, then import the Camera view called ``Capture``.

```javascript
/* App.jsx */

import React from 'react';
import { Capture, theme } from '@monkvision/rcamera';

export default function App() {
  return <Capture />;
}
```

This will create a tunnel view for taking pictures. `<Capture />` takes callbacks and compose with your own logic.

**See the [Capture API](/docs/js/api/components/capture) to more details.**

## What's next?

You surely want to analyze and manipulate photos via Monk's predictions,
but first we will see how to authenticate before executing a request to our API.
