---
sidebar_position: 9
---

# Analytics
The MonkJs SDK includes built-in support for capturing and managing analytics events such as user interactions, page views, and custom events.
Internally, we use [PostHog](https://posthog.com) to manage our analytics, and you are free to use our PostHog infrastructure
or use your preferred analytics tool.

![npm latest package](https://img.shields.io/npm/v/@monkvision/analytics/latest.svg)

## Why use Analytics?
While you can opt out of our analytics features when using our SDK, we highly recommend utilizing them for the following reasons:

- **Enhanced Insights**: Gain valuable insights into user interactions and behaviors in your app by leveraging our ready-to-use analytics providers.
- **Real-Time Tracking**: Monitor user behavior and application usage patterns in real-time, allowing for proactive improvements.
- **Support Eligibility**: Monk does not offer tech support for deployed applications and projects where analytics are disabled.


## Enabling Analytics
To enable analytics support in your application, wrap your application in an `AnalyticsProvider` component,
exported by the `@monkvision/analytics`, and pass it an Analytics Adapter (see the Analytics Adapter section below):

```tsx
import { PosthogAnalyticsProvider } from '@monkvision/analytics';

const adapter = new PosthogMonitoringAdapter({
    token: 'YOUR_TOKEN',
    api_host: 'https://eu.posthog.com',
    environnement: 'development',
    projectName: 'your_project',
    release: '1.0.0',
});

function App() {
  return (
    <MonitoringProvider adapter={adapter}>
      ...
    </MonitoringProvider>
  );
}
```

Once wrapped, every child component of this provider will have access to the `useAnalytics` hook (from the same package),
which provides tools to utilize the analytics features:

```tsx
import { useAnalytics } from '@monkvision/analytics';

function ChildComponent() {
  const { trackEvent } = useAnalytics();

  const handleClick = () => trackEvent('Event Name', { tagName: value });
}
```
For a complete list of features available via the `useAnalytics` hook, refer to the `@monkvision/analytics`
[README file](https://github.com/monkvision/monkjs/blob/main/packages/analytics/README.md).


## Analytics Adapters
An Analytics Adapter is a tool or platform that implements analytics utilities for the MonkJs SDK to track events effectively.
By choosing an Analytics Adapter, you decide where the analytics events will be logged. Essentially, an Analytics Adapter
is any JavaScript class implementing the `AnalyticsAdapter` interface from the `@monkvision/analytics` package.

The MonkJs SDK provides two Analytics Adapters for use in React applications, described below. You can also create your
own adapter to use a custom analytics infrastructure. More details can be found in the `@monkvision/analytics`
[README file](https://github.com/monkvision/monkjs/blob/main/packages/analytics/README.md).

### EmptyAnalyticsAdapter
```tsx
import { EmptyAnalyticsAdapter } from '@monkvision/analytics';

const adapter = new EmptyAnalyticsAdapter();
```
This Analytics Adapter does nothing. It is basically an empty adapter with empty callbacks for every analytics
utility. It is the default analytics adapter that is returned and used if you use the `useAnalytics` hook in a
component that is not a child of a `AnalyticsProvider` component.

### PosthogAnalyticsAdapter
```tsx
import { PosthogAdapterConfig } from '@monkvision/posthog';

const posthogAnalyticsAdapter = new PosthogAnalyticsAdapter({
  token: 'YOUR_TOKEN',
  api_host: 'https://eu.posthog.com',
  environnement: 'development',
  projectName: 'your_project',
  release: '1.0.0',
})
```
This Analytics Adapter is the default adapter used in MonkJs web applications. It uses Monk's Posthog infrastructure to
log and report analytics events in your web applications. If you are one of our clients, and plan on using this adapter in
your application, Monk should give you a token value to add to this adapter in order to link it to our
infrastructure.
