/**
 * Monitoring context interface
 */
export interface MonitoringContext {
  /**
   * Store the error in the monitoring application.
   */
  errorHandler: (error: Error | string) => string;

  /**
   * Start Measure Performance
   */
  measurePerformance: (name: string, operation: string, data: { [key: string]: number | string } | null) => void;
}

export type MonitoringContextType = MonitoringContext;
