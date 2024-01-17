import { useTranslation } from 'react-i18next';
import { SwitchButton } from '@monkvision/common-ui-web';
import { Title, Content } from '../common';
import { styles } from './DamageSwitchButton.styles';

export interface DamageSwitchButtonProps {
  hasDamage: boolean;
  onSwitch?: () => void;
}

export function DamagesSwitchButton({ hasDamage, onSwitch }: DamageSwitchButtonProps) {
  const { t } = useTranslation();

  const translation = t(
    `damageManipulator.damagesSwitchBtn.${hasDamage ? 'damaged' : 'notDamaged'}`,
  );
  return (
    <Content>
      <div>
        <Title>{t('damageManipulator.damagesSwitchBtn.damages')}</Title>
        <div style={styles['subtitle']}>{translation}</div>
      </div>
      <SwitchButton checked={hasDamage} onSwitch={onSwitch} />
    </Content>
  );
}
