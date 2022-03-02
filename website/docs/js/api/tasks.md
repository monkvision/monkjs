---
id: tasks
title: "Tasks"
slug: /js/api/tasks
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## getOne
`GET /inspections/${inspectionId}/tasks/${taskName}`

Get one task from an inspection

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.tasks.getOne({ inspectionId, name });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_task_of_inspection)


### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `name`               | string   |             |
| `requestConfig`      | Object   |             |

### Response schema
```json
{
  "axiosResponse": {
    "status": "",
    "statusText": "",
    "headers": {},
    "data": {
      "damage_detection": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-03-01T12:28:49.469Z",
        "status": "NOT_STARTED",
        "started_at": "2022-03-01T12:28:49.469Z",
        "confidence_pre_execution": true,
        "confidence_pre_execution_status": "NOT_STARTED",
        "confidence_post_execution": true,
        "done_at": "2022-03-01T12:28:49.469Z",
        "name": "damage_detection",
        "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": [
          {
            "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      },
      "wheel_analysis": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-03-01T12:28:49.469Z",
        "status": "NOT_STARTED",
        "started_at": "2022-03-01T12:28:49.469Z",
        "confidence_pre_execution": true,
        "confidence_pre_execution_status": "NOT_STARTED",
        "confidence_post_execution": true,
        "done_at": "2022-03-01T12:28:49.469Z",
        "name": "damage_detection",
        "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": [
          {
            "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      },
      "repair_estimate": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-03-01T12:28:49.469Z",
        "status": "NOT_STARTED",
        "started_at": "2022-03-01T12:28:49.469Z",
        "confidence_pre_execution": true,
        "confidence_pre_execution_status": "NOT_STARTED",
        "confidence_post_execution": true,
        "done_at": "2022-03-01T12:28:49.469Z",
        "name": "damage_detection",
        "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": [
          {
            "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      }
    }
  },
  "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "name": "task-name",
  "entities": {
    "tasks": {
      "undefined": {
        "damageDetection": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-03-01T12:28:49.469Z",
          "status": "NOT_STARTED",
          "started_at": "2022-03-01T12:28:49.469Z",
          "confidence_pre_execution": true,
          "confidence_pre_execution_status": "NOT_STARTED",
          "confidence_post_execution": true,
          "done_at": "2022-03-01T12:28:49.469Z",
          "name": "damage_detection",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "images": [
            {
              "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          ]
        },
        "wheelAnalysis": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-03-01T12:28:49.469Z",
          "status": "NOT_STARTED",
          "started_at": "2022-03-01T12:28:49.469Z",
          "confidence_pre_execution": true,
          "confidence_pre_execution_status": "NOT_STARTED",
          "confidence_post_execution": true,
          "done_at": "2022-03-01T12:28:49.469Z",
          "name": "damage_detection",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "images": [
            {
              "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          ]
        },
        "repairEstimate": {
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "object_type": "ANNOTATION_TYPE",
          "created_at": "2022-03-01T12:28:49.469Z",
          "status": "NOT_STARTED",
          "started_at": "2022-03-01T12:28:49.469Z",
          "confidence_pre_execution": true,
          "confidence_pre_execution_status": "NOT_STARTED",
          "confidence_post_execution": true,
          "done_at": "2022-03-01T12:28:49.469Z",
          "name": "damage_detection",
          "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          "images": [
            {
              "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
            }
          ]
        },
        "images": []
      }
    }
  }
}
```

## getMany
`GET /inspections/${inspectionId}/tasks`

Get all tasks from an inspection

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.tasks.getMany({ inspectionId });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_tasks_of_inspection)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
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
      "damage_detection": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-03-02T10:39:20.364Z",
        "status": "NOT_STARTED",
        "started_at": "2022-03-02T10:39:20.364Z",
        "confidence_pre_execution": true,
        "confidence_pre_execution_status": "NOT_STARTED",
        "confidence_post_execution": true,
        "done_at": "2022-03-02T10:39:20.364Z",
        "name": "damage_detection",
        "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": [
          {
            "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      },
      "wheel_analysis": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-03-02T10:39:20.364Z",
        "status": "NOT_STARTED",
        "started_at": "2022-03-02T10:39:20.364Z",
        "confidence_pre_execution": true,
        "confidence_pre_execution_status": "NOT_STARTED",
        "confidence_post_execution": true,
        "done_at": "2022-03-02T10:39:20.364Z",
        "name": "damage_detection",
        "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": [
          {
            "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      },
      "repair_estimate": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "object_type": "ANNOTATION_TYPE",
        "created_at": "2022-03-02T10:39:20.364Z",
        "status": "NOT_STARTED",
        "started_at": "2022-03-02T10:39:20.364Z",
        "confidence_pre_execution": true,
        "confidence_pre_execution_status": "NOT_STARTED",
        "confidence_post_execution": true,
        "done_at": "2022-03-02T10:39:20.364Z",
        "name": "damage_detection",
        "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": [
          {
            "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
          }
        ]
      }
    }
  },
  "inspectionId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "entities": {
    "tasks": {
      "undefined": {
        "status": "",
        "statusText": "",
        "headers": {},
        "data": {
          "damage_detection": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-03-02T10:39:20.364Z",
            "status": "NOT_STARTED",
            "started_at": "2022-03-02T10:39:20.364Z",
            "confidence_pre_execution": true,
            "confidence_pre_execution_status": "NOT_STARTED",
            "confidence_post_execution": true,
            "done_at": "2022-03-02T10:39:20.364Z",
            "name": "damage_detection",
            "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "images": [
              {
                "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              }
            ]
          },
          "wheel_analysis": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-03-02T10:39:20.364Z",
            "status": "NOT_STARTED",
            "started_at": "2022-03-02T10:39:20.364Z",
            "confidence_pre_execution": true,
            "confidence_pre_execution_status": "NOT_STARTED",
            "confidence_post_execution": true,
            "done_at": "2022-03-02T10:39:20.364Z",
            "name": "damage_detection",
            "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "images": [
              {
                "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              }
            ]
          },
          "repair_estimate": {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "object_type": "ANNOTATION_TYPE",
            "created_at": "2022-03-02T10:39:20.364Z",
            "status": "NOT_STARTED",
            "started_at": "2022-03-02T10:39:20.364Z",
            "confidence_pre_execution": true,
            "confidence_pre_execution_status": "NOT_STARTED",
            "confidence_post_execution": true,
            "done_at": "2022-03-02T10:39:20.364Z",
            "name": "damage_detection",
            "inspection_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "images": [
              {
                "image_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
              }
            ]
          }
        },
        "images": []
      }
    }
  }
}
```

## updateOne
`PATCH /inspections/${inspectionId}/tasks/${taskName}`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.tasks.updateOne({
    inspectionId,
    name,
    data,
  });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/edit_task)

### Body data
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `name`               | string   |             |
| `data`               | Object   |             |
| `data.status`        | string   |             |
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
    "tasks": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "status": "NOT_STARTED",
        "name": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "images": []
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```