# @monkvision/common
This package contains logic and bits of code shared accross the MonkJs project.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/common
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# State Management
This package exports tools that help you manage the state of MonkJs applications. In Monk projects, the state of an
inspection and everything that goes with it is represented by a set of different entities. The complete list of entities
available in what we call the "Monk State" is available in the @monkvision/types package.

The "Monk State" (described in this package by the `MonkState` interface) is simply the list of all entities currently
stored in the state of your application. This package exports tools that help you initialize, access and update the
Monk state.

## MonkProvider component
This package exports a component called `MonkProvider` which is a context provider that will let you access and use the
Monk state in your application. We recommend placing this provider at the top of your application :

```typescript jsx
import { MonkProvider } from '@monkvision/common';

function RootComponent() {
  return (
    <MonkProvider>
      ...
    </MonkProvider>
  )
}
```

After placing this provider in your code, the Monk state will be accessible using the `useMonkState` hook described
below. This provider will initialize the Monk state with empty values (no entities) by default, but you can pass an
optional `initialState` prop to the provider to initialize the satte with custom values.

> Important note : If the Monk state context has already been defined previously, this Monk provider component will
> have no effect. This is because packages of the MonkJs project use this provider internally to set up the state, even
> if you do not use it in your app.

## useMonkState hook
Once you have initialized the Monk state in your app using the `MonkProvider` component, you can access the state using
the `useMonkState` hook as follows :

```typescript jsx
import { useMonkState } from '@monkvision/common';

function MyComponent() {
  const { state, dispatch } = useMonkState();
  ...
}
```

This hook behaves similarly to the `useReducer` React hook, and will return two values :
- `state` : The Monk state object, that updates automatically when an action is dispatched
- `dispatch` : A dispatch function that will let you dispatch `MonkAction` objects to update the state

The list of actions that can be dispatched is described in the *Monk state actions* section below.

> Important note : This hook will throw an error if called in a component where the MonkContext has not been initialized
> previously by a MonkProvider

## Monk state actions
There are 4 types of actions that can be dispatched in the Monk state. Every action must at least contain the following
properties :

- `type` : The type of action dispatched (described by the `MonkActionType` enum).
- `entityType` : The type of entity affected by this action (described by the `MonkEntityType` enum).

### GOT_ONE_ENTITY
This action is designed to be dispatched when an entity has just been fetched. When this action is dispatched, if an
entity with the same ID is already present in the state, it will be updated, if not, it will be created.

```typescript
import { Inspection, MonkEntityType } from '@monkvision/types';
import { MonkGotOneAction, MonkActionType } from '@monkvision/common';

const action: MonkGotOneAction<Inspection> = {
  type: MonkActionType.GOT_ONE_ENTITY,
  entityType: MonkEntityType.INSPECTION,
  entity: inspection,
}
```

In addition to the common Monk action fields, this action contains a field called `entity` which should contain the
entity that has been fetched. Note : In TypeScript, the `MonkGotOneAction` interface is generic, and you must specify
the type of the entity related to the action. The TypeScript action and entity types HAVE to match with their enum
values specified in the action fields.

### GOT_MANY_ENTITIES
This action is designed to be dispatched when multiple entities have just been fetched. When this action is dispatched,
for each entity, if an entity with the same ID is already present in the state, it will be updated, if not, it will be
created.

```typescript
import { Image, MonkEntityType } from '@monkvision/types';
import { MonkGotManyAction, MonkActionType } from '@monkvision/common';

const action: MonkGotManyAction<Image> = {
  type: MonkActionType.GOT_ONE_ENTITY,
  entityType: MonkEntityType.IMAGE,
  entities: images,
}
```

In addition to the common Monk action fields, this action contains a field called `entities` which should contain an
array of the entities that have been fetched. Note : In TypeScript, the `MonkGotManyAction` interface is generic, and
you must specify the type of the entity related to the action. The TypeScript action and entity types HAVE to match
with their enum values specified in the action fields.

### DELETED_ONE_ENTITY
This action is designed to be dispatched when an entity has just been deleted. When this action is dispatched, if an
entity with the specified ID exists, it will be deleted.

```typescript
import { Image, MonkEntityType } from '@monkvision/types';
import { MonkDeletedOneAction, MonkActionType } from '@monkvision/common';

const action: MonkDeletedOneAction = {
  type: MonkActionType.DELETED_ONE_ENTITY,
  entityType: MonkEntityType.IMAGE,
  id: '...',
}
```

In addition to the common Monk action fields, this action contains a field called `id` which should contain the ID of
the entity that has been deleted.

### DELETED_MANY_ENTITIES
This action is designed to be dispatched when multiple entities have just been deleted. When this action is dispatched,
for each entity ID, if an entity with this ID exists, it will be deleted.

```typescript
import { Image, MonkEntityType } from '@monkvision/types';
import { MonkDeletedManyAction, MonkActionType } from '@monkvision/common';

const action: MonkDeletedManyAction = {
  type: MonkActionType.DELETED_MANY_ENTITIES,
  entityType: MonkEntityType.IMAGE,
  ids: ['...', '...'],
}
```

In addition to the common Monk action fields, this action contains a field called `ids` which should contain the list o
IDs of the deleted entities.

# Event Handling
The main components available in the MonkJs project usually come with a set of events that they can fire. For instance,
when the Camera component (available in the @monkvision/camera package) takes a picture, it will fire a "picture taken"
event. In order to simplify the event handling in the MonkJs project, each component can take an "event handler" as an
optional prop. An event handler is an object that maps event names (for instance `onPictureTaken`) to callback
functions. For TypeScript, each package will define the proper type definitions for its event handler, which will
contain the list of events as well as the signatures of their callbacks.

This package exports a function called `mergeEventHandlers`, which takes a list of event handlers of the same type, and
will return a single event handler that combines the callbacks of all the handlers in the list. For instance, if you
have the following event handlers :

- `handler1` that executes `onA_1()` when event `A` is fired
- `handler2` that executes `onA_2()` when event `A` is fired, and `onB_2()` when event `B` is fired

Then the call `mergeEventHandlers([handler1, handler2])` will return a new event handler that will execute `onA_1()` AND
`onA_2()` when event `A` is fired, and `onB_2()` when event `B` is fired.
