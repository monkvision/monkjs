---
sidebar_position: 4
title: Task
hide_title: true
---

:::caution

This section refers to the old versions of the MonkJs SDK (version `3.X.X` and below). For the v4 docs, please refer to
[this page](docs/introduction.md).

:::

# Task

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

```js
import monk from '@monkvision/corejs'

const { getOne, getMany, updateOne } = monk.entity.task;
```

## getOne
`GET /inspections/${inspectionId}/tasks/${taskName}`

Get one task of an inspection.

```javascript
await monk.task.getOne(inspectionId, name);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_task_of_inspection)

| **name**       | **type** | **default** |
|----------------|----------|-------------|
| `inspectionId` | string   |             |
| `name`         | TaskName |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "createdAt": "2022-03-01T12:28:49.469Z",
        "status": "NOT_STARTED",
        "startedAt": "2022-03-01T12:28:49.469Z",
        "confidencePreExecution": true,
        "confidencePreExecutionStatus": "NOT_STARTED",
        "confidencePostExecution": true,
        "doneAt": "2022-03-01T12:28:49.469Z",
        "name": "damage_detection",
        "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": []
      }
    }
  }
}
```

## getMany
`GET /inspections/${inspectionId}/tasks`

Get all tasks of an inspection.

```javascript
await monk.task.getMany(inspectionId);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_tasks_of_inspection)

| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "createdAt": "2022-03-01T12:28:49.469Z",
        "status": "NOT_STARTED",
        "startedAt": "2022-03-01T12:28:49.469Z",
        "confidencePreExecution": true,
        "confidencePreExecutionStatus": "NOT_STARTED",
        "confidencePostExecution": true,
        "doneAt": "2022-03-01T12:28:49.469Z",
        "name": "damage_detection",
        "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": []
      },
      "3fa85f64-5717-4562-b3fc-2c963f66afa7": {
        "name": "wheel_analysis"
      },
      "3fa85f64-5717-4562-b3fc-2c963f66afa8": {
        "name": "repair_estimate"
      },
      "3fa85f64-5717-4562-b3fc-2c963f66afa9": {
        "name": "image_ocr"
      }
    }
  }
}
```

## updateOne
`PATCH /inspections/${inspectionId}/tasks/${taskName}`

Update one task of an inspection.

```javascript
await monk.task.updateOne(inspectionId, name , data);
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/edit_task)

| **name**           | **type**             | **default** |
|--------------------|----------------------|-------------|
| `inspectionId`     | string               |             |
| `name`             | string               |             |
| `data`             | UpdateTask           |             |
| - `data.status`    | ProgressStatusUpdate |             |
| - `data.arguments` |                      |             |

```json
{
  "axiosResponse": {},
  "entities": {
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {}
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

## Enums
### TaskName
`string`
```ts
enum TaskName {
  DAMAGE_DETECTION = 'damage_detection',
  WHEEL_ANALYSIS = 'wheel_analysis',
  REPAIR_ESTIMATE = 'repair_estimate',
  IMAGES_OCR = 'images_ocr',
}
```
