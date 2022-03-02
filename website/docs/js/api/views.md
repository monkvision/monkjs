---
id: views
title: "Views"
slug: /js/api/views
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## createOne
`POST /inspections/${inspectionId}/views`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.views.createOne({ inspectionId, data });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/View/post_view)

### Body data
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `data`               | Object   |             |
| `data.imageId`       | string   |             |
| `data.damageId`      | string   |             |
| `data.polygons`      | [[[number]]]   |       |
| `data.boundingBox`   | Object   |             |
| `data.boundingBox.width`   | Object   |       |
| `data.boundingBox.height`   | Object   |      |
| `data.newImage`      | Object   |             |
| `data.newImage.name`   | Object |             |
| `data.newImage.rotate_image_before_upload`   | Object   | |
| `requestConfig`      | Object   |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "object_type": "ANNOTATION_TYPE"
    }
  },
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "views": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "imageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "newImage": {
          "name": "string",
          "rotate_image_before_upload": "NO_ROTATION"
        },
        "damageId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "polygons": [
          [
            [
              0
            ]
          ]
        ],
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
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.views.deleteOne({ inspectionId, id });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/View/delete_view)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `id`                 | string   |             |
| `inspectionId`       | string   |             |
| `requestConfig`      | Object   |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "object_type": "ANNOTATION_TYPE"
    }
  },
  "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
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