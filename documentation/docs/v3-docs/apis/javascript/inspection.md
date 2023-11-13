---
sidebar_position: 3
title: Inspection
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# Inspection

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

```js
import monk from '@monkvision/corejs'

const { getOne, getMany, upsertOne, addAdditionalDataToOne, deleteOne } = monk.entity.inspection;
```

## getOne
`GET /inspections/${id}`

Returns an inspection with all its tasks.

```javascript
await monk.entity.inspection.getOne(id, { showDeletedObjects });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_inspection)

| **name**                       | **type**                | **default** |
|--------------------------------|-------------------------|-------------|
| `id`                           | string                  |             |
| `options`                      | GetOneInspectionOptions |             |
| - `options.showDeletedObjects` | boolean                 | false       |

## getMany
`GET /inspections`

Returns all inspections created by user/organization.

```javascript
await monk.entity.inspection.getMany(options);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_all_inspections)

| **name**                   | **type**                              | **default**     |
|----------------------------|---------------------------------------|-----------------|
| `options`                  | GetManyInspectionsOptions             |                 |
| `options.ownershipFilter`  | [OwnershipFilter](#ownershipfilter)   | "own_resources" |
| `options.inspectionStatus` | [InspectionStatus](#inspectionstatus) |                 |
| `options.showDeleted`      | boolean                               | true            |
| `options.verbose`          | number                                | 0               |

```json
{
  "axiosResponse": {},
  "entities": {
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "createdAt": "2022-02-28T11:38:53.013Z",
        "deletedAt": "2022-02-28T11:38:53.013Z",
        "images": [
          "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ],
        "ownerId": "string",
        "creatorId": "string"
      }
    },
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
    },
    "damages": []
  },
  "result": []
}
```

## createOne
`POST /inspections`

An inspection contains data about the state of a vehicle at a given time.
Returns a unique inspection id.

> You must create an inspection with the list of all the tasks
you will ever want to apply on this inspection.
You can add images directly or add images later.
You must specify on the images also what task you want to apply to the image.
When a task have started it is too late to edit it
or to add more image on which you want to apply task.


```javascript
await monkApi.inspections.createOne(data);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

| **name** | **type**         | **default** |
|----------|------------------|-------------|
| `data`   | CreateInspection |             |

### CreateInspection

| **name**              | **type**                          | **default** |
|-----------------------|-----------------------------------|-------------|
| `tasks`               | CreateInspectionTaskOptions       |             |
| `vehicle`             | CreateUpdateVehicle               |             |
| `images`              | \[CreateImage\]                   |             |
| `damageAreas`         | \[DamageArea\]                    |             |
| `inspectionType`      | [InspectionType](#inspectiontype) |             |
| `additionalData`      | InspectionAdditionalData          |             |
| `accidentNature`      | string                            |             |
| `relatedInspectionId` | string                            |             |
| `usageDuration`       | number                            |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "images": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "name": "string",
        "rotateImageBeforeUpload": "NO_ROTATION",
        "tasks": []
      }
    },
    "vehicles": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "brand": "string",
        "model": "string",
        "plate": "string",
        "vehicleType": "string",
        "mileage": {
          "value": 0,
          "unit": "km"
        },
        "marketValue": {
          "value": 0,
          "unit": "string"
        },
        "series": "string",
        "vehicleStyle": "string",
        "vehicleAge": "string",
        "vin": "string",
        "color": "string",
        "exteriorCleanliness": "string",
        "interiorCleanliness": "string",
        "dateOfCirculation": "string"
      }
    },
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "status": "NOT_STARTED",
        "damageScoreThreshold": 0,
        "scoring": {},
        "images": []
      }
    },
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "tasks": [],
        "images": [],
        "inspectionType": "claim",
        "accidentNature": "string",
        "relatedInspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "usageDuration": 0,
        "damageAreas": []
      }
    }
  }
}
```

## addAdditionalDataToOne
`PATCH /inspections/${id}/pdf_data`

```javascript
await monk.entity.inspection.addAdditionalDataToOne(id, data);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/edit_inspection_pdf_data)

| **name**                       | **type**     | **default** |
|--------------------------------|--------------|-------------|
| `id`                           | string       |             |
| `data`                         | PdfInputData |             |
| - `data.mileage`               | Mileage      |             |
| - - `data.mileage.value`       | number       |             |
| - - `data.mileage.unit`        | string       |             |
| - `data.marketValue`           | number       |             |
| - - `data.marketValue.value`   | number       |             |
| - - `data.marketValue.unit`    | string       |             |
| - `data.agentFirstName`        | string       |             |
| - `data.agentLastName`         | string       |             |
| - `data.agentCompany`          | string       |             |
| - `data.agentCompanyCity`      | string       |             |
| - `data.vehicleOwnerFirstName` | string       |             |
| - `data.vehicleOwnerLastName`  | string       |             |
| - `data.vehicleOwnerAddress`   | string       |             |
| - `data.vehicleOwnerPhone`     | string       |             |
| - `data.vehicleOwnerEmail`     | string       |             |
| - `data.dateOfStart`           | string       |             |
| - `data.dateOfValidation`      | string       |             |
| - `data.vinOrRegistering`      | string       |             |
| - `data.comment`               | string       |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "images": {},
    "vehicles": {},
    "tasks": {},
    "inspections": {}
  }
}
```

## deleteOne
`DELETE /inspections/${id}`

```javascript
await monk.entity.inspection.deleteOne(id);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/delete_inspection)

| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `id`                 | string   |             |

```json
{
  "axiosResponse": {},
  "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "inspections": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "deleted": true,
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

## Enums
### OwnershipFilter
`string`
```ts
enum OwnershipFilter {
  OWN_RESOURCES = 'own_resources',
  ORGANIZATION_RESOURCES = 'organization_resources',
  ALL_RESOURCES = 'all_resources',
}
```

### InspectionStatus
`string`
```ts
enum InspectionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
  ERROR = 'ERROR',
  VALIDATED = 'VALIDATED',
}
```

### InspectionType
`string`
```ts
enum InspectionType {
  CLAIM = 'claim',
  CHECK_IN_CHECK_OUT = 'check_in_check_out',
}
```

### ProgressStatusUpdate
`string`
```ts
enum ProgressStatusUpdate {
  NOT_STARTED = 'NOT_STARTED',
  TODO = 'TODO',
  DONE = 'DONE',
  VALIDATED = 'VALIDATED',
}
```
