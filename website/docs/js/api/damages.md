---
id: damages
title: "Damages"
slug: /js/api/damages
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## createOneDamage
`POST /inspections/${inspectionId}/damages`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.damages.createOne({ inspectionId, data });
}
```

[Try it on api.monk.ai documentation](https://api.monk.ai/v1/apidocs/#/Damage/post_damage)

## deleteOneDamage
`DELETE /inspections/${inspectionId}/damages/${id}`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.damages.deleteOne({ id, inspectionId });
}
```

[Try it on api.monk.ai documentation](https://api.monk.ai/v1/apidocs/#/Damage/delete_damage)
