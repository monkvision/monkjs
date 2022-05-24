/* eslint-disable import/prefer-default-export */
import { Integrations } from '@sentry/tracing';
import * as SentryR from '@sentry/react';

export const Tracing = Integrations.BrowserTracing;
export const Profiler = SentryR.withProfiler;
export const transaction = (name) => SentryR.startTransaction({ name });
