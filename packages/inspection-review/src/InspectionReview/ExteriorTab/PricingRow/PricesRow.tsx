import { useInspectionReviewState } from '../../hooks';
import { PriceLegend } from './PriceLegend/PriceLegend';

/**
 * The PricesRow component that displays a row of the available price legends.
 */
export function PricesRow() {
  const { availablePrices } = useInspectionReviewState();

  return (
    <div style={{ display: 'flex', columnGap: 4 }}>
      {Object.entries(availablePrices).map(([level, value], i, all) => (
        <PriceLegend key={level} level={level} data={value} isLast={i === all.length - 1} />
      ))}
    </div>
  );
}
