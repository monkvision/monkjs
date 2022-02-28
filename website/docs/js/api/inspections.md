---
id: inspections
title: "Inspection"
slug: /js/api/inspections
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## getOne({ id, params })
`GET /inspections/${id}`

Returns an inspection with all its tasks.

```javascript
const id = 'one-valid-inspection-id'
const res = await monkApi.inspections.getOne({ id });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_inspection)

### Query params
| **name**             | **type** | **default** |
|----------------------|----------|-------------|
| `showDeletedObjects` | boolean  | false       |

### Response schema


## getMany({ params })
`GET /inspections`

Returns all inspections created by user/organization.

```javascript
const res = await monkApi.inspections.getMany({});
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_all_inspections)

### Query params
| **name**                       | **type**        | **default** |
|--------------------------------|-----------------|-------------|
| `before`                       | $uuid: {string} |             |
| `after`                        | $uuid: {string} |             |
| `paginationOrder`              | "asc" or "desc" | desc        |
| `allInspections`               | boolean         | false       |
| `allInspectionsInOrganization` | boolean         | false       |

### Response schema

## createOne({ data })
`POST /inspections`

An inspection contains data about the state of a vehicle at a given time. Returns a unique inspection id.

> You must create an inspection with the list of all the tasks
you will ever want to apply on this inspection.
You can add images directly or add images later.
You must specify on the images also what task you want to apply to the image.
When a task have started it is too late to edit it
or to add more image on which you want to apply task.


```javascript
const data = { tasks, images, vehicle, damageAreas };
const res = await monkApi.inspections.createOne({ data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

### Body data
| **name**                 | **type**   | **default** |
|--------------------------|------------|-------------|
| `tasks`                  | Object     |             |
| `tasks.damage_detection` | Object     |             |
| `tasks.wheel_analysis`   | Object     |             |
| `tasks.damage_detection` | Object     |             |
| `tasks.images_ocr`       | Object     |             |
| `images`                 | \[Object\] |             |
| `vehicle`                | Object     |             |
| `damageAreas`            | \[Object\] |             |

### Response schema

## updateOne({ data })
`POST /inspections`

```javascript
const data = { id, tasks, images, vehicle, damageAreas };
const res = await monkApi.inspections.updateOne({ data });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/post_inspection)

## deleteOne({ id )
`DELETE /inspections/${id}`

```javascript
const id = 'one-valid-inspection-id'
const res = await monkApi.inspections.updateOne({ id });
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/delete_inspection)
