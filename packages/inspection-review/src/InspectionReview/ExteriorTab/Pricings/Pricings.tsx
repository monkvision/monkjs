import { useInspectionReviewState } from '../../hooks/InspectionReviewProvider';
import { PricingLegend } from './PricingLegend';
import { styles } from './pricings.styles';

/**
 * The Pricings component that displays a list of the available pricing legends.
 */
export function Pricings() {
  const { availablePricings } = useInspectionReviewState();

  return (
    <div style={styles['container']}>
      {Object.entries(availablePricings).map(([level, value], i, all) => (
        <PricingLegend key={level} level={level} data={value} isLast={i === all.length - 1} />
      ))}
    </div>
  );
}
