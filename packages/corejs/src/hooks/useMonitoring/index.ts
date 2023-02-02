import { useCallback, useContext, useState } from "react";

import { MonitoringContext } from "../../monitoring";

/**
 * Use fake activity when you need to render ActivityIndicator for better UX
 */
export default function useMonitoring() {
	const { errorHandler, measurePerformance } = useContext(MonitoringContext);

	return [errorHandler, measurePerformance];
}
