# @monkvision/analytics
This package provides an abstraction layer for the Analytics features in the MonkJs ecosystem. If you plan on using any
of these features, you can use this package to properly set up the Analytics inside your application.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/analytics
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# Analytics Adapters
A Analytics Adapter is a tool that helps your application use Analytics features such as tracking user event/behavior, etc.
In this package, we define an interface that describes the requirements for a Analytics Adapter to be usable by Monk.

When setting up the Analytics in your application, you need to specify the Analytics Adapter you want to use. This
package provides a super basic adapter :

- The `EmptyAnalyticsAdapter` that does nothing

Monk also provides another adapter, called the `PosthogAnalyticsAdapter`, that connects your application to Posthog, a
well known Analytics platform. If you want to use this adapter, take a look at the `@monkvision/posthog` package.

# Basic Usage
## Set Up
In order to configure the Analytics inside your application, you first need to instantiate the Analytics Adapter you
want to use, and then wrap your root component in the `AnalyticsProvider` and passing it the adapter as a prop :

```tsx
import { EmptyAnalyticsAdapter, AnalyticsProvider } from '@monkvision/analytics';

const adapter = new EmptyAnalyticsAdapter();

const container = document.getElementById('root');
render((
  <AnalyticsProvider adapter={adapter}>
    <App/>
  </AnalyticsProvider>
), container);
```

## useAnalytics hook
Once you have wrapped up your application in the `AnalyticsProvider` component, you can now access every Analytics
features in your app components using the `useAnalytics` hook :

```tsx
import { useAnalytics } from '@monkvision/Analytics';

function MyCustomComponent() {
  const {
    setUserId,
    setUserProperties,
    resetUser,
    trackEvent,
    setEventsProperties,
  } = useAnalytics();
}
```

You can refer to the API section below to get more info on how these functions work.

# Creating Your Own Adapter
If you want to create your own Analytics Adapter, you just have to implement the `AnalyticsAdapter` interface provided
by this package :

```typescript
import { AnalyticsAdapter } from '@monkvision/Analytics';

class MyCustomAnalyticsAdapter implements AnalyticsAdapter {
  setUserId(id: string, context?: Record<string, Primitive>): void{
    // Set the current user ID
  }

  setUserProperties(context: Record<string, Primitive>): void {
    // Set the current user properties/tags
  }

  resetUser(): void{
    // Unlink the user
  };

  trackEvent(name: string, context?: Record<string, Primitive>): void {
    // Create a event for tracking
  }

  setEventsProperties(context: Record<string, Primitive>): void {
    // Set properties for every events
  }
}
```

Note that all the methods and features of the AnalyticsAdapter interface are required. If you plan on creating a
custom adapter that does not implement all features, you can extend the `EmptyAnalyticsAdapter` class :

```typescript
import { EmptyAnalyticsAdapter } from '@monkvision/analytics';

class MyCustomAnalyticsAdapter extends EmptyAnalyticsAdapter {
  override setUserId(id: string, context?: Record<string, Primitive>): void {
    // ...
  }
}
```

Note that when doing so, the unimplemented methods will work : even though they will do nothing, they won't throw any
error. If you try to use one of the features that is not implemented, a warning will be displayed in the console
indicating that the feature is not supported by the current Analytics Adapter. This behavior can be configured in the
options given to the `EmptyAnalyticsAdapter` constructor.

# API
## Analytics Methods
This section describes the methods available in the `AnalyticsAdapter` interface.

#### setUserId
```typescript
setUserId: (id: string, context?: Record<string, Primitive>) =>  void
```

This method defines the current user using the application. Users are identified by a unique string ID. An optional context can be provided that can contain tags or properties associated to the user.

#### setUserProperties
```typescript
setUserProperties: (context: Record<string, Primitive>) => void
```

This method defines the properties or tags of the user using the application.

#### resetUser
```typescript
resetUser: () => void
```

This method unlink any future events made on that device with that user.

#### trackEvent
```typescript
trackEvent: (name: string, context?: Record<string, Primitive>) => void
```

This method track a event and send it to the analytics tool. The name of the event is required and an optional context can be provided that can contain tags or properties associated to the event.

#### setEventsProperties
```typescript
trackEvent: (context: Record<string, Primitive>) => void
```

This method set properties that will be sent with every `trackEvent`.

## Analytics Adapters
### EmptyAnalyticsAdapter
#### Description
This is an empty Analytics Adapter, that does nothing when used. If you use one of the Analytics features with this
adapter a warning will be displayed in the console by default, indicating that the feature is not supported. You can use
this adapter directly in your app, or you can extend it to create your own partial adapter.

#### Config Options
| Option                          | Description                                                                              | Default Value |
| ------------------------------- | ---------------------------------------------------------------------------------------- | ------------- |
| `showUnsupportedMethodWarnings` | Indicates if warnings should be displayed in the console when using unsupported feature. | `true`        |

#### Examples of Usage
```tsx
import { EmptyAnalyticsAdapter, AnalyticsProvider } from '@monkvision/Analytics';
const adapter = new EmptyAnalyticsAdapter();

const container = document.getElementById('root');
render((<AnalyticsProvider adapter={adapter}><App/></AnalyticsProvider>), container);
```

```typescript
import { EmptyAnalyticsAdapter } from '@monkvision/analytics';

class MyCustomAnalyticsAdapter extends EmptyAnalyticsAdapter {
  override setUserId(id: string, context?: Record<string, Primitive>): void {
    // ...
  }
}
```
