---
id: views
title: "Views"
slug: /js/api/views
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## addOneViewToInspection
`POST /inspections/${inspectionId}/views`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.views.addOne({ inspectionId, data });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/View/post_view)

## deleteOneView
`DELETE /inspections/${inspectionId}/views/${id}`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.views.deleteOne({ inspectionId, id });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/View/delete_view)
