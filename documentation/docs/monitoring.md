---
sidebar_position: 8
---

# Monitoring
The MonkJs SDK automatically keeps track of monitoring events such as errors, console logs and performance measuring.
Internally, we use [Sentry](https://sentry.io/) to monitor our SDK, and you are free to use our Sentry infrastructure
or use the monitoring tool of your need.

## Why Use Monitoring?
Although you have the choice to not opt for our monitoring features when using our SDK, we heavily recommend doing so
for the following reasons :
- It allows you, as a developer, to more easily debug your own app by using our ready-to-use local monitoring providers
- It allows you and us to keep track of errors and performance issues, live in your deployed applications
- Monk does not offer any tech support in deployed applications and projects for which monitoring is disabled

## Enabling Monitoring
In order to enable monitoring support in your application, simply wrap your application in a `MonitoringProvider`
component, exported by the `@monkvision/monitoring`, and pass it the Monitoring Adapter of your choice (see the
Monitoring Adapter section below) :

```tsx
import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';

const adapter = new DebugMonitoringAdapter();

function App() {
  return (
    <MonitoringProvider adapter={adapter}>
      ...
    </MonitoringProvider>
  );
}
```

Once you have done this, every child component of this provider will have access to the `useMonitoring` hook (of the
same package), that export tools to use the monitoring feature :

```tsx
import { useEffect } from 'react';
import { useMonitoring } from '@monkvision/monitoring';

function ChildComponent() {
  const { handleError } = useMonitoring();

  useEffect(() => {
    myApiCallThatCanFail().catch(handleError);
  }, []);
}
```

The complete list of features available using the `useMonitoring` hook is available in the `@monkvision/monitoring`
[README file](https://github.com/monkvision/monkjs/blob/main/packages/monitoring/README.md).

## Monitoring Adapters
A Monitoring Adapter is a tool or a platform that implements monitoring utilities that can be used by the MonkJs SDK to
effectively keep track of monitoring logs. Basically, by choosing a Monitoring Adapter, you choose on which platform the
monitoring will be logged. In practice, a Monitoring Adapter is any JavaScript class that implements the
`MonitoringAdapter` interface of the `@monkvision/monitoring` package.

The MonkJs SDK exports 3 Monitoring Adapters that you can use in your React apps and the following sections describe
them. You can also create your own adapter if you want to use a custom monitoring infrastructure for your project. More
details on this in the `@monkvision/monitoring`
[README file](https://github.com/monkvision/monkjs/blob/main/packages/monitoring/README.md).

### EmptyMonitoringAdapter

```typescript
import { EmptyMonitoringAdapter } from '@monkvision/monitoring';

const adapter = new EmptyMonitoringAdapter();
```
This Monitoring Adapter does nothing. It is basically an ampty adapter with empty callbacks for every monitoring
utility. It is the default monitoring adapter that is returned and used if you use the `useMonitoring` hook in a
component that is not a child of a `MonitoringProvider` component.

### DebugMonitoringAdapter
```typescript
import { DebugMonitoringAdapter } from '@monkvision/monitoring';

const adapter = new DebugMonitoringAdapter();
```
This Monitoring Adapter is a simple adapter that uses the local browser console to log errors and messages. This adapter
can be used to debug your app locally.

### SentryMonitoringAdapter
```typescript
import { SentryMonitoringAdapter } from '@monkvision/sentry';

const sentryMonitoringAdapter = new SentryMonitoringAdapter({
  dsn: 'https://YOUR_SENTRY_DSN.ingest.us.sentry.io/XXXXXXXXX',
  environment: 'development',
  debug: true,
  tracesSampleRate: 0.025,
  release: '1.0',
});
```
This Monitoring Adapter is the default adapter used in MonkJs web applications. It uses Monk's Sentry infrastructure to
log and report elements live in your web applications. If you are one of our clients, and plan on using this adapter in
your application, Monk should give you a Sentry DSN value to add to this adapter in order to link it to our
infrastructure.
