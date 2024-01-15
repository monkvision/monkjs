import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Severity } from '@monkvision/types';
import { DamagesSwitchButton } from './DamagesSwitchButton';
import { SeveritySelection } from './SeveritySelection';
import { PricingSlider } from './PricingSlider';
import { DoneButton } from './DoneButton';
import { styles } from './DamageManipulator.styles';
import { DamageMode, DisplayMode, Damage } from './hook';

export interface DamageManipulatorProps {
  damageMode?: DamageMode;
  displayMode?: DisplayMode;
  onConfirm?: (damage: Damage) => void;
  damage?: Damage;
  // onToggleDamage;
  // isEditable;
}

export function DamageManipulator({
  damageMode = DamageMode.ALL,
  displayMode = DisplayMode.MINIMAL,
  damage,
  onConfirm,
}: DamageManipulatorProps) {
  const [hasDamage, setHasDamage] = useState<boolean>(!!damage);
  const [editedDamage, setEditedDamage] = useState(damage);

  const { t } = useTranslation();
  console.log(damageMode, displayMode, onConfirm, editedDamage);
  // function handleOnConfirm(value: boolean) {
  //   setHasDamage(value);
  // }
  function handleSeverityChange(key: Severity) {
    setEditedDamage((value) => ({ ...value, severity: key }));
  }
  return (
    <div style={styles['container']}>
      <DamagesSwitchButton hasDamage={hasDamage} onSwitch={(value) => setHasDamage(value)} />
      <SeveritySelection
        damage={editedDamage}
        hasDamage={hasDamage}
        displayMode={displayMode}
        damageMode={damageMode}
        onSeverityChange={handleSeverityChange}
      />
      <PricingSlider displayMode={displayMode} damageMode={damageMode} hasDamage={hasDamage} />
      <DoneButton>{t('damageManipulator.done')}</DoneButton>
    </div>
  );
}
