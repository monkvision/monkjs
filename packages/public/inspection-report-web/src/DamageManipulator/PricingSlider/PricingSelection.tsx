import { useTranslation } from 'react-i18next';
import { styles } from './PricingSelection.styles';
import { Title } from '../components';
import { DamageMode, DisplayMode } from '../hook';

export interface PricingSelectionProps {
  hasDamage?: boolean;
  displayMode?: DisplayMode;
  damageMode?: DamageMode;
}

export function PricingSlider({
  hasDamage = true,
  damageMode = DamageMode.ALL,
  displayMode = DisplayMode.MINIMAL,
}: PricingSelectionProps) {
  if (displayMode === DisplayMode.MINIMAL ?? damageMode === DamageMode.SEVERITY) {
    return null;
  }
  const { t } = useTranslation();
  return (
    <div style={{ ...styles['content'], ...(!hasDamage && styles['disable']) }}>
      <Title>{t('damageManipulator.repairCost')}</Title>
      <div>A pricing slider</div>
    </div>
  );
}
