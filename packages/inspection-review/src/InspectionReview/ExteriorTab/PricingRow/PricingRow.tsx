import { useInspectionReviewState } from '../../hooks';
import { PricingLegend } from './PricingLegend';

/**
 * The PricingRow component that displays a row of the available pricing legends.
 */
export function PricingRow() {
  const { availablePricings } = useInspectionReviewState();

  return (
    <div style={{ display: 'flex', columnGap: 4 }}>
      {Object.entries(availablePricings).map(([level, value], i, all) => (
        <PricingLegend key={level} level={level} data={value} isLast={i === all.length - 1} />
      ))}
    </div>
  );
}
