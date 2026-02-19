import { PricingData, PricingLevels } from '../../../types/pricing.types';
import { styles } from './pricingLegend.styles';

/**
 * Props accepted by the PriceLegend component.
 */
export interface PricingLegendProps {
  /**
   * The price level to be displayed.
   */
  level: PricingLevels | string;
  /**
   * The price data associated with the level.
   */
  data: PricingData;
  /**
   * Indicates if this is the last legend item.
   */
  isLast?: boolean;
}

/**
 * The PricingLegend component that displays a legend for a specific price level.
 */
export function PricingLegend({ level, data, isLast }: PricingLegendProps) {
  return (
    <div style={styles['container']}>
      <span style={{ backgroundColor: data.color, ...styles['colorCircle'] }} />
      {level === PricingLevels.NONE ? (
        <span style={styles['pricingLabel']}>Need pricing</span>
      ) : (
        <span style={styles['pricingLabel']}>{isLast ? `> ${data.min}` : `< ${data.max}`}</span>
      )}
    </div>
  );
}
