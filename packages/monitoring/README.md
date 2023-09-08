# @monkvision/monitoring
This package provides an abstraction layer for the monitoring features in the MonkJs ecosystem. If you plan on using any
of these features, you can use this package to properly set up the monitoring inside your application.

# Installing
To install the package, you can run the following command :

```shell
yarn add @monkvision/monitoring
```

If you are using TypeScript, this package comes with its type definitions integrated, so you don't need to install
anything else!

# Monitoring Adapters
A Monitoring Adapter is a tool that helps your application use monitoring features such as logging stuff, reporting
errors, measuring performances etc. In this package, we define an interface that describes the requirements for a
Monitoring Adapter to be usable by Monk.

When setting up the monitoring in your application, you need to specify the Monitoring Adapter you want to use. This
package provides two super basic adapters :

- The `EmptyMonitoringAdapter` that does nothing
- The `DebugMonitoringAdapter` that simply logs stuff into the console

Monk also provides another adapter, called the `SentryMonitoringAdapter`, that connects your application to Sentry, a
well known Monitoring platform. If you want to use this adapter, take a look at the `@monkvision/sentry` package.

# Basic Usage
## Set Up
In order to configure the monitoring inside your application, you first need to instantiate the Monitoring Adapter you
want to use, and then wrap your root component in the `MonitoringProvider` and passing it the adapter as a prop :

```typescript jsx
import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';

const adapter = new DebugMonitoringAdapter();

const container = document.getElementById('root');
render((
  <MonitoringProvider adapter={adapter}>
    <App/>
  </MonitoringProvider>
), container);
```

## useMonitoring hook
Once you have wrapped up your application in the `MonitoringProvider` component, you can now access all of the
monitoring features in your app components using the `useMonitoring` hook :

```typescript jsx
import { useMonitoring } from '@monkvision/monitoring';

function MyCustomComponent() {
  const {
    setUserId,
    log,
    handleError,
    createTransaction,
  } = useMonitoring();
}
```

You can refer to the API section below to get more info on how these functions work.

# Creating Your Own Adapter
If you want to create your own Monitoring Adapter, you just have to implement the `MonitoringAdapter` interface provided
by this package :

```typescript
import { LogContext, MonitoringAdapter, Severity, Transaction, TransactionContext } from '@monkvision/monitoring';

class MyCustomMonitoringAdapter implements MonitoringAdapter {
  setUserId(id: string): void {
    // Set the current user ID
  }

  log(msg: string, context?: LogContext | Severity): void {
    // Log stuff
  }

  handleError(err: Error | string, context?: Omit<LogContext, 'level'>): void {
    // Report errors
  }

  createTransaction(context: TransactionContext): Transaction {
    // Create a transaction for performance measurement
  }
}
```

Note that all the methods and features of the MonitoringAdapter interface are required. If you plan on creating a
custom adapter that does not implement all features, you can extend the `EmptyMonitoringAdapter` class :

```typescript
import { LogContext, Severity, EmptyMonitoringAdapter } from '@monkvision/monitoring';

class MyCustomMonitoringAdapter extends EmptyMonitoringAdapter {
  override log(msg: string, context?: LogContext | Severity): void {
    // ...
  }
}
```

Note that when doing so, the unimplemented methods will work : even though they will do nothing, they won't throw any
error. If you try to use one of the features that is not implemented, a warning will be displayed in the console
indicating that the feature is not supported by the current Monitoring Adapter. This behavior can be configured in the
options given to the `EmptyMonitoringAdapter` constructor.

# API
## Monitoring Methods
This section describes the methods available in the `MonitoringAdapter` interface.

#### setUserId
```typescript
setUserId: (id: string) => void
```
This method defines the current user using the application. Users are identified by a unique string ID.

#### log
```typescript
log: (msg: string, context?: LogContext | Severity) => void
```
This method logs messages. An optional context can be provided that can contain :
- A log severity level (default: `info`)
- Extra data to send with the logs
- Tags associated with the log

#### handleError
```typescript
handleError: (err: Error | string, context?: Omit<LogContext, 'level'>) => void
```
This method reports errors. An optional context can be provided that can contain :
- Extra data to send with the error
- Tags associated with the error

#### createTransaction
```typescript
createTransaction: (context: TransactionContext) => Transaction
```
This method creates a new transaction that can be used to measure performances, report metrics etc. A Transaction object
has the following structure :

```typescript
export interface Transaction {
  // The ID of the transaction
  id: string;
  // Set a tag in the transaction
  setTag: (name: string, value: string) => void;
  // Start a performance measurement
  startMeasurement: (name: string, data?: Record<string, number | string>) => void;
  // Stop a given measurement
  stopMeasurement: (name: string) => void;
  // Set a custom measurement value
  setMeasurement: (name: string, value: number, unit?: MeasurementUnit) => void;
  // Complete the transaction
  finish: (status?: string) => void;
}
```

## Monitoring Adapters
### EmptyMonitoringAdapter
#### Description
This is an empty Monitoring Adapter, that does nothing when used. If you use one of the monitoring features with this
adapter a warning will be displayed in the console by default, indicating that the feature is not supported. You can use
this adapter directly in your app, or you can extend it to create your own partial adapter.

#### Config Options
| Option                          | Description                                                                              | Default Value |
|---------------------------------|------------------------------------------------------------------------------------------|---------------|
| `showUnsupportedMethodWarnings` | Indicates if warnings should be displayed in the console when using unsupported feature. | `true`        |

#### Examples of Usage
```typescript jsx
import { EmptyMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';
const adapter = new EmptyMonitoringAdapter();

const container = document.getElementById('root');
render((<MonitoringProvider adapter={adapter}><App/></MonitoringProvider>), container);
```

```typescript
import { LogContext, Severity, EmptyMonitoringAdapter } from '@monkvision/monitoring';

class MyCustomMonitoringAdapter extends EmptyMonitoringAdapter {
  override log(msg: string, context?: LogContext | Severity): void {
    // ...
  }
}
```

### DebugMonitoringAdapter
#### Description
This is a very small Monitoring Adapter, that simply logs stuff in the console. This can be used in your app if you do
not have any need for advanced Monitoring Features such as performance measurements. The only methods implemented
are `log` and `handleError`, that simply log elements in the console.

All the severity levels are implemented and redirected to the corresponding console level except for the fatal level
which is redirected to the `console.error` function. The `extras` data passed in the context will also be logged
along the message or error, but the tags will be ignored.

#### Config Options
| Option                          | Description                                                                              | Default Value |
|---------------------------------|------------------------------------------------------------------------------------------|---------------|
| `showUnsupportedMethodWarnings` | Indicates if warnings should be displayed in the console when using unsupported feature. | `true`        |

#### Examples of Usage
```typescript jsx
import { DebugMonitoringAdapter, MonitoringProvider } from '@monkvision/monitoring';
const adapter = new DebugMonitoringAdapter();

const container = document.getElementById('root');
render((<MonitoringProvider adapter={adapter}><App/></MonitoringProvider>), container);
```
