---
id: image
title: "Image"
slug: /js/api/image
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

```js
import monk from '@monkvision/corejs'

const { getMany, createOne } = monk.entity.image;
```

## getMany
`GET /inspections/${inspectionId}/images`

Get all images from an inspection.

```javascript
await monk.image.getMany({ inspectionId, params });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/get_images_of_inspection)

| **name**                 | **type**        | **default** |
|--------------------------|-----------------|-------------|
| `inspectionId`           | string          |             |
| `params`                 | Object          |             |
| `params.limit`           | number          | 100         |
| `params.before`          | $uuid: {string} |             |
| `params.after`           | $uuid: {string} |             |
| `params.paginationOrder` | "asc" or "desc" | desc        |

```json
{
  "axiosResponse": {
    "data": [],
    "paging": {
      "cursors": {},
      "previous": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "next": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  },
  "entities": {
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "path": "string",
        "name": "string",
        "imageHeight": 0,
        "imageWidth": 0,
        "binarySize": 0,
        "mimetype": "string"
      }
    }
  }
}
```

## createOne
`POST /inspections/${inspectionId}/images`

Add image to an inspection.

```javascript
await monk.image.createOne({ inspectionId, data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/add_image_to_inspection)

### Body data
| **name**                                 | **type**   | **default** |
|------------------------------------------|------------|-------------|
| `inspectionId`                           | string     |             |
| `data`                                   | Object     |             |
| `data.name`                              | string     |             |
| `data.acquisition`                       | Object     |             |
| `data.acquisition.strategy`              | string     |             |
| `data.acquisition.fileKey`               | string     |             |
| `data.acquisition.url`                   | string     |             |
| `data.tasks`                             | \[Object\] |             |
| `data.damageArea`                        | Object     |             |
| `data.additionalData`                    | Object     |             |
| `data.compliances`                       | Object     |             |
| `data.compliances.iqa_compliance`        | Object     |             |
| `data.compliances.coverage_360`          | Object     |             |
| `data.compliances.coverage_360.sight_id` | string     |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "name": "string",
        "rotateImageBeforeUpload": "NO_ROTATION",
        "tasks": [],
        "compliances": {
          "image_quality_assessment": {},
          "coverage_360": {
            "sight_id": "GHbWVnMB"
          }
        },
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "inspection": {}
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
