---
id: damages
title: "Damages"
slug: /js/api/damages
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## createOne
`POST /inspections/${inspectionId}/damages`

Add a damage to an inspection

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.damages.createOne({ inspectionId, data });
}
```

[Try it on api.monk.ai documentation](https://api.monk.ai/v1/apidocs/#/Damage/post_damage)

### Body data
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `data`               | Object   |             |
| `data.damageType`    | string   |             |
| `data.partType`      | Object   |             |
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
    "damages": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "damageType": "body_crack",
        "partType": "ignore",
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "parts": []
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

## deleteOne
`DELETE /inspections/${inspectionId}/damages/${id}`

Remove a damage from an

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkApi.damages.deleteOne({ id, inspectionId });
}
```

  [Try it on api.monk.ai documentation](https://api.monk.ai/v1/apidocs/#/Damage/delete_damage)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `id`                 | string   |             |
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
    "damages": {
      "3fa85f64-5717-4562-b3fc-2c963f66afa6": {
        "deleted": true,
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "parts": []
      }
    }
  },
  "result": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```
