---
id: tasks
title: "Tasks"
slug: /js/api/tasks
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/corejs/latest.svg)

```yarn
yarn add @monkvision/corejs
```

## getOnInspectionTask
`GET /inspections/${inspectionId}/tasks/${taskName}`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.tasks.getOne({ inspectionId, taskName });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_task_of_inspection)

## getAllInspectionTasks
`GET /inspections/${inspectionId}/tasks`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.tasks.getAll({ inspectionId });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/get_tasks_of_inspection)

## updateOneTaskOfInspection
`PATCH /inspections/${inspectionId}/tasks/${taskName}`

```javascript
import { monkApi } from '@monkvision/corejs';

const handleRequest = async () => {
  await monkapi.tasks.updateOne({
    inspectionId,
    taskName,
    data,
  });
}
```

[Try it on api.monk.ai](https://api.monk.ai/v1/apidocs/#/Inspection/edit_task)
