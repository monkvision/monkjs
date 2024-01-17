import { useTranslation } from 'react-i18next';
import { Button } from '@monkvision/common-ui-web';
import { styles } from './PricingSelection.styles';
import { Content, Title } from '../common';
import { DamageMode, DisplayMode } from '../hooks';

export interface PricingSelectionProps {
  hasDamage?: boolean;
  displayMode?: DisplayMode;
  damageMode?: DamageMode;
  onPriceChange?: (price: number) => void;
}

export function PricingSlider({
  hasDamage = true,
  damageMode = DamageMode.ALL,
  displayMode = DisplayMode.MINIMAL,
  onPriceChange,
}: PricingSelectionProps) {
  if ((displayMode === DisplayMode.MINIMAL && !hasDamage) || damageMode === DamageMode.SEVERITY) {
    return null;
  }
  const { t } = useTranslation();
  return (
    <Content
      style={{
        ...styles['columnContent'],
        ...(!hasDamage && styles['disable']),
      }}
    >
      <Title>{t('damageManipulator.pricing.repairCost')}</Title>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}
      >
        <Button onClick={() => onPriceChange?.(200)}>200</Button>
        <Button onClick={() => onPriceChange?.(4000)}>4000</Button>
      </div>
    </Content>
  );
}
