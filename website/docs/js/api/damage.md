---
id: damage
title: "Damage"
slug: /js/api/damage
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

```js
import monk from '@monkvision/corejs'

const { createOne, deleteOne } = monk.entity.damage;
```

## createOne
`POST /inspections/${inspectionId}/damages`

Add damage to an inspection.

```javascript
await monk.entity.damage.createOne(inspectionId, data);
```

[Try it on api.monk.ai documentation](https://api.monk.ai/v1/apidocs/#/Damage/post_damage)

| **name**       | **type**     | **default** |
|----------------|--------------|-------------|
| `inspectionId` | string       |             |
| `data`         | CreateDamage |             |

```json
{
  "axiosResponse": {},
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

Remove damage from an inspection.

```javascript
await monk.entity.damage.deleteOne(id, inspectionId);
```

[Try it on api.monk.ai documentation](https://api.monk.ai/v1/apidocs/#/Damage/delete_damage)

| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `inspectionId`       | string   |             |
| `id`                 | string   |             |

```json
{
  "axiosResponse": {},
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
