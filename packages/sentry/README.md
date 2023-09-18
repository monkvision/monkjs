# @monkvision/sentry
This package exports a monitoring adapter that can be used to configure the monitoring of MonkJs projects using the @monkvision/monitoring project. The adapter exported by this package uses Sentry, a monitoring platform used by MonkJs to log, report errors and measure performances in its project. If you want to know more about monitoring adapters and the features they offer, please refer to the official documentation of the @monkvision/monitoring package.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/monitoring @monkvision/sentry
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install anything else!

# Basic Usage
## Set Up
In order to configure the sentry inside your application, you first need to instantiate the Sentry Adapter and then wrap your root component in the `MonitoringProvider` and passing it the adapter as a prop :

```typescript jsx
import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { MonitoringProvider } from '@monkvision/monitoring';

const adapter = new SentryMonitoringAdapter({
  dsn: '',
  environment: '',
  debug: true / false,
  tracesSampleRate: 0.025,
  release: '',
});

const container = document.getElementById('root');
render((
  <MonitoringProvider adapter={adapter}>
    <App/>
  </MonitoringProvider>
), container);
```

# API
## SentryMonitoringAdapter
### Description
A Sentry Adapter logs everything in the Sentry platform. This can be used in your app when you want to implement Sentry for advanced Monitoring Features such as error handling, logs messages and performance measurements. 

### Config Options
| Option                          | Description                                                                                                                                                           | Required | Default Value |
|---------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|---------------|
| `dsn`                           | DSN key for sentry.io project with which your application will connect for sending all the information.                                                               | ✓        | `NULL`        |
| `environment`                   | The environment of your application (e.g. "production")                                                                                                               |          | `local`       |
| `debug`                         | Enable debug functionality in the SDK                                                                                                                                 |          | `false`       |
| `release`                       | Release version of application                                                                                                                                        |          | `1.0`         |
| `tracesSampleRate`              | Sample rate to determine trace sampling. 0.0 = 0% chance of a given trace being sent (send no traces) 1.0 = 100% chance of a given trace being sent (send all traces) |          | `0.025`       |
| `customTags`                    | Custom tags to add in all transaction.                                                                                                                                |          | `[]`          |

### Examples of Usage
```typescript jsx
import { SentryMonitoringAdapter } from '@monkvision/sentry';
import { MonitoringProvider } from '@monkvision/monitoring';
const adapter = new DebugMonitoringAdapter();

const adapter = new SentryMonitoringAdapter({
  dsn: '',
  environment: '',
  debug: true / false,
  tracesSampleRate: 0.025,
  release: '',
});

const container = document.getElementById('root');
render((
  <MonitoringProvider adapter={adapter}>
    <App/>
  </MonitoringProvider>
), container);
```
