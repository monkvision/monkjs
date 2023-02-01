import React, { createContext, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import * as SentryR from '@sentry/react';
import Constants from 'expo-constants';
import { CaptureConsole } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import { MonitoringContextType } from './types';

const tracingOrigins = ['localhost', 'cna.dev.monk.ai', 'cna.staging.monk.ai', 'cna.preview.monk.ai', 'cna.monk.ai'];
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

const MonitoringProvider = ({ children, config }) => {
	useEffect(() => {
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
	}, []);

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

	/**
	 * @param name {string} - Name of transaction
	 * @param operation {string} - Operation of transaction to be performed
	 * @param data {{[key: string]: number | string}} - Data to be added on transaction
	 */
	const measurePerformance = (name: string, operation: string, data: { [key: string]: number | string } | null) => {
		const transaction = Platform.select({
			web: Sentry.Browser,
			native: Sentry.Native as any,
		}).startTransaction({ name, operation, data });

		return () => {
			transaction.finish();
		};
	}

	return <MonitoringContext.Provider value={{ errorHandler, measurePerformance }}>{children}</MonitoringContext.Provider>;
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
};

// For Example, if user wants to measure performance of functionality,
// const performance = measurePerformance(
// 	MonitoringConstants.operation.USER_UPLOAD_CENTER_TIME,
// 	MonitoringConstants.type.HTTP,
// 	{ file_size: 1024, picture_width: 300, picture_height: 300 },
// );
// performance(); -> call this function to finish process of measuring
