---
id: images
title: "Images"
slug: /js/api/images
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```


## getMany
`GET /inspections/${inspectionId}/images`

Get all images from an existing inspection.
You must provide the id of the inspection.

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.images.getMany({ inspectionId, params });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/get_images_of_inspection)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `params`             | Object   |             |
| `params.limit`       | number   | 100         |
| `params.before`      | $uuid: {string} |      |
| `params.after`       | $uuid: {string} |      |
| `params.paginationOrder`    | "asc" or "desc" | desc |
| `requestConfig`      | "asc" or "desc" | desc |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "path": "string",
        "name": "string",
        "image_height": 0,
        "image_width": 0,
        "binary_size": 0,
        "mimetype": "string"
      }
    ],
    "paging": {
      "cursors": {
        "before": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "after": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "next": {
          "limit": 0,
          "before": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "after": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "pagination_order": "desc"
        },
        "previous": {
          "limit": 0,
          "before": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "after": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "pagination_order": "desc"
        }
      },
      "previous": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "next": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    }
  },
  "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "images": {
        "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "path": "string",
          "name": "string",
          "image_height": 0,
          "image_width": 0,
          "binary_size": 0,
          "mimetype": "string"
        }
    }
  }
}
```

## createOne
`POST /inspections/${inspectionId}/images`

Add an image to an existing inspection.
You must provide the id of the inspection.
The response is a unique image id.

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.images.createOne({ inspectionId, data });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/add_image_to_inspection)

### Body data
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `data`               | Object   |             |
| `data.name`          | string   |             |
| `data.acquisition`   | Object   |             |
| `data.acquisition.strategy`  | string   |     |
| `data.acquisition.fileKey`   | string   |     |
| `data.acquisition.url`       | string   |     |
| `data.tasks`         |\[Object\]|             |
| `data.damageArea`    | Object   |             |
| `data.additionalData`| Object   |             |
| `data.compliances`   | Object   |             |
| `data.compliances.iqa_compliance`   | Object |             |
| `data.compliances.coverage_360`     | Object |             |
| `data.compliances.coverage_360.sight_id`     | string |    |
| `requestConfig`     | Object    |             |

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
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "name": "string",
        "rotateImageBeforeUpload": "NO_ROTATION",
        "tasks": [
          {
            "name": "damage_detection",
            "image_details": {
              "viewpoint_name": "string"
            }
          },
          {
            "name": "images_ocr"
          },
          "damage_detection"
        ],
        "compliances": {
          "image_quality_assessment": {},
          "coverage_360": {
            "sight_id": "GHbWVnMB"
          }
        },
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "inspection": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        }
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```