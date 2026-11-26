# @monkvision/posthog
This package exports a analytics adapter that can be used to configure the analytics of MonkJs projects using the @monkvision/analytics project. The adapter exported by this package uses posthog, a analytics platform used by MonkJs to track event in its project. If you want to know more about analytics adapters and the features they offer, please refer to the official documentation of the @monkvision/analytics package.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/analytics @monkvision/posthog
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install anything else!

# Basic Usage
## Set Up
In order to configure the posthog inside your application, you first need to instantiate the Posthog Adapter and then wrap your root component in the `AnalyticsProvider` and passing it the adapter as a prop :

```tsx
import { PosthogAnalyticsAdapter } from '@monkvision/posthog';
import { AnalyticsProvider } from '@monkvision/analytics';

const adapter = new PosthogAnalyticsAdapter({
  token: 'phc_iNzK7jyK2bLtRi9vNWnzQqy74rIPlXPdgGs0qgJrSfL',
  api_host: 'https://eu.posthog.com',
  environnement: 'development',
  projectName: 'test',
  release: '1.0.0',
});

const container = document.getElementById('root');
render((
  <AnalyticsProvider adapter={adapter}>
    <App/>
  </AnalyticsProvider>
), container);
```

# API
## PosthogAnalyticsAdapter
### Description
A Posthog Adapter logs everything in the posthog platform. This can be used in your app when you want to implement posthog for advanced analytics Features such tracking events, and behavior of the user.

### Config Options
| Option        | Description                                                                                                 | Required | Default Value           |
| ------------- | ----------------------------------------------------------------------------------------------------------- | -------- | ----------------------- |
| `token`       | Token key for posthog.com project with which your application will connect for sending all the information. | ✓        | `NULL`                  |
| `environment` | The environment of your application (e.g. "production").                                                    |          | `local`                 |
| `api_host`    | The URL of the Posthog application.                                                                         |          | `https://eu.pothog.com` |
| `release`     | Release version of application                                                                              |          | `1.0.0`                 |
| `projectName` | The name of the project or client.                                                                          |          | `monkjs`                |
| `instanceName` | Name of the Posthog instance used by the adapter. Use a unique name per adapter to send analytics to multiple projects. |          | Global Posthog instance |

### Examples of Usage
```tsx
import { PosthogAnalyticsAdapter } from '@monkvision/posthog';
import { AnalyticsProvider } from '@monkvision/analytics';

const adapter = new PosthogAnalyticsAdapter({
  token: '',
  api_host: 'https://eu.posthog.com',
  environnement: '',
  projectName: '',
  release: '',
});

const container = document.getElementById('root');
render((
  <AnalyticsProvider adapter={adapter}>
    <App/>
  </AnalyticsProvider>
), container);
```

### Sending Analytics to Multiple Posthog Projects
To send your analytics to multiple Posthog projects, create one adapter per project, give each additional adapter a
unique `instanceName`, and pass them to the `AnalyticsProvider` using the `additionalAdapters` prop :

```tsx
import { PosthogAnalyticsAdapter } from '@monkvision/posthog';
import { AnalyticsProvider } from '@monkvision/analytics';

const primaryAdapter = new PosthogAnalyticsAdapter({ token: 'FIRST_PROJECT_TOKEN' });
const secondaryAdapter = new PosthogAnalyticsAdapter({
  token: 'SECOND_PROJECT_TOKEN',
  instanceName: 'secondary',
});

const container = document.getElementById('root');
render((
  <AnalyticsProvider adapter={primaryAdapter} additionalAdapters={[secondaryAdapter]}>
    <App/>
  </AnalyticsProvider>
), container);
```

If no `instanceName` is given and the global Posthog instance already belongs to another project, the adapter creates a
`monk-<token>` instance automatically.
