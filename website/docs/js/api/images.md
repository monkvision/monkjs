---
id: images
title: "Images"
slug: /js/api/images
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## addOneImageToInspection
`POST /inspections/${inspectionId}/images`

Add an image to an existing inspection.
You must provide the id of the inspection.
The response is a unique image id.

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.images.addOne({ inspectionId, data });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/add_image_to_inspection)
