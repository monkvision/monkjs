---
id: monitoring
title: "🧯 Monitoring"
slug: /monitoring
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

## Modules overview

The monitoring module uses different methods to monitor errors and measure metrics in the application.

## Implementation Guild

To set up `Monk` monitoring in an application, the entire application must be wrapped with a `MonitoringProvider`.

```javascript
<MonitoringProvider config={config}>
  <App />
</MonitoringProvider>
```

The configuration options are listed below :

### Monitoring Config

| **Config option**  | **Required** | **Type**                  | **Description**                                                                                                                                                                                   |
| ------------------ | ------------ | --------                  | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dsn`              | ✓            | string                    | DSN (Data Source Name) key for sentry.io application. A DSN tells a Sentry SDK where to send events so the events are associated with the correct project.                                        |
| `environment`      | ✓            | string                    | The current environment of your application , such as _development_, _testing_, _staging_, or _production_. Environments help you better filter issues and transactions among other uses.         |
| `debug`            | ✓            | boolean                   | Enable debug functionality in the SDK itself. If debug is enabled SDK will attempt to print out useful debugging information in browser's console if something goes wrong with sending the event. |
| `tracesSampleRate` | ✓            | number                    | Sample rate to determine trace sampling. The default is 1.0 which means that 100% of error events are sent.                                                                                       |
| `tracingOrigins`   | ✓            | string[]                  | Array of all the origin to browser trace                                                                                                                                                          |
| `customTags`       |              | { [tag: string]: string } | Add custom tags in all transactions for better tracking                                                                                                                                           |

### Note

User requires to set a delay before redirecting to another URL after the successful completion of Capture Tour. It will make sure that the transaction of "Capture Tour" is finished properly and data is successfully logged to Sentry.

```javascript
await new Promise((resolve) => {
  setTimeout(resolve, 1000);
});
```

---

## API

The monitoring module uses custom hooks `useMonitoring()` which exposes the `setMonitoringUser, setMonitoringTag, errorHandler, measurePerformance and setMeasurement` functions which are used for setting current user in monitoring, error handling, measuring performance of functionality and setting custom measurements in the application.

The details of these functions are listed below :

### `setMonitoringUser`

```typescript
setMonitoringUser(id: string): void;
```

This function will add current user to monitoring application so that whenever users measure any performance or set a custom measurements in the monitoring, at that time we will have a all the transaction under current user. It will help us to identify the transaction based on user.

### `setMonitoringTag`

```typescript
setMonitoringTag(key: string, value: Primitive): void;
```

This function will allow user to add custom tags to current transaction for query. Primitive is a datatype which contains "number | string | boolean | bigint | symbol | null | undefined" value.

### `errorHandler`

```typescript
errorHandler(err): string | null;
```

This function will log details in monitoring application whenever it happens in the application.

### `measurePerformance`

```typescript
const capture = measurePerformance(name: string, op: string, data?: { [key: string]: number | string }): SentryTransactionObject;
```

Where name is the module name for which we want to measure performance. Operation is the functionality of the module and data is optional field that needed to be send to the transaction. It will return a object which contains different functions to use in current transaction. Here are the functions which will be return as an object.

### SentryTransactionObject

| **Config option** | **Params**                                                    | **Description**                                                                              |
| ----------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `setTag`          | name: string, value: string                                   | Set tag in a transaction instance                                                            |
| `startSpan`       | op: string, data: { [key: string]: number \| string } \| null | Create a span in a transaction instance to measure the performance for a sub event           |
| `finishSpan`      | op: string                                                    | Finish a running span in a transaction instance and complete the measurement for a sub event |
| `finish`          | status: string                                                | Finish a running transaction instance and complete the measurement for a main event          |

User can set tags, create new span and finish span & transaction at the end to send measured data to sentry. `capture.finish('Ok')`

### `setMeasurement`

```typescript
const capture = setMeasurement(transactionName, name, value, unit);
capture();
```

Where transactionName will be the name of transaction for which user wants to add measurements, name is the module name for which we want to measure data, value will be the value of the measurements in number and unit will be used as unit for the current measurement.
