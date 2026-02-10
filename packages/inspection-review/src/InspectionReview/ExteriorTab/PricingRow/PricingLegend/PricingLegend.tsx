import { PricingData, PricingLevels } from '../../../types/pricing.types';

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
    <div style={{ display: 'flex' }}>
      <span
        style={{ backgroundColor: data.color, width: '20px', height: '20px', borderRadius: '50%' }}
      />
      {level === PricingLevels.NONE ? (
        <span style={{ marginLeft: '8px' }}>No Estimate</span>
      ) : (
        <span style={{ marginLeft: '8px' }}>{isLast ? `> ${data.min}` : `< ${data.max}`}</span>
      )}
    </div>
  );
}
