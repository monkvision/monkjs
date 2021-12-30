---
id: inspections
title: "Inspections"
slug: /js/api/inspections
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## getOneInspectionById
`GET /inspections/${id}`

Returns an inspection with all its tasks.

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.inspections.getOne({ id, params });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_inspection)

## getAllInspections
`GET /inspections`

Returns all inspections created by user/organization.

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.inspections.getAll({ params });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_all_inspections)

## createOneInspection
`POST /inspections`

An inspection contains data about the state of a vehicle at a given time. Returns a unique inspection id.

> You must create an inspection with the list of all the tasks
you will ever want to apply on this inspection.
You can add images directly or add images later.
You must specify on the images also what task you want to apply to the image.
When a task have started it is too late to edit it
or to add more image on which you want to apply task.


```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.inspections.createOne({ data });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

## updateOneInspection
`POST /inspections`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.inspections.updateOne({ data });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

## deleteOneInspection
`DELETE /inspections/${id}`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.inspections.deleteOne({ id });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/delete_inspection)
