# State Management
This README page is aimed at providing documentation on a specific part of the `@monkvision/common` package : the state
management. You can refer to [this page](README.md) for more general information on the package.

This package exports tools that help you manage the state of MonkJs applications. In Monk projects, the state of an
inspection and everything that goes with it is represented by a set of different entities. The complete list of entities
available in what we call the "Monk State" is available in the @monkvision/types package.

The "Monk State" (described in this package by the `MonkState` interface) is simply the list of all entities currently
stored in the state of your application. This package exports tools that help you initialize, access and update the
Monk state.

## MonkProvider component
This package exports a component called `MonkProvider` which is a context provider that will let you access and use the
Monk state in your application. We recommend placing this provider at the top of your application :

```tsx
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

# useMonkState hook
Once you have initialized the Monk state in your app using the `MonkProvider` component, you can access the state using
the `useMonkState` hook as follows :

```tsx
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

# Monk state actions
This section enumerates the available actions that can be dispatched in the MonkState.

## ResetState Action
This action can be dispatched in order to completely reset the MonkState and clear all stored entities. This action does
not need any payload.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: MonkResetStateAction = {
  type: MonkActionType.RESET_STATE,
}
```

## GotOneInspection Action
This action can be dispatched when details about an inspection have been fetched from the API. The payload of this
action is actually a partial MonkState containing details about every entity fetched with this inspection.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: Monk = {
  type: MonkActionType.GOT_ONE_INSPECTION,
  payload: {
    inspections: [...],
    images: [...],
    ...
  }
}
```

## CreatedOneImage Action
This action can be dispatched after an image has been created and uploaded to the API. The payload of this action should
contain the details about the image that has been created, as well as the ID of the inspection. You can also start by
creating a local image (with a custom local ID), and then update this image when the API has returned the actual ID of
the image. To do so, re-dispatch another time the same action, but with the new Id and the property `localId` in the
payload containing the previous ID assigned to the image when it was created locally.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: Monk = {
  type: MonkActionType.CREATED_ONE_IMAGE,
  payload: {
    inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
    image: {...},
  }
}
```

## UpdatedManyTasks Action
This action can be dispatched after one or multiple tasks' statuses have been updated. The payload of this action should
be an array containing the details of the tasks that have been updated.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';
import { ProgressStatus } from '@monkvision/types';

const action: Monk = {
  type: MonkActionType.CREATED_ONE_IMAGE,
  payload: [
    { id: '2b2ac131-c613-41a9-ac04-d00b942e2290', status: ProgressStatus.IN_PROGRESS },
    { id: '4097bc0e-02d0-4ed8-9411-b18f0cb922f2', status: ProgressStatus.IN_PROGRESS },
  ]
}

```
## CreatedOnePricing Action
This action can be dispatched after pricing has been created and uploaded to the API. Similar to the image, you can
first create a local pricing entry with a custom local ID and then update it once the API returns the actual ID.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';
import { PricingV2RelatedItemType} from '@monkvision/types';

const action: Monk = {
  type: MonkActionType.CREATED_ONE_PRICING,
  payload: {
    pricing: {
      entityType: MonkEntityType.PRICING,
      id: '2b2ac131-c613-41a9-ac04-d00b942e2290',
      inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
      relatedItemType: PricingV2RelatedItemType.PART,
      pricing: 500,
    },
  }
};
```

##  UpdatedOnePricing Action
This action can be dispatched after a pricing entry has been updated. The payload should contain the details of the
pricing that has been updated along with the inspection ID.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: Monk = {
  type: MonkActionType.UPDATED_ONE_PRICING,
  payload: {
    inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
    pricing: {
      id: 'pricing-id',
      ...updatedPricingDetails,
    },
  }
};

```

## DeletedOnePricing Action
This action can be dispatched after a pricing entry has been deleted from the API. The payload contains the ID of the
inspection and the ID of the pricing that was deleted.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: Monk = {
  type: MonkActionType.DELETED_ONE_PRICING,
  payload: {
    inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
    pricingId: 'pricing-id-to-be-deleted',
  }
};

```

## CreatedOneDamage Action
This action can be dispatched after a damage has been created and uploaded to the API. You can start with a locally
created damage and update it later once the API returns the actual ID.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: Monk = {
  type: MonkActionType.CREATED_ONE_DAMAGE,
  payload: {
    inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
    damage: {
      entityType: MonkEntityType.DAMAGE,
      id: '2b2ac131-c613-41a9-ac04-d00b942e2290',
      inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
      parts: [VehiclePart.BUMPER_BACK],
      relatedImages: [],
      type: DamageType.BODY_CRACK,
    },
  }
};
```

## DeletedOneDamage Action
This action can be dispatched after a damage entry has been deleted from the API. The payload contains the ID of the
inspection and the ID of the damage that was deleted.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';

const action: Monk = {
  type: MonkActionType.DELETED_ONE_DAMAGE,
  payload: {
    pricing: {
      entityType: MonkEntityType.PRICING,
      id: '2b2ac131-c613-41a9-ac04-d00b942e2290',
      inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
      relatedItemType: PricingV2RelatedItemType.PART,
      pricing: 800,
    },
  }
};
```

## UpdatedOneInspectionAdditionalData Action
This action can be dispatched after the additional data of an inspection has been updated in the API. The payload
contains the ID of the inspection and any additional data used for the update.

```typescript
import { MonkResetStateAction, MonkActionType } from '@monkvision/common';
import { AdditionalData } from '@monkvision/types';

const action: Monk = {
  type: MonkActionType.UPDATED_ONE_INSPECTION_ADDITIONAL_DATA,
  payload: {
    inspectionId: 'e1cb2852-77f3-4fb5-a851-e700cf31a7d1',
    additionalData: {
      someKey: 'someValue',
      ...otherData,
    },
  },
};
```
