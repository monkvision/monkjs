---
id: view
title: "View"
slug: /js/api/view
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

```js
import monk from '@monkvision/corejs'

const { createOne, deleteOne } = monk.entity.view;
```

## createOne
`POST /inspections/${inspectionId}/views`

```javascript
await monk.view.createOne({ inspectionId, data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/View/post_view)

| **name**                                   | **type**        | **default** |
|--------------------------------------------|-----------------|-------------|
| `inspectionId`                             | string          |             |
| `data`                                     | Object          |             |
| `data.imageId`                             | string          |             |
| `data.damageId`                            | string          |             |
| `data.polygons`                            | \[\[\[number]]] |             |
| `data.boundingBox`                         | Object          |             |
| `data.boundingBox.width`                   | Object          |             |
| `data.boundingBox.height`                  | Object          |             |
| `data.newImage`                            | Object          |             |
| `data.newImage.name`                       | Object          |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "views": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "imageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "damageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "polygons": [[[0]]],
        "boundingBox": {
          "xmin": 0,
          "ymin": 0,
          "width": 0,
          "height": 0
        },
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

## deleteOne
`DELETE /inspections/${inspectionId}/views/${id}`

```javascript
await monk.view.deleteOne({ id, inspectionId });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/View/delete_view)

| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `id`                 | string   |             |
| `inspectionId`       | string   |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "views": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "deleted": true,
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
