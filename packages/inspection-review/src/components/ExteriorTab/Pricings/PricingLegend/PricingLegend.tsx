import { useTranslation } from 'react-i18next';
import { PricingData, PricingLevels } from '../../../../types/pricing.types';
import { styles } from './pricingLegend.styles';
import { InspectionReviewProps } from '../../../../types';
import { InspectionReviewProviderState } from '../../../../types/inspection-review.types';

/**
 * Props accepted by the PriceLegend component.
 */
export interface PricingLegendProps
  extends Pick<InspectionReviewProps, 'currency'>,
    Pick<InspectionReviewProviderState, 'isLeftSideCurrency'> {
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
export function PricingLegend({
  level,
  data,
  isLast,
  currency,
  isLeftSideCurrency,
}: PricingLegendProps) {
  const { t } = useTranslation();

  const formatPrice = (price: number) => {
    return isLeftSideCurrency ? `${currency}${price}` : `${price}${currency}`;
  };

  return (
    <div style={styles['container']}>
      <span style={{ backgroundColor: data.color, ...styles['colorCircle'] }} />
      {level === PricingLevels.NONE ? (
        <span style={styles['pricingLabel']}>{t('tabs.exterior.pricings.needsPricing')}</span>
      ) : (
        <span style={styles['pricingLabel']}>
          {isLast ? `> ${formatPrice(data.min)}` : `< ${formatPrice(data.max)}`}
        </span>
      )}
    </div>
  );
}
