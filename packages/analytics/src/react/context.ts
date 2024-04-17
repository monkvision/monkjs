import { createContext } from 'react';
import { AnalyticsAdapter, EmptyAnalyticsAdapter } from '../adapters';

/**
 * A React Context that wraps up the analytics methods provided by an Analytics Adapter. This context is initialized by
 * default with the EmptyAnalyticsAdapter.
 */
export const AnalyticsContext = createContext<AnalyticsAdapter>(new EmptyAnalyticsAdapter());
