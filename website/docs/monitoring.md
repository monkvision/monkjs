---
id: monitoring
title: "🧯 Monitoring"
slug: /monitoring
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

## Modules overview

Monitoring provides different methods to monitor mesurement of application and helps to log errors occurred in the application.

## Implementation Guild

To implement monitoring in your application, user has to wrap entire application with ```MonitoringProvider``` as shown below.

```
<MonitoringProvider config={config}><App /></MonitoringProvider>
```

Where config object has different configuration values which helps user to configure monitoring in your application. The config object consist of below parameters.

```
export interface MonitoringConfig {
    /**
   * DSN key for sentry.io application
  */
  dsn: string;
  /**
   * The current environment of your application (e.g. "production")
  */
  environment: string;
  /**
   * Enable debug functionality in the SDK itself
  */
  debug: boolean;
  /**
   * Sample rate to determine trace sampling.
   *
   * 0.0 = 0% chance of a given trace being sent (send no traces) 1.0 = 100% chance of a given trace being sent (send
   * all traces)
   *
   * Tracing is enabled if either this or `tracesSampler` is defined. If both are defined, `tracesSampleRate` is
   * ignored. We have set tracesSampleRate to 0.1 for error events which means only 10% of error events will be sent to Sentry. 
   * It is a number between 0 and 1, controlling the percentage chance a given transaction will be sent to Sentry.
   * (0 represents 0% while 1 represents 100%.). Applies equally to all transactions created in the app.
  */
  tracesSampleRate: number;
  /**
   * Array of all the origin to browser trace.
  */
  tracingOrigins: string[];
}
```

Once configured, user just has to use custom hooks ```useMonitoring()``` which exose the ```setMonitoringUser, setMonitoringTag, errorHandler, measurePerformance and setMeasurement``` functions which is used for setting current user in monitoring, error handling, measuring performance of functionality and setting custom measurements in the application.

Here are the details about both functions.

**setMonitoringUser**

```
setMonitoringUser(id: string);
```

This function will add current user to monitoring application so that whenever users measure any performance or set a custom measurements in the monitoring, at that time we will have a all the transaction under current user. It will help us to identify the transaction based on user.

**setMonitoringTag**

```
setMonitoringTag(key: string, value: Primitive);
```

This function will allow user to add custom tags to current transaction for query. Primitive is a datatype which contains "number | string | boolean | bigint | symbol | null | undefined" value.

**errorHandler**

```
errorHandler(err);
```

This function will log details in monitoring application whenever it happens in the application.

**measurePerformance**

```
const capture = measurePerformance(name: string, op: string, data?: { [key: string]: number | string });
```

Where name is the module name for which we want to measure performance. Operation is the functionality of the module and data is optional field that needed to be send to the transaction. It will return a object which contains different functions to use in current transaction. Here are the functions which will be return as an object.

```
export interface SentryTransactionObject {
  /**
   * Set tag in a transaction instance
   */
  setTag: (name: string, value: string) => void;

  /**
   * Create a span in a transaction instance to measure the performance for a sub event
   */
  startSpan: (op: string, data: { [key: string]: number | string } | null) => void;

  /**
   * Finish a running span in a transaction instance and complete the measurement for a sub event
   */
  finishSpan: (op: string) => void;

  /**
   * Finish a running transaction instance and complete the measurement for a main event
   */
  finish: (status: string) => void;
}
```

User can set tags, create new span and finish span & transaction at the end to send measured data to sentry. ```capture.funish('Ok')```

**setMeasurement**

```
const capture = setMeasurement(transactionName, name, value, unit);
capture()
```

Where transactionName will be the name of transaction for which user wants to add measurements, name is the module name for which we want to measure data, value will be the value of the measurements in number and unit will be used as unit for the current measurement.
