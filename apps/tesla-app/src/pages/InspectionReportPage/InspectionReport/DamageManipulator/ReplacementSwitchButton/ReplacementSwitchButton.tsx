import { useTranslation } from 'react-i18next';
import { SwitchButton } from '@monkvision/common-ui-web';
import { styles } from './ReplacementSwitchButton.styles';

export interface DamageSwitchButtonProps {
  hasDamage: boolean;
  onSwitch?: () => void;
}

export function ReplacementSwitchButton({ hasDamage, onSwitch }: DamageSwitchButtonProps) {
  const { t } = useTranslation();

  // const translation = t(
  //   `damageManipulator.damagesSwitchBtn.${hasDamage ? 'replaced' : 'notReplaced'}`,
  // );
  const translation = t(`damageManipulator.damagesSwitchBtn.replaced`);
  return (
    <div style={styles['container']}>
      <div>
        {/* <div>{t('damageManipulator.damagesSwitchBtn.damages')}</div> */}
        <div style={styles['subtitle']}>{translation}</div>
      </div>
      <SwitchButton checked={hasDamage} onSwitch={onSwitch} />
    </div>
  );
}
