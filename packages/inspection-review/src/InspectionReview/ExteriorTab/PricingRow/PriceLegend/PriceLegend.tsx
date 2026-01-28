import { PriceData, PriceLevels } from '../../../types/pricing.types';

/**
 * Props accepted by the PriceLegend component.
 */
export interface PriceLegendProps {
  level: PriceLevels | string;
  data: PriceData;
  isLast?: boolean;
}

/**
 * The PriceLegend component that displays a legend for a specific price level.
 */
export function PriceLegend({ level, data, isLast }: PriceLegendProps) {
  return (
    <div style={{ display: 'flex' }}>
      <span
        style={{ backgroundColor: data.color, width: '20px', height: '20px', borderRadius: '50%' }}
      />
      {level === PriceLevels.NONE ? (
        <span style={{ marginLeft: '8px' }}>No Estimate</span>
      ) : (
        <span style={{ marginLeft: '8px' }}>{isLast ? `> ${data.min}` : `< ${data.max}`}</span>
      )}
    </div>
  );
}
