/**
 * Monitoring configuration for setting up monitoring.
 */
export interface MonitoringConfig {
	/**
	 * DNS url to use for storing logs.
	 */
	dsn: string;
}

export type MonitoringConfigType = MonitoringConfig;

/**
 * Monitoring context interface
 */
export interface MonitoringContext {
	/**
	 * Store the error in the monitoring application.
	 */
	errorHandler: (error: any) => string;
	/**
	 * Initialize the monitoring functionality
	 */
	initializeMonitoring: (config: MonitoringConfigType) => void
}

export type MonitoringContextType = MonitoringContext;
