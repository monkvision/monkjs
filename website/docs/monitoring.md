---
id: monitoring
title: "🧯 Monitoring"
slug: /monitoring
---

![npm latest package](https://img.shields.io/npm/v/@monkvision/camera/latest.svg)

## Modules overview

- Monitoring provides different methods to monitor mesurement of application and helps to log errors occurred in the application.

## Implementation Guild

 -  To implement monitoring in your application, user has to wrap entire application with ```MonitoringProvider``` as shown below.

```
<MonitoringProvider config={config}><App /></MonitoringProvider>
```

Where config object has different configuration values which helps user to configure monitoring in your application. The config object consist of below parameters.

```
const config = {
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
   * Should sessions be tracked to Sentry Health or not.
  */
  enableAutoSessionTracking: boolean;
  /**
   * Enable sentry in expo development of not.
  */
  enableInExpoDevelopment: boolean;
  /**
   * The interval to end a session if the App goes to the background.
  */
  sessionTrackingIntervalMillis: number;
  /**
   * Sample rate to determine trace sampling.
   *
   * 0.0 = 0% chance of a given trace being sent (send no traces) 1.0 = 100% chance of a given trace being sent (send
   * all traces)
   *
   * Tracing is enabled if either this or `tracesSampler` is defined. If both are defined, `tracesSampleRate` is
   * ignored.
  */
  tracesSampleRate: number;
  /**
   * Array of all the origin to browser trace.
  */
  tracingOrigins: Array<string>;
}
```

Once configured, user just has to use custom hooks ```useMonitoring()``` which exose the ```errorHandler and measurePerformance``` functions which is used for error handling and mesureing performance of functionality in the application.

Here are the details abouth both functions.

**errorHandler**

```
errorHandler(err);
```

This function will log details in monitoring application whenever it happens in the application.

**measurePerformance**

```
const capture = measurePerformance(name, operation, data);
capture()
```

Where name is the module name for which we want to measure performance. Operation is the functionality of the module and data is optional field that needed to be send to the transaction. It will return function which is used to close the transaction at the end and will measure data and store in monitoring application.
