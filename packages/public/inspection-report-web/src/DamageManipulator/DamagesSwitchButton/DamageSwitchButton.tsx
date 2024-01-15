import { useTranslation } from 'react-i18next';
import { SwitchButton } from '@monkvision/common-ui-web';
import { Title } from '../components';
import { styles } from './DamageSwitchButton.styles';

export interface DamageSwitchButtonProps {
  hasDamage: boolean;
  onSwitch?: (value: boolean) => void;
}

export function DamagesSwitchButton({ hasDamage, onSwitch }: DamageSwitchButtonProps) {
  const { t } = useTranslation();
  return (
    <div style={styles['content']}>
      <div>
        <Title>{t('damageManipulator.damages')}</Title>
        <div style={styles['subtitle']}>
          {t(`damageManipulator.${hasDamage ? 'damaged' : 'notDamaged'}`)}
        </div>
      </div>
      <SwitchButton checked={hasDamage} onSwitch={onSwitch} />
    </div>
  );
}
