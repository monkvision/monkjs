/* eslint-disable import/prefer-default-export */
import * as SentryRN from '@sentry/react-native';

export const Tracing = SentryRN.ReactNativeTracing;
export const Profiler = SentryRN.withProfiler;
export const transaction = (name) => SentryRN.startTransaction({ name });
