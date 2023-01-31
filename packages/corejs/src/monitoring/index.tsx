import React, { createContext } from 'react';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import * as SentryR from '@sentry/react';
import Constants from 'expo-constants';
import { CaptureConsole } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import { MonitoringConfigType, MonitoringContextType } from './types';

const tracingOrigins = ['localhost', 'cna.dev.monk.ai', 'cna.staging.monk.ai', 'cna.preview.monk.ai', 'cna.monk.ai'];
const defaultMonitoringConfig: MonitoringConfigType = {
	dsn: ""
};

const MonitoringConstants = {
	type: {
		UPLOAD: 'upload', // logs linked to the upload
		CAMERA: 'camera', // logs linked to the camera
		FUNC: 'func', // logs linked to a function
		APP: 'app', // logs linked to the application
		HTTP: 'http', // logs linked to the api
	},
	operation: {
		HTTP: 'http',
		USER_TIME: 'user-time-per-action',
		USER_CAMERA_TIME: 'user-camera-time',
		USER_UPLOAD_CENTER_TIME: 'user-upload-center-time',
		USER_ACTION: 'user-action',
		RESPONSE_TIME: 'response-time',
		FUNC: 'func',
	},
};

const Tracing = Integrations.BrowserTracing;
const Profiler = SentryR.withProfiler;
const transaction: any = (name) => SentryR.startTransaction({ name });
const setTag = (key, value) => SentryR.setTag(key, value);
const setUser = (id) => SentryR.setUser({ id });
const MonitoringContext = createContext<MonitoringContextType | null>(null);

const MonitoringProvider = ({ children }) => {
	/**
	 * @param config - Sentry configuration dns
	 */
	const initializeMonitoring = (config: MonitoringConfigType = defaultMonitoringConfig) => {
		Sentry.init({
			dsn: config.dsn || Constants.manifest.extra.SENTRY_DSN,
			environment: Constants.manifest.extra.ENV,
			debug: Constants.manifest.extra.ENV !== 'production',
			enableAutoSessionTracking: true,
			enableInExpoDevelopment: true,
			sessionTrackingIntervalMillis: 10000,
			tracesSampleRate: Constants.manifest.extra.ENV !== 'production' ? 1.0 : 0.2,
			integrations: [
				...(Platform.select({
					web: [
						new CaptureConsole({ levels: ['log'] }) as any
					],
					native: []
				})),
				new Tracing({
					tracingOrigins,
				}),
			],
		});
	};

	/**
	 * @param error {Error} - Caught error to send to Sentry.io
	 * @param type {string} - tag of the error's type
	 * @param extras {Record} - Useful information that can be sent (request's body for example)
	 * @param additionalTags - (Optional) Additional tags to add to the error
	 */
	const errorHandler = (error): string => {
		if (!Sentry || (!Sentry?.Browser && !Sentry?.Native)) { return null; }

		return Platform.select({
			web: Sentry.Browser,
			native: Sentry.Native as any,
		}).captureException(error);
	};

	return <MonitoringContext.Provider value={{ errorHandler, initializeMonitoring }}>{children}</MonitoringContext.Provider>;
};

export default MonitoringProvider;

export {
	MonitoringContext,
	Profiler,
	setTag,
	setUser,
	Tracing,
	transaction,
	MonitoringConstants,
}
