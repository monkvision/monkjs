import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { Primitive } from '@sentry/types';
import { CaptureConsole } from '@sentry/integrations';
import { Integrations } from '@sentry/tracing';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';
import * as SentryR from '@sentry/react';
import Constants from 'expo-constants';
import PropTypes from 'prop-types';

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
const setTag = (key: string, value: Primitive): void => SentryR.setTag(key, value);
const setUser = (id: string) => SentryR.setUser({ id });
const MonitoringContext = createContext<MonitoringContextType | null>(null);

function MonitoringProvider({ children, config }) {
	useEffect(() => {
		Sentry.init({
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			dsn: (config.dns || Constants.manifest.extra.SENTRY_DSN) as string,
			environment: Constants.manifest.extra.ENV as string,
			debug: Constants.manifest.extra.ENV !== 'production',
			enableAutoSessionTracking: true,
			enableInExpoDevelopment: true,
			sessionTrackingIntervalMillis: 10000,
			tracesSampleRate: Constants.manifest.extra.ENV !== 'production' ? 1.0 : 0.2,
			integrations: [
				...(Platform.select({
					web: [new CaptureConsole({ levels: ['log'] })],
					native: [],
				})),
				new Tracing({
					tracingOrigins,
				}),
			],
		} as Sentry.SentryExpoNativeOptions);
	}, []);

	/**
	 * @param error {Error} - Caught error to send to Sentry.io
	 * @param type {string} - tag of the error's type
	 * @param extras {Record} - Useful information that can be sent (request's body for example)
	 * @param additionalTags - (Optional) Additional tags to add to the error
	 */
	const errorHandler = (error: Error | string): string => {
		if (!Sentry || (!Sentry?.Browser && !Sentry?.Native)) { return null; }

		return Platform.select({
			web: Sentry.Browser,
			native: Sentry.Browser,
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
			native: Sentry.Browser,
		}).startTransaction({ name, data });
		const transactionOperation = transaction.startChild({ op: operation });

		return () => {
			transactionOperation.finish();
			transaction.finish();
		};
	};

  const monitoringContextValue = useMemo(
    () => ({ errorHandler, measurePerformance }),
    [errorHandler, measurePerformance],
  );

	return (
		<MonitoringContext.Provider value={monitoringContextValue}>
			{children}
		</MonitoringContext.Provider>
	);
}

const useMonitoring = () => {
  return useContext(MonitoringContext);
}

export {
  MonitoringConstants,
	MonitoringContext,
	setTag,
	setUser,
	Tracing,
  MonitoringProvider,
  useMonitoring,
};

MonitoringProvider.propTypes = {
	config: PropTypes.shape({
		dns: PropTypes.string,
	}),
};

MonitoringProvider.defaultProps = {
	config: {
		dns: '',
	},
};
