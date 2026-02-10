import { useInspectionReviewProvider } from '../../../hooks/useInspectionReviewProvider';
import { PricingLegend } from './PricingLegend';
import { styles } from './pricings.styles';

/**
 * The Pricings component that displays a list of the available pricing legends.
 */
export function Pricings() {
  const { availablePricings, currency, isLeftSideCurrency } = useInspectionReviewProvider();

  return (
    <div style={styles['container']}>
      {Object.entries(availablePricings).map(([level, value], i, all) => (
        <PricingLegend
          key={level}
          level={level}
          data={value}
          isLast={i === all.length - 1}
          currency={currency}
          isLeftSideCurrency={isLeftSideCurrency}
        />
      ))}
    </div>
  );
}
