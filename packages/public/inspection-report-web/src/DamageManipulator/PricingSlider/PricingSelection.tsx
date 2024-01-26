import React from 'react';
import { useTranslation } from 'react-i18next';
import { styles } from './PricingSelection.styles';
import { Content, Title } from '../common';
import { DamageMode, DisplayMode } from '../hooks';

export interface PricingSelectionProps {
  damagePricing: number | undefined;
  hasDamage?: boolean;
  displayMode?: DisplayMode;
  damageMode?: DamageMode;
  onPriceChange?: (price: number) => void;
}

export function PricingSlider({
  damagePricing = 0,
  hasDamage = true,
  damageMode = DamageMode.ALL,
  displayMode = DisplayMode.MINIMAL,
  onPriceChange,
}: PricingSelectionProps) {
  if ((displayMode === DisplayMode.MINIMAL && !hasDamage) || damageMode === DamageMode.SEVERITY) {
    return null;
  }
  const { t } = useTranslation();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPriceChange?.(Number(e.target.value));
  };

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
          justifyContent: 'space-between',
        }}
      >
        <input
          disabled={!hasDamage}
          style={{ width: '80%' }}
          type='range'
          min='0'
          max='100'
          value={damagePricing}
          onChange={handleSliderChange}
        />
        <label>
          {damagePricing}
          {t('damageManipulator.pricing.currency')}
        </label>
      </div>
    </Content>
  );
}
