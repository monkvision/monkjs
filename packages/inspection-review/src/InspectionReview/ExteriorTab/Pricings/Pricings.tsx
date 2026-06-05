import { useInspectionReviewState } from '../../hooks/InspectionReviewProvider';
import { PricingLegend } from './PricingLegend';

/**
 * The Pricings component that displays a list of the available pricing legends.
 */
export function Pricings() {
  const { availablePricings } = useInspectionReviewState();

  return (
    <div style={{ display: 'flex', columnGap: 4 }}>
      {Object.entries(availablePricings).map(([level, value], i, all) => (
        <PricingLegend key={level} level={level} data={value} isLast={i === all.length - 1} />
      ))}
    </div>
  );
}
