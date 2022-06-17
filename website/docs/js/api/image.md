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
await monk.image.getMany(inspectionId, options);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/get_images_of_inspection)

| **name**                    | **type**                            | **default** |
|-----------------------------|-------------------------------------|-------------|
| `inspectionId`              | string                              |             |
| `options`                   | GetManyImagesOptions                |             |
| - `options.limit`           | number                              | 100         |
| - `options.before`          | string                              |             |
| - `options.after`           | string                              |             |
| - `options.paginationOrder` | [PaginationOrder](#paginationorder) | 'desc'      |

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

## addOne
`POST /inspections/${inspectionId}/images`

Add image to an inspection.

```javascript
await monk.image.addOne({ inspectionId, data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Image/add_image_to_inspection)

| **name**                                 | **type**                                    | **default** |
|------------------------------------------|---------------------------------------------|-------------|
| `inspectionId`                           | string                                      |             |
| `data`                                   | CreateImage                                 |             |
| - `data.name`                            | string                                      |             |
| - `data.acquisition`                     | [ImageAcquisition](#imageacquisition)       |             |
| - `data.tasks`                           | \[[CreateImageTask](#createimagetask)\]     |             |
| - `data.damageArea`                      | number / string / [DamageArea](#damagearea) |             |
| - `data.additionalData`                  | Object                                      |             |
| - `data.compliances`                     | [Compliance](#compliance)                   |             |

### ImageAcquisition

| **name**   | **type**            | **default** |
|------------|---------------------|-------------|
| `strategy` | string              |             |
| `fileKey`  | string              |             |
| `url`      | string              |             |

### CreateImageTask
[NoParametersImageTaskName](#noparametersimagetaskname) | [CreateImageWheelTaskWithParam](#createimagewheeltaskwithparams) | [CreateImageOcrTaskWithParam](#createimageocrtaskwithparams) | [CreateImageDamageTaskWithParam](#createimagedamagetaskwithparams)

#### NoParametersImageTaskName
```string```
NoParametersImageTaskName is an enumeration of the task type and can be:
* "damage_detection"
* "wheel_analysis"
* "repair_estimate"
* "image_ocr"

#### CreateImageWheelTaskWithParams
| **name**                   | **type**             | **default** |
|----------------------------|----------------------|-------------|
| `name`                     | string               |             |
| `imageDetails`             | WheelAnalysisDetails |             |
| - `imageDetails.wheelName` | string               |             |

#### CreateImageOcrTaskWithParams
| **name**                         | **type**                 | **default** |
|----------------------------------|--------------------------|-------------|
| `name`                           | string                   |             |
| `imageDetails`                   | ImageOCRTaskImageDetails |             |
| - `imageDetails.imageType`       | string                   |             |
| - `imageDetails.documentId`      | number                   |             |
| - `imageDetails.locationDetails` | string                   |             |

#### CreateImageDamageTaskWithParams
| **name**                          | **type**                        | **default** |
|-----------------------------------|---------------------------------|-------------|
| `name`                            | string                          |             |
| `imageDetails`                    | DamageDetectionTaskImageDetails |             |
| - `imageDetails.viewpointName`    | string                          |             |
| - `imageDetails.viewpointDetails` | unknown                         |             |

### DamageArea
| **name**                              | **type**   | **default** |
|---------------------------------------|------------|-------------|
| `id`                                  | string     |             |
| `relevantElements`                    | \[string\] |             |

### Compliance
| **name**                 | **type**              | **default** |
|--------------------------|-----------------------|-------------|
| `imageQualityAssessment` | ComplianceParameters  |             |
| `coverage360`            | Coverage360Parameters |             |
| - `coverage360.sightId`  | string                |             |


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

## Enums
### PaginationOrder
`string`
```ts
enum PaginationOrder {
  ASC = 'asc',
  DESC = 'desc',
}
```
