---
id: inspections
title: "Inspections"
slug: /js/api/inspections
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## getOne()
`GET /inspections/${id}`

Returns an inspection with all its tasks.

```javascript
const id = 'one-valid-inspection-id'
const res = await monkApi.inspections.getOne({ id });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_inspection)

## getMany()
`GET /inspections`

Returns all inspections created by user/organization.

```javascript
const res = await monkApi.inspections.getMany({});
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_all_inspections)

## createOne()
`POST /inspections`

An inspection contains data about the state of a vehicle at a given time. Returns a unique inspection id.

> You must create an inspection with the list of all the tasks
you will ever want to apply on this inspection.
You can add images directly or add images later.
You must specify on the images also what task you want to apply to the image.
When a task have started it is too late to edit it
or to add more image on which you want to apply task.


```javascript
const data = {};
const res = await monkApi.inspections.createOne({ data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

## updateOne()
`POST /inspections`

```javascript
const data = {};
const res = await monkApi.inspections.updateOne({ data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

## deleteOne()
`DELETE /inspections/${id}`

```javascript
const id = 'one-valid-inspection-id'
const res = await monkApi.inspections.updateOne({ id });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/delete_inspection)
